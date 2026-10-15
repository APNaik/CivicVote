import React from 'react';
import { AuthSession, WalletState } from '../types';
import { ShieldCheck, Wallet, LogOut, BookOpen, Vote, BarChart3, Layers } from 'lucide-react';

interface NavbarProps {
  activeTab: 'ballot' | 'admin' | 'ledger' | 'docs';
  setActiveTab: (tab: 'ballot' | 'admin' | 'ledger' | 'docs') => void;
  session: AuthSession | null;
  wallet: WalletState;
  onConnectWallet: () => void;
  onLogout: () => void;
  onOpenWalletModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  session,
  wallet,
  onConnectWallet,
  onLogout,
  onOpenWalletModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <button
            onClick={() => setActiveTab('ballot')}
            className="text-left group focus:outline-none"
          >
            <span className="text-base font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors whitespace-nowrap">
              CivicVote <span className="text-emerald-400 font-normal">/ Ethereum</span>
            </span>
          </button>
        </div>

        {/* Zone 2: 4 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('ballot')}
            className={`flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'ballot'
                ? 'text-emerald-400 border-b-2 border-emerald-400 pb-1 pt-1 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Vote className="h-4 w-4" />
            <span>Voter Ballot</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'admin'
                ? 'text-emerald-400 border-b-2 border-emerald-400 pb-1 pt-1 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Admin Results & Audit</span>
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'ledger'
                ? 'text-emerald-400 border-b-2 border-emerald-400 pb-1 pt-1 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Immutable Blocks</span>
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'docs'
                ? 'text-emerald-400 border-b-2 border-emerald-400 pb-1 pt-1 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Setup & Architecture Guide</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action & wallet state */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Wallet Trigger */}
          {wallet.isConnected ? (
            <button
              onClick={onOpenWalletModal}
              className="flex items-center gap-2.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:border-slate-600 transition-colors whitespace-nowrap"
              title="Click to view MetaMask details"
            >
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="font-mono text-slate-200">
                {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
              </span>
              <span className="text-slate-500 hidden sm:inline">|</span>
              <span className="text-slate-400 hidden sm:inline text-[11px]">
                {wallet.networkName}
              </span>
            </button>
          ) : (
            <button
              onClick={onConnectWallet}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors whitespace-nowrap"
            >
              <Wallet className="h-3.5 w-3.5" />
              <span>Connect MetaMask</span>
            </button>
          )}

          {/* Session / Logout */}
          {session ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="hidden lg:block text-right">
                <p className="text-xs font-medium text-slate-200 truncate max-w-[120px]">
                  {session.name}
                </p>
                <p className="text-[10px] text-emerald-400 uppercase tracking-wider font-mono">
                  {session.role}
                </p>
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                title="Sign out & clear JWT session"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>

      </div>

      {/* Mobile nav bar row */}
      <div className="flex md:hidden border-t border-slate-800/80 bg-slate-950/95 px-4 py-2 justify-around text-xs">
        <button
          onClick={() => setActiveTab('ballot')}
          className={`flex items-center gap-1.5 py-1 px-2 rounded ${
            activeTab === 'ballot' ? 'text-emerald-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <Vote className="h-3.5 w-3.5" />
          <span>Ballot</span>
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`flex items-center gap-1.5 py-1 px-2 rounded ${
            activeTab === 'admin' ? 'text-emerald-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <BarChart3 className="h-3.5 w-3.5" />
          <span>Admin</span>
        </button>
        <button
          onClick={() => setActiveTab('ledger')}
          className={`flex items-center gap-1.5 py-1 px-2 rounded ${
            activeTab === 'ledger' ? 'text-emerald-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Ledger</span>
        </button>
        <button
          onClick={() => setActiveTab('docs')}
          className={`flex items-center gap-1.5 py-1 px-2 rounded ${
            activeTab === 'docs' ? 'text-emerald-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>Guide</span>
        </button>
      </div>
    </header>
  );
};
