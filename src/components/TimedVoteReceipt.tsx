import React, { useEffect, useState } from 'react';
import { VoteReceipt } from '../types';
import { ShieldAlert, CheckCircle2, Clock, Hash, Lock, Layers } from 'lucide-react';

interface TimedVoteReceiptProps {
  receipt: VoteReceipt;
  onSessionExpire: () => void;
}

export const TimedVoteReceipt: React.FC<TimedVoteReceiptProps> = ({
  receipt,
  onSessionExpire,
}) => {
  const TOTAL_DURATION_MS = 5000;
  const [remainingMs, setRemainingMs] = useState(TOTAL_DURATION_MS);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const left = Math.max(0, TOTAL_DURATION_MS - elapsed);
      setRemainingMs(left);

      if (left <= 0) {
        clearInterval(interval);
        onSessionExpire();
      }
    }, 40);

    return () => clearInterval(interval);
  }, [onSessionExpire]);

  const secondsLeft = (remainingMs / 1000).toFixed(2);
  const progressPercent = ((remainingMs / TOTAL_DURATION_MS) * 100).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-2xl border border-emerald-500/40 bg-slate-900 p-6 sm:p-8 shadow-2xl shadow-emerald-950/40 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Countdown Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <span className="text-sm font-bold text-white tracking-wide">
              Ballot Successfully Recorded
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs">
            <Clock className="h-3.5 w-3.5 animate-spin" />
            <span className="font-bold tabular-nums">{secondsLeft}s Auto-Lock</span>
          </div>
        </div>

        {/* Timed Bar Indicator */}
        <div className="mb-6">
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-75"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="mt-2 text-center text-xs text-amber-300/90 font-medium">
            Session auto-expiring in <span className="font-mono font-bold text-white">{secondsLeft}s</span> to preserve voter privacy & prevent coercion
          </p>
        </div>

        {/* Official Receipt Card */}
        <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-xs font-mono">
          <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
            <span className="text-slate-400">Candidate Selected:</span>
            <span className="font-semibold text-emerald-400 font-sans text-sm">
              {receipt.candidateName}
            </span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
            <span className="text-slate-400">Political Affiliation:</span>
            <span className="text-slate-200 font-sans">
              {receipt.candidateParty}
            </span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
            <span className="text-slate-400 flex items-center gap-1">
              <Layers className="h-3.5 w-3.5 text-slate-500" /> Block Height:
            </span>
            <span className="text-white font-bold">
              #{receipt.blockNumber} (Confirmed)
            </span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
            <span className="text-slate-400 flex items-center gap-1">
              <Hash className="h-3.5 w-3.5 text-slate-500" /> Transaction Hash:
            </span>
            <span className="text-slate-300 truncate max-w-[200px]" title={receipt.txHash}>
              {receipt.txHash.slice(0, 10)}...{receipt.txHash.slice(-8)}
            </span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
            <span className="text-slate-400">Keccak-256 Proof:</span>
            <span className="text-slate-300 truncate max-w-[200px]" title={receipt.voterProofHash}>
              {receipt.voterProofHash.slice(0, 10)}...{receipt.voterProofHash.slice(-8)}
            </span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400">Gas Used:</span>
            <span className="text-emerald-400">{receipt.gasUsed}</span>
          </div>
        </div>

        {/* Warning Footnote */}
        <div className="mt-5 flex items-start gap-2.5 rounded-lg bg-slate-950 p-3 text-[11px] text-slate-400 border border-slate-800">
          <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
          <p className="leading-relaxed">
            Per Section 4 of Decentralized Ballot Protocol, viewing access to your selected candidate is restricted to 5 seconds upon mining to satisfy ballot secrecy guidelines.
          </p>
        </div>

        {/* Manual Lock Now Action */}
        <div className="mt-5">
          <button
            type="button"
            onClick={onSessionExpire}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 py-2 px-4 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Lock Session & Invalidate JWT Now</span>
          </button>
        </div>

      </div>
    </div>
  );
};
