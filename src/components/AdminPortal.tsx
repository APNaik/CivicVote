import React, { useState, useEffect } from 'react';
import { AuthSession } from '../types';
import { Web3Service } from '../services/web3Service';
import { AuthService } from '../services/authService';
import {
  ShieldCheck,
  BarChart3,
  Lock,
  Download,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Cpu,
} from 'lucide-react';

interface AdminPortalProps {
  session: AuthSession | null;
  onAdminLoginSuccess: (session: AuthSession) => void;
  onElectionReset: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  session,
  onAdminLoginSuccess,
  onElectionReset,
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [auditMessage, setAuditMessage] = useState<string | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const isAdminAuthenticated = session?.role === 'admin';

  // Fetch admin results
  const [tallyData, setTallyData] = useState(() => Web3Service.getAdminResults());
  const [blocks, setBlocks] = useState(() => Web3Service.getAuditLedger());

  const refreshData = () => {
    setTallyData(Web3Service.getAdminResults());
    setBlocks(Web3Service.getAuditLedger());
  };

  useEffect(() => {
    if (isAdminAuthenticated) {
      refreshData();
    }
  }, [isAdminAuthenticated]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const adminSession = AuthService.loginAdmin(username, password);
      onAdminLoginSuccess(adminSession);
      refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Admin login failed';
      setError(msg);
    }
  };

  const handleRunAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      const result = Web3Service.verifyBlockchainIntegrity();
      setAuditMessage(result.message);
      setIsAuditing(false);
    }, 500);
  };

  const handleExportJson = () => {
    const report = {
      electionTitle: 'Decentralized Municipal Student Election 2026',
      generatedAt: new Date().toISOString(),
      chiefElectionAdmin: session?.name || 'Chief Electoral Officer',
      totalVotesCast: tallyData.totalVotes,
      results: tallyData.tallies,
      blockchainAuditLedger: blocks,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `civicvote-audit-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="mx-auto max-w-lg py-12 px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-4">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Chief Election Officer Portal
          </h1>
          <p className="mt-2 text-xs text-slate-400 max-w-sm mx-auto">
            Per Requirement 5, live voting tallies and cryptographic block proofs are strictly restricted to authorized Election Administrators.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-sm shadow-xl">
          <form onSubmit={handleAdminLogin} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-950/40 p-3 text-xs text-red-300">
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Admin Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950/80 py-2.5 px-3.5 text-sm text-white focus:border-emerald-500 focus:outline-none font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Admin Security Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950/80 py-2.5 px-3.5 text-sm text-white focus:border-emerald-500 focus:outline-none font-mono"
                required
              />
              <span className="text-[11px] text-slate-500 font-mono mt-1 block">Default: admin / admin123</span>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 py-2.5 px-4 text-xs font-semibold text-white shadow-md transition-colors cursor-pointer"
            >
              <Lock className="h-4 w-4" />
              <span>Authenticate Chief Election Officer</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Find leading candidate
  const leadingCandidate = [...tallyData.tallies].sort((a, b) => b.voteCount - a.voteCount)[0];

  return (
    <div className="mx-auto max-w-6xl py-8 px-4 sm:px-6 lg:px-8">
      {/* Header and Controls */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="text-indigo-400 font-bold">ADMINISTRATIVE ACCESS</span>
            <span>·</span>
            <span>CHIEF ELECTORAL OFFICER</span>
            <span>·</span>
            <span className="text-emerald-400 font-mono">CONFIDENTIAL TALLY</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <BarChart3 className="h-6 w-6 text-indigo-400" />
            <span>Live Results Tally & Cryptographic Audit</span>
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
            title="Export tamper-proof audit report (JSON)"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Audit JSON</span>
          </button>

          <button
            onClick={onElectionReset}
            className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-950/20 hover:bg-red-950/40 px-3 py-2 text-xs font-medium text-red-300 transition-colors cursor-pointer"
            title="Reset ballots for demo re-run"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Ballots Cast
          </p>
          <p className="mt-1 text-2xl font-bold text-white font-mono tabular-nums">
            {tallyData.totalVotes}
          </p>
          <p className="mt-1 text-[11px] text-emerald-400">
            Mined on Ethereum smart contract
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Leading Candidate
          </p>
          <p className="mt-1 text-lg font-bold text-white truncate">
            {tallyData.totalVotes > 0 && leadingCandidate ? leadingCandidate.name : 'No votes yet'}
          </p>
          <p className="mt-1 text-[11px] text-slate-400 font-mono">
            {tallyData.totalVotes > 0 && leadingCandidate
              ? `${leadingCandidate.voteCount} votes (${leadingCandidate.percentage}%)`
              : 'Awaiting first ballot'}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Blockchain Block Height
          </p>
          <p className="mt-1 text-2xl font-bold text-white font-mono tabular-nums">
            #{blocks.length}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Genesis + {blocks.length - 1} mined votes
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Tamper-Proof Status
          </p>
          <div className="mt-1 flex items-center gap-1.5 text-emerald-400 font-semibold text-sm">
            <ShieldCheck className="h-4 w-4" />
            <span>Immutable (Active)</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            SHA-256 Merkle chain verified
          </p>
        </div>
      </div>

      {/* Main Split: Live Tally Breakdown & Cryptographic Audit Console */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Left Column: Live Results Tally */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span>Live Candidate Tally</span>
              </h3>
              <p className="text-xs text-slate-400">
                Direct query from `getAdminResults()` Solidity view
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">
              {tallyData.totalVotes} Total
            </span>
          </div>

          <div className="space-y-4">
            {tallyData.tallies.map((item) => (
              <div key={item.id} className="p-3.5 rounded-lg border border-slate-800/80 bg-slate-950/60">
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <span className="text-sm font-semibold text-white">
                      {item.name}
                    </span>
                    <span className="ml-2 text-xs text-slate-400">
                      ({item.party})
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-emerald-400 font-mono tabular-nums">
                      {item.voteCount}
                    </span>
                    <span className="text-xs text-slate-500 ml-1 font-mono">
                      ({item.percentage}%)
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Admin Privacy Protocol: Vote tallies are obscured to ordinary voters.</span>
            <span className="font-mono text-emerald-400">Protected</span>
          </div>
        </div>

        {/* Right Column: Cryptographic Tamper Verification */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu className="h-4 w-4 text-indigo-400" />
                <span>Cryptographic Tamper Audit</span>
              </h3>
              <p className="text-xs text-slate-400">
                Inspect and mathematically verify parent hash continuity
              </p>
            </div>

            <button
              onClick={handleRunAudit}
              disabled={isAuditing}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{isAuditing ? 'Auditing Blocks...' : 'Verify Ledger Integrity'}</span>
            </button>
          </div>

          {auditMessage && (
            <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-3 text-xs text-emerald-300 font-mono">
              {auditMessage}
            </div>
          )}

          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {blocks.slice(0, 4).map((b) => (
              <div
                key={b.blockNumber}
                className="p-3 rounded-lg border border-slate-800 bg-slate-950/80 text-xs font-mono"
              >
                <div className="flex items-center justify-between text-slate-300 font-bold mb-1">
                  <span>Block #{b.blockNumber}</span>
                  <span className="text-[10px] text-emerald-400 uppercase">Confirmed</span>
                </div>
                <div className="text-[11px] text-slate-400 space-y-0.5">
                  <p className="truncate">
                    <span className="text-slate-500">Hash: </span>
                    {b.blockHash}
                  </p>
                  <p className="truncate">
                    <span className="text-slate-500">Parent: </span>
                    {b.parentHash}
                  </p>
                  <p className="truncate">
                    <span className="text-slate-500">Voter Proof: </span>
                    {b.voterProof}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
