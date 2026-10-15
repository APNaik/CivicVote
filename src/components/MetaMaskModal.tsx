import React from 'react';
import { WalletState } from '../types';
import { X, Wallet, CheckCircle2, AlertCircle, ExternalLink, HardDrive, Cpu } from 'lucide-react';

interface MetaMaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: WalletState;
  onConnectMetaMask: () => void;
  onSelectSandbox: () => void;
}

export const MetaMaskModal: React.FC<MetaMaskModalProps> = ({
  isOpen,
  onClose,
  wallet,
  onConnectMetaMask,
  onSelectSandbox,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              Ethereum Wallet Manager
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current Connection Status */}
        {wallet.isConnected ? (
          <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Wallet Connected ({wallet.providerType === 'metamask' ? 'MetaMask' : 'Sandbox EVM'})</span>
            </div>

            <div className="space-y-1.5 text-xs font-mono text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Address:</span>
                <span className="text-white truncate max-w-[200px]" title={wallet.address || ''}>
                  {wallet.address}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Network:</span>
                <span className="text-emerald-400">{wallet.networkName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Test Balance:</span>
                <span className="text-slate-200">{wallet.balanceEth} ETH</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-1">
              <AlertCircle className="h-4 w-4 text-amber-400" />
              <span>No Wallet Connected</span>
            </div>
            <p className="text-xs text-slate-400">
              Connect your MetaMask browser extension or select the simulated node for instant testing.
            </p>
          </div>
        )}

        {/* Action Options */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => {
              onConnectMetaMask();
              onClose();
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-950 hover:border-emerald-500 hover:bg-slate-900 transition-all text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                  MetaMask Injected Extension
                </p>
                <p className="text-[11px] text-slate-400">
                  {wallet.isMetaMaskAvailable
                    ? 'Extension detected in browser (window.ethereum)'
                    : 'MetaMask not detected (install extension)'}
                </p>
              </div>
            </div>
            {wallet.providerType === 'metamask' && wallet.isConnected && (
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Active</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectSandbox();
              onClose();
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-950 hover:border-emerald-500 hover:bg-slate-900 transition-all text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Hardhat Localhost Node (31337)
                </p>
                <p className="text-[11px] text-slate-400">
                  Zero setup EVM sandbox with pre-funded 100 ETH
                </p>
              </div>
            </div>
            {wallet.providerType === 'simulated-evm' && wallet.isConnected && (
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Active</span>
            )}
          </button>
        </div>

        {/* Install Link if not found */}
        {!wallet.isMetaMaskAvailable && (
          <div className="mt-5 pt-4 border-t border-slate-800 text-center">
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              <span>Download MetaMask Extension</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
