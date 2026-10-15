export interface Candidate {
  id: number;
  name: string;
  party: string;
  manifesto: string;
  avatarUrl?: string;
  symbol: string;
  color: string;
  voteCount?: number; // Only exposed to authenticated admin
}

export interface VoterUser {
  voterId: string;
  name: string;
  constituency: string;
  hasVoted: boolean;
  votedCandidateId?: number;
  walletAddress?: string;
}

export interface AuthSession {
  token: string;
  voterId: string;
  name: string;
  role: 'voter' | 'admin';
  expiresAt: number;
}

export interface VoteReceipt {
  txHash: string;
  blockNumber: number;
  timestamp: number;
  candidateId: number;
  candidateName: string;
  candidateParty: string;
  voterProofHash: string;
  gasUsed: string;
  confirmations: number;
}

export interface AdminTallyItem {
  id: number;
  name: string;
  party: string;
  voteCount: number;
  percentage: number;
}

export interface BlockchainBlock {
  blockNumber: number;
  blockHash: string;
  parentHash: string;
  timestamp: number;
  txHash: string;
  candidateId: number;
  voterProof: string;
  merkleRoot: string;
  status: 'confirmed' | 'pending';
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  networkName: string;
  balanceEth: string;
  providerType: 'metamask' | 'simulated-evm';
  isMetaMaskAvailable: boolean;
  error?: string | null;
}
