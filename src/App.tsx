/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AuthSession, WalletState, VoteReceipt } from './types';
import { AuthService } from './services/authService';
import { Web3Service } from './services/web3Service';
import { Navbar } from './components/Navbar';
import { VoterLogin } from './components/VoterLogin';
import { CandidateBallot } from './components/CandidateBallot';
import { TimedVoteReceipt } from './components/TimedVoteReceipt';
import { AdminPortal } from './components/AdminPortal';
import { ImmutableLedger } from './components/ImmutableLedger';
import { ProjectDocs } from './components/ProjectDocs';
import { MetaMaskModal } from './components/MetaMaskModal';
import { ShieldCheck, Lock, ArrowRight, RefreshCw, Layers } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'ballot' | 'admin' | 'ledger' | 'docs'>('ballot');
  const [session, setSession] = useState<AuthSession | null>(() => AuthService.getActiveSession());
  const [activeReceipt, setActiveReceipt] = useState<VoteReceipt | null>(null);
  const [sessionLockedNotice, setSessionLockedNotice] = useState<boolean>(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  // Wallet State
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    chainId: null,
    networkName: 'Not Connected',
    balanceEth: '0.0000',
    providerType: 'metamask',
    isMetaMaskAvailable: Web3Service.isMetaMaskInstalled(),
    error: null,
  });

  // Connect to MetaMask
  const handleConnectMetaMask = useCallback(async () => {
    try {
      const state = await Web3Service.connectMetaMask();
      setWallet(state);
    } catch {
      // If MetaMask is not present or user prefers, fallback to sandbox
      const sim = Web3Service.connectSimulatedWallet(session?.voterId);
      setWallet(sim);
    }
  }, [session?.voterId]);

  // Connect to Sandbox EVM
  const handleSelectSandbox = useCallback(() => {
    const sim = Web3Service.connectSimulatedWallet(session?.voterId);
    setWallet(sim);
  }, [session?.voterId]);

  // Initialize Web3 services and auto-connect sandbox or detect metamask
  useEffect(() => {
    Web3Service.initialize();
    if (Web3Service.isMetaMaskInstalled()) {
      handleConnectMetaMask();
    } else {
      // Default to Hardhat Localhost Sandbox so app works out of the box
      handleSelectSandbox();
    }
  }, [handleConnectMetaMask, handleSelectSandbox]);

  // Invalidate session on 5-second timeout (Requirement 4)
  const handleSessionExpire = () => {
    setActiveReceipt(null);
    AuthService.logout();
    setSession(null);
    setSessionLockedNotice(true);
  };

  const handleLogout = () => {
    AuthService.logout();
    setSession(null);
    setSessionLockedNotice(false);
  };

  const handleResetElection = () => {
    AuthService.resetElectionDemo();
    Web3Service.resetLedgerDemo();
    setSession(null);
    setActiveReceipt(null);
    setSessionLockedNotice(false);
    handleSelectSandbox();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSessionLockedNotice(false);
        }}
        session={session}
        wallet={wallet}
        onConnectWallet={handleConnectMetaMask}
        onLogout={handleLogout}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
      />

      {/* 5-Second Timed Confirmation Receipt Modal (Requirement 4) */}
      {activeReceipt && (
        <TimedVoteReceipt
          receipt={activeReceipt}
          onSessionExpire={handleSessionExpire}
        />
      )}

      {/* MetaMask Management Modal */}
      <MetaMaskModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        wallet={wallet}
        onConnectMetaMask={handleConnectMetaMask}
        onSelectSandbox={handleSelectSandbox}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Tab 1: Voter Ballot & Login */}
        {activeTab === 'ballot' && (
          <>
            {sessionLockedNotice ? (
              <div className="mx-auto max-w-lg py-16 px-4 text-center animate-in fade-in zoom-in-95 duration-200">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Ballot Sealed & Session Auto-Locked
                </h2>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
                  Your 5-second ballot review window has expired. To enforce total voter privacy and prevent post-voting coercion, your JWT authentication token was permanently destroyed.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setSessionLockedNotice(false);
                      setActiveTab('ballot');
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 text-xs font-semibold text-white shadow-md transition-colors cursor-pointer"
                  >
                    <span>Voter Login Portal</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => {
                      setSessionLockedNotice(false);
                      setActiveTab('ledger');
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 px-5 py-2.5 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                  >
                    <Layers className="h-4 w-4" />
                    <span>View Block in Immutable Ledger</span>
                  </button>
                </div>
              </div>
            ) : session?.role === 'voter' ? (
              <CandidateBallot
                session={session}
                wallet={wallet}
                onConnectWallet={handleConnectMetaMask}
                onVoteCastSuccess={(receipt) => setActiveReceipt(receipt)}
              />
            ) : (
              <VoterLogin
                onLoginSuccess={(newSession) => setSession(newSession)}
                onSwitchToAdmin={() => setActiveTab('admin')}
              />
            )}
          </>
        )}

        {/* Tab 2: Admin Portal (Requirement 5) */}
        {activeTab === 'admin' && (
          <AdminPortal
            session={session}
            onAdminLoginSuccess={(adminSession) => setSession(adminSession)}
            onElectionReset={handleResetElection}
          />
        )}

        {/* Tab 3: Immutable Blockchain Ledger */}
        {activeTab === 'ledger' && <ImmutableLedger />}

        {/* Tab 4: Project Setup & Architecture Documentation */}
        {activeTab === 'docs' && <ProjectDocs />}
      </main>

      {/* Civic Footer with Academic Project Metadata */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 px-4 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Decentralized Voting System</span>
            <span>·</span>
            <span>Blockchain Mini Project Prototype</span>
            <span>·</span>
            <span className="font-mono text-emerald-500">Solidity & Ethereum</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setActiveTab('docs')}
              className="text-slate-400 hover:text-emerald-400 transition-colors"
            >
              Setup Guide & Viva Q&A
            </button>
            <span>·</span>
            <button
              onClick={handleResetElection}
              className="text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1"
              title="Reset all demo voter state"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Reset Demo State</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
