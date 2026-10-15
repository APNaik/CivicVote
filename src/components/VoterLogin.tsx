import React, { useState } from 'react';
import { AuthService } from '../services/authService';
import { AuthSession } from '../types';
import { KeyRound, Shield, UserCheck, AlertCircle, ArrowRight, Lock } from 'lucide-react';

interface VoterLoginProps {
  onLoginSuccess: (session: AuthSession) => void;
  onSwitchToAdmin: () => void;
}

export const VoterLogin: React.FC<VoterLoginProps> = ({ onLoginSuccess, onSwitchToAdmin }) => {
  const [voterId, setVoterId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sampleVoters = AuthService.getAllVoters();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!voterId.trim()) {
        throw new Error('Please enter your government or institution Voter ID.');
      }
      if (!password) {
        throw new Error('Please enter your voter password.');
      }

      const { session, voter } = AuthService.loginVoter(voterId, password);
      if (voter.hasVoted) {
        throw new Error(`Voter record indicates that ${voter.name} (${voter.voterId}) has already cast a ballot. One-person-one-vote rule enforced.`);
      }

      onLoginSuccess(session);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const selectQuickVoter = (id: string) => {
    setVoterId(id);
    setPassword('voter123');
    setError(null);
  };

  return (
    <div className="mx-auto max-w-xl py-12 px-4 sm:px-6">
      {/* Title & Civic Assurance Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4">
          <Shield className="h-6 w-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Civic Electoral Authorization
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
          Authenticate using your government or institutional Voter ID. A cryptographically signed JWT session token will be issued for smart contract verification.
        </p>
      </div>

      {/* Main Login Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-sm shadow-xl">
        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-950/40 p-3.5 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
              <div className="flex-1 leading-relaxed">{error}</div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Voter Identification Number
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <UserCheck className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={voterId}
                onChange={(e) => setVoterId(e.target.value)}
                placeholder="e.g. VOTER-2026-001"
                className="w-full rounded-lg border border-slate-700 bg-slate-950/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                required
              />
            </div>
            <p className="mt-1.5 text-[11px] text-slate-500">
              Standard format: VOTER-YYYY-XXX (Verified against official electoral roll)
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Voter Access Password
              </label>
              <span className="text-[11px] text-slate-500 font-mono">Default: voter123</span>
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-lg border border-slate-700 bg-slate-950/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 py-2.5 px-4 text-sm font-semibold text-white shadow-md transition-colors disabled:opacity-50 cursor-pointer"
          >
            <KeyRound className="h-4 w-4" />
            <span>{isLoading ? 'Verifying Credentials...' : 'Authenticate & Issue Voter Token'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Quick Demo Preloaded Voters Section */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Quick Pick Demo Voters (Click to Auto-Fill)
            </span>
            <span className="text-[11px] text-slate-500">For academic viva/evaluation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sampleVoters.map((v) => (
              <button
                key={v.voterId}
                type="button"
                onClick={() => selectQuickVoter(v.voterId)}
                className={`flex items-center justify-between p-2.5 text-left rounded-lg border text-xs transition-all ${
                  voterId === v.voterId
                    ? 'border-emerald-500 bg-emerald-950/20 text-white'
                    : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <p className="font-semibold text-slate-200 truncate">{v.name}</p>
                  <p className="text-[11px] font-mono text-slate-400">{v.voterId}</p>
                </div>
                <div className="shrink-0 text-right">
                  {v.hasVoted ? (
                    <span className="text-[10px] text-amber-400 font-medium">Voted</span>
                  ) : (
                    <span className="text-[10px] text-emerald-400 font-medium">Eligible</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Officer Switch Link */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Election Officer or Admin?</span>
          <button
            type="button"
            onClick={onSwitchToAdmin}
            className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors cursor-pointer"
          >
            Access Admin Verification Portal →
          </button>
        </div>
      </div>
    </div>
  );
};
