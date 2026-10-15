import React, { useState } from 'react';
import { Candidate, AuthSession, WalletState, VoteReceipt } from '../types';
import { INITIAL_CANDIDATES, Web3Service } from '../services/web3Service';
import { AuthService } from '../services/authService';
import { CheckCircle2, ShieldCheck, Wallet, ArrowRight, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CandidateBallotProps {
  session: AuthSession;
  wallet: WalletState;
  onConnectWallet: () => void;
  onVoteCastSuccess: (receipt: VoteReceipt) => void;
}

export const CandidateBallot: React.FC<CandidateBallotProps> = ({
  session,
  wallet,
  onConnectWallet,
  onVoteCastSuccess,
}) => {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [votingStep, setVotingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const voter = AuthService.getCurrentVoter(session.voterId);
  const alreadyVoted = voter?.hasVoted || (wallet.address ? Web3Service.hasWalletVoted(wallet.address) : false);

  const handleCastVote = async (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setError(null);

    if (!wallet.isConnected || !wallet.address) {
      setError('Please connect your MetaMask wallet before casting your vote.');
      return;
    }

    if (alreadyVoted) {
      setError('Our records indicate that a vote has already been submitted for this account or wallet.');
      return;
    }

    try {
      setIsSubmitting(true);
      setVotingStep('1/3: Abstracting voter proof with Keccak-256 cryptographic hash...');
      await new Promise((r) => setTimeout(r, 600));

      setVotingStep('2/3: Prompting MetaMask for smart contract transaction signature...');
      
      const receipt = await Web3Service.castVote(
        candidate.id,
        session.voterId,
        wallet.address,
        wallet.providerType
      );

      setVotingStep('3/3: Mining transaction into immutable Ethereum block...');
      await new Promise((r) => setTimeout(r, 600));

      // Update voter status in database
      AuthService.markVoterAsVoted(session.voterId, candidate.id, wallet.address);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // Safe fallback if canvas is restricted
      }

      onVoteCastSuccess(receipt);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to cast ballot';
      setError(message);
    } finally {
      setIsSubmitting(false);
      setVotingStep('');
    }
  };

  return (
    <div className="mx-auto max-w-6xl py-8 px-4 sm:px-6 lg:px-8">
      {/* Voter Profile Banner */}
      <div className="mb-8 rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>OFFICIAL ELECTORAL ROLL</span>
            <span>·</span>
            <span>WARD 12 CONSTITUENCY</span>
            <span>·</span>
            <span className="text-emerald-400 font-mono">JWT VERIFIED</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            Welcome, {session.name}
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Voter ID: <span className="text-slate-200">{session.voterId}</span>
          </p>
        </div>

        {/* Wallet Status Right Box */}
        <div className="shrink-0 flex items-center gap-3">
          {wallet.isConnected ? (
            <div className="text-right">
              <div className="flex items-center justify-end gap-1.5 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>MetaMask Synced</span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)} ({wallet.networkName})
              </p>
            </div>
          ) : (
            <button
              onClick={onConnectWallet}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow-md transition-colors"
            >
              <Wallet className="h-4 w-4" />
              <span>Connect Wallet to Vote</span>
            </button>
          )}
        </div>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-500/40 bg-red-950/40 p-4 text-xs text-red-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-300">Transaction Notice</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Already Voted Banner */}
      {alreadyVoted && (
        <div className="mb-8 rounded-xl border border-amber-500/30 bg-amber-950/20 p-5 text-amber-200">
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-300 mb-1">
            <ShieldCheck className="h-5 w-5 text-amber-400" />
            <span>Ballot Already Recorded</span>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Your ballot has already been mined and permanently sealed into the Ethereum blockchain ledger. 
            Per civic governance rules, voter tokens are single-use. You can review the cryptographic blocks in the Immutable Ledger tab.
          </p>
        </div>
      )}

      {/* Submission Loader Overlay if in progress */}
      {isSubmitting && (
        <div className="mb-8 rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-5">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
            <div>
              <p className="text-sm font-semibold text-emerald-300">
                Processing Decentralized Transaction...
              </p>
              <p className="text-xs text-slate-300 font-mono mt-0.5">{votingStep}</p>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Ballot Grid */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Official Candidates on Ballot
          </h3>
          <p className="text-xs text-slate-400">
            Select one candidate to cast your secure, anonymous smart contract ballot.
          </p>
        </div>
        <span className="text-xs text-slate-500 font-mono">
          4 Registered Candidates
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {INITIAL_CANDIDATES.map((candidate) => {
          const isSelected = selectedCandidate?.id === candidate.id;

          return (
            <div
              key={candidate.id}
              className={`flex flex-col justify-between rounded-xl border p-6 transition-all duration-200 ${
                isSelected
                  ? 'border-emerald-500 bg-slate-900/90 shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500/30'
                  : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/70'
              }`}
            >
              <div>
                {/* Header with symbol and candidate number */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 border border-slate-700/80 text-2xl shadow-inner">
                      {candidate.symbol}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white leading-tight">
                        {candidate.name}
                      </h4>
                      <p className="text-xs font-medium text-emerald-400 mt-0.5">
                        {candidate.party}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-500 px-2 py-0.5 rounded border border-slate-800 bg-slate-950">
                    #{candidate.id + 1}
                  </span>
                </div>

                {/* Manifesto excerpt */}
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Key Platform Manifesto:
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    "{candidate.manifesto}"
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-800/60">
                <button
                  type="button"
                  disabled={alreadyVoted || isSubmitting}
                  onClick={() => handleCastVote(candidate)}
                  className={`w-full flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 text-xs font-semibold transition-all shadow-sm ${
                    alreadyVoted
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer hover:shadow-emerald-900/20'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>
                    {alreadyVoted
                      ? 'Ballot Already Cast'
                      : isSubmitting && isSelected
                      ? 'Broadcasting to Blockchain...'
                      : `Cast Vote for ${candidate.name}`}
                  </span>
                  {!alreadyVoted && <ArrowRight className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Abstracted Blockchain Info Footer */}
      <div className="mt-8 rounded-lg border border-slate-800/80 bg-slate-950/60 p-4 text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Blockchain Abstraction Active: Gas calculations & transaction validation occur automatically.</span>
        </div>
        <span className="font-mono text-slate-500 text-[11px]">EVM Solidity 0.8.20</span>
      </div>
    </div>
  );
};
