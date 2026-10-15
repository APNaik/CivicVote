import { AuthSession, VoterUser } from '../types';

// Pre-seeded verified voters for testing and demonstration
const DEFAULT_VOTERS: VoterUser[] = [
  { voterId: 'VOTER-2026-001', name: 'Aarav Sharma', constituency: 'Ward 12 - Metro District', hasVoted: false },
  { voterId: 'VOTER-2026-002', name: 'Sophia Chen', constituency: 'Ward 08 - Tech Corridor', hasVoted: false },
  { voterId: 'VOTER-2026-003', name: 'Marcus Vance', constituency: 'Ward 15 - Riverside', hasVoted: false },
  { voterId: 'VOTER-2026-004', name: 'Elena Rostova', constituency: 'Ward 03 - Uptown', hasVoted: false },
  { voterId: 'VOTER-2026-005', name: 'Priya Patel', constituency: 'Ward 21 - University Campus', hasVoted: false },
];

const VOTER_PASSWORDS: Record<string, string> = {
  'VOTER-2026-001': 'voter123',
  'VOTER-2026-002': 'voter123',
  'VOTER-2026-003': 'voter123',
  'VOTER-2026-004': 'voter123',
  'VOTER-2026-005': 'voter123',
};

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
  name: 'Chief Electoral Officer',
};

const STORAGE_KEYS = {
  SESSION: 'civicvote_jwt_session',
  VOTERS: 'civicvote_voters_db',
  PASSWORDS: 'civicvote_passwords_db',
};

/**
 * Simple Base64URL encoder for standard JWT structure
 */
function base64UrlEncode(str: string): string {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Simple Base64URL decoder for standard JWT structure
 */
function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return atob(base64);
}

/**
 * Generate cryptographic mock JWT signed token
 * Header.Payload.Signature
 */
function createJwtToken(payload: Record<string, unknown>, secret = 'ethereum-voting-jwt-secret-key-2026'): string {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  
  // Synthetic HMAC-SHA256 signature representation for web sandbox
  const signatureInput = `${encodedHeader}.${encodedPayload}`;
  let hash = 0;
  for (let i = 0; i < signatureInput.length; i++) {
    const char = signatureInput.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const encodedSignature = base64UrlEncode(`sig_${Math.abs(hash)}_${secret.slice(0, 8)}`);

  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

export class AuthService {
  private static getVoters(): VoterUser[] {
    const saved = localStorage.getItem(STORAGE_KEYS.VOTERS);
    if (!saved) {
      localStorage.setItem(STORAGE_KEYS.VOTERS, JSON.stringify(DEFAULT_VOTERS));
      return DEFAULT_VOTERS;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return DEFAULT_VOTERS;
    }
  }

  private static saveVoters(voters: VoterUser[]): void {
    localStorage.setItem(STORAGE_KEYS.VOTERS, JSON.stringify(voters));
  }

  /**
   * Voter Login with Voter ID & Password
   */
  public static loginVoter(voterId: string, password: string): { session: AuthSession; voter: VoterUser } {
    const trimmedId = voterId.trim().toUpperCase();
    const voters = this.getVoters();
    const voter = voters.find((v) => v.voterId.toUpperCase() === trimmedId);

    if (!voter) {
      throw new Error(`Invalid Voter ID. Please check your credentials or select a sample voter.`);
    }

    const expectedPass = VOTER_PASSWORDS[voter.voterId] || 'voter123';
    if (password !== expectedPass) {
      throw new Error('Incorrect password for this Voter ID.');
    }

    // Token expires in 15 minutes (or 5 seconds auto-lock upon casting vote)
    const expiresAt = Date.now() + 15 * 60 * 1000;
    const token = createJwtToken({
      sub: voter.voterId,
      name: voter.name,
      role: 'voter',
      hasVoted: voter.hasVoted,
      exp: Math.floor(expiresAt / 1000),
      iat: Math.floor(Date.now() / 1000),
    });

    const session: AuthSession = {
      token,
      voterId: voter.voterId,
      name: voter.name,
      role: 'voter',
      expiresAt,
    };

    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    return { session, voter };
  }

  /**
   * Admin Login for Election Officers
   */
  public static loginAdmin(username: string, password: string): AuthSession {
    if (
      username.trim().toLowerCase() !== ADMIN_CREDENTIALS.username ||
      password !== ADMIN_CREDENTIALS.password
    ) {
      throw new Error('Invalid Administrator credentials. Default is admin / admin123');
    }

    const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour admin session
    const token = createJwtToken({
      sub: 'ADMIN-CHIEF',
      name: ADMIN_CREDENTIALS.name,
      role: 'admin',
      exp: Math.floor(expiresAt / 1000),
      iat: Math.floor(Date.now() / 1000),
    });

    const session: AuthSession = {
      token,
      voterId: 'ADMIN-CHIEF',
      name: ADMIN_CREDENTIALS.name,
      role: 'admin',
      expiresAt,
    };

    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    return session;
  }

  /**
   * Retrieve active session if valid
   */
  public static getActiveSession(): AuthSession | null {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!raw) return null;
    try {
      const session: AuthSession = JSON.parse(raw);
      if (Date.now() > session.expiresAt) {
        this.logout();
        return null;
      }
      return session;
    } catch {
      this.logout();
      return null;
    }
  }

  /**
   * Get current voter details
   */
  public static getCurrentVoter(voterId: string): VoterUser | null {
    const voters = this.getVoters();
    return voters.find((v) => v.voterId.toUpperCase() === voterId.toUpperCase()) || null;
  }

  /**
   * Update voter state after casting smart contract vote
   */
  public static markVoterAsVoted(voterId: string, candidateId: number, walletAddress?: string): void {
    const voters = this.getVoters();
    const updated = voters.map((v) => {
      if (v.voterId.toUpperCase() === voterId.toUpperCase()) {
        return {
          ...v,
          hasVoted: true,
          votedCandidateId: candidateId,
          walletAddress: walletAddress || v.walletAddress,
        };
      }
      return v;
    });
    this.saveVoters(updated);
  }

  /**
   * Reset election data for testing/demo purposes
   */
  public static resetElectionDemo(): void {
    localStorage.setItem(STORAGE_KEYS.VOTERS, JSON.stringify(DEFAULT_VOTERS));
    this.logout();
  }

  /**
   * Logout and purge JWT session immediately
   */
  public static logout(): void {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  }

  /**
   * Get all registered voters (for admin view)
   */
  public static getAllVoters(): VoterUser[] {
    return this.getVoters();
  }
}
