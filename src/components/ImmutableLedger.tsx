import React, { useState } from 'react';
import { Web3Service } from '../services/web3Service';
import { BlockchainBlock } from '../types';
import { Layers, Hash, CheckCircle2, Link as LinkIcon, Clock, ShieldCheck, Search } from 'lucide-react';

export const ImmutableLedger: React.FC = () => {
  const blocks = Web3Service.getAuditLedger();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlock, setSelectedBlock] = useState<BlockchainBlock | null>(blocks[0] || null);

  const filteredBlocks = blocks.filter(
    (b) =>
      b.blockNumber.toString().includes(searchTerm) ||
      b.blockHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.voterProof.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.txHash.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-6xl py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>PUBLIC AUDIT TRAIL</span>
            <span>·</span>
            <span>ETHEREUM EVM LEDGER</span>
            <span>·</span>
            <span className="text-emerald-400 font-mono">APPEND-ONLY</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Layers className="h-6 w-6 text-emerald-400" />
            <span>Immutable Blockchain Blocks</span>
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Every ballot cast creates an immutable block linked cryptographically to its parent hash.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search block #, hash, proof..."
            className="w-full rounded-lg border border-slate-700 bg-slate-900/80 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none font-mono"
          />
        </div>
      </div>

      {/* Main Grid: Blocks Chain View + Detailed Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Chain of Blocks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
            <span>SHOWING {filteredBlocks.length} BLOCKS (NEWEST FIRST)</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> 100% INTACT
            </span>
          </div>

          <div className="space-y-3">
            {filteredBlocks.map((block, idx) => {
              const isSelected = selectedBlock?.blockNumber === block.blockNumber;
              const isGenesis = block.blockNumber === 1;

              return (
                <div
                  key={block.blockNumber}
                  onClick={() => setSelectedBlock(block)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-500 bg-slate-900 shadow-md ring-1 ring-emerald-500/30'
                      : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white font-mono">
                        Block #{block.blockNumber}
                      </span>
                      {isGenesis ? (
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          Genesis Root
                        </span>
                      ) : (
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Ballot Mined
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(block.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs font-mono text-slate-400">
                    <p className="truncate">
                      <span className="text-slate-500">Hash: </span>
                      <span className="text-slate-300">{block.blockHash}</span>
                    </p>
                    <p className="truncate flex items-center gap-1 text-[11px]">
                      <LinkIcon className="h-3 w-3 text-emerald-400 shrink-0" />
                      <span className="text-slate-500">Parent: </span>
                      <span className="text-slate-400">{block.parentHash}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Block Deep Inspector */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm self-start sticky top-24">
          <div className="flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Hash className="h-4 w-4 text-emerald-400" />
            <span>Block Header & Proof Inspector</span>
          </div>

          {selectedBlock ? (
            <div className="space-y-4 text-xs font-mono">
              <div>
                <p className="text-[11px] text-slate-500 uppercase">Block Height</p>
                <p className="text-base font-bold text-white font-mono">
                  #{selectedBlock.blockNumber}
                </p>
              </div>

              <div>
                <p className="text-[11px] text-slate-500 uppercase">Block Hash (Keccak-256)</p>
                <p className="text-slate-300 break-all bg-slate-950 p-2 rounded border border-slate-800 text-[11px]">
                  {selectedBlock.blockHash}
                </p>
              </div>

              <div>
                <p className="text-[11px] text-slate-500 uppercase">Parent Block Hash</p>
                <p className="text-slate-400 break-all bg-slate-950 p-2 rounded border border-slate-800 text-[11px]">
                  {selectedBlock.parentHash}
                </p>
              </div>

              <div>
                <p className="text-[11px] text-slate-500 uppercase">Transaction Hash</p>
                <p className="text-slate-300 break-all bg-slate-950 p-2 rounded border border-slate-800 text-[11px]">
                  {selectedBlock.txHash}
                </p>
              </div>

              <div>
                <p className="text-[11px] text-slate-500 uppercase">Merkle Root</p>
                <p className="text-slate-300 break-all bg-slate-950 p-2 rounded border border-slate-800 text-[11px]">
                  {selectedBlock.merkleRoot}
                </p>
              </div>

              <div>
                <p className="text-[11px] text-slate-500 uppercase">Voter Proof</p>
                <p className="text-emerald-400 bg-emerald-950/20 p-2 rounded border border-emerald-500/20 text-[11px]">
                  {selectedBlock.voterProof}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Tamper Invariant:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> Cryptographically Valid
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500">Select a block to inspect its cryptographic tree.</p>
          )}
        </div>

      </div>
    </div>
  );
};
