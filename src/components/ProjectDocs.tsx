import React, { useState } from 'react';
import {
  Terminal,
  FileCode,
  Layers,
  KeyRound,
  BookOpen,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  Cpu,
} from 'lucide-react';

export const ProjectDocs: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'setup' | 'solidity' | 'metamask' | 'jwt' | 'architecture' | 'viva'>('setup');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="mx-auto max-w-6xl py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
          <span>PROJECT DOCUMENTATION</span>
          <span>·</span>
          <span>ACADEMIC BLUEPRINT</span>
          <span>·</span>
          <span className="text-emerald-400 font-mono">SOLIDITY & METAMASK</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <BookOpen className="h-7 w-7 text-emerald-400" />
          <span>Decentralized Voting System Documentation</span>
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-3xl leading-relaxed">
          Comprehensive setup instructions, smart contract integration architecture, MetaMask configuration, JWT voter authorization, and college viva presentation guidelines.
        </p>
      </div>

      {/* Sub-tab navigation */}
      <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-slate-800 pb-4">
        {[
          { id: 'setup', label: '1. Installation & Environment', icon: Terminal },
          { id: 'solidity', label: '2. Smart Contract (Solidity)', icon: FileCode },
          { id: 'metamask', label: '3. MetaMask Integration', icon: Cpu },
          { id: 'jwt', label: '4. JWT Dual-Layer Auth', icon: KeyRound },
          { id: 'architecture', label: '5. Architecture & Data Flow', icon: Layers },
          { id: 'viva', label: '6. College Viva Q&A Guide', icon: ShieldAlert },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Installation & Setup */}
      {activeSubTab === 'setup' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Terminal className="h-5 w-5 text-emerald-400" />
              <span>Step 1: Prerequisites & Tooling</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              To test the smart contract locally or deploy it to a testnet, install the following required software:
            </p>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="h-5 w-5 rounded bg-slate-800 text-emerald-400 flex items-center justify-center font-mono font-bold shrink-0">1</span>
                <div>
                  <strong className="text-white">Node.js (v18 or v20 LTS):</strong> Runtime environment for npm packages, Hardhat, and the Vite React frontend. Download from <a href="https://nodejs.org" target="_blank" rel="noreferrer" className="text-emerald-400 underline inline-flex items-center gap-0.5">nodejs.org <ExternalLink className="h-3 w-3" /></a>.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-5 w-5 rounded bg-slate-800 text-emerald-400 flex items-center justify-center font-mono font-bold shrink-0">2</span>
                <div>
                  <strong className="text-white">MetaMask Browser Extension:</strong> Ethereum wallet for Chrome, Firefox, or Brave. Install from <a href="https://metamask.io" target="_blank" rel="noreferrer" className="text-emerald-400 underline inline-flex items-center gap-0.5">metamask.io <ExternalLink className="h-3 w-3" /></a>.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-5 w-5 rounded bg-slate-800 text-emerald-400 flex items-center justify-center font-mono font-bold shrink-0">3</span>
                <div>
                  <strong className="text-white">Hardhat or Ganache:</strong> Local Ethereum test network providing instantaneous mining and test accounts pre-funded with 10,000 ETH.
                </div>
              </li>
            </ul>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Terminal className="h-5 w-5 text-indigo-400" />
              <span>Step 2: Starting a Local Ethereum Blockchain Node</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Open your local terminal and spin up an instant local Ethereum RPC node with Hardhat:
            </p>

            <div className="relative rounded-lg bg-slate-950 p-4 border border-slate-800 text-xs font-mono text-emerald-300">
              <button
                onClick={() =>
                  copyToClipboard(
                    `# 1. Install Hardhat locally\nnpm install --save-dev hardhat @nomicfoundation/hardhat-toolbox\n\n# 2. Start the local node\nnpx hardhat node`,
                    'cmd-hardhat'
                  )
                }
                className="absolute top-3 right-3 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Copy commands"
              >
                {copiedKey === 'cmd-hardhat' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
              <pre className="overflow-x-auto leading-relaxed">
{`# 1. Install Hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# 2. Run local Ethereum node (starts RPC at http://127.0.0.1:8545)
npx hardhat node`}
              </pre>
            </div>
            <p className="mt-3 text-[11px] text-slate-400">
              Hardhat outputs 20 pre-funded test accounts with their private keys (e.g. Account #0: <code>0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266</code>).
            </p>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Cpu className="h-5 w-5 text-emerald-400" />
              <span>Step 3: Connecting MetaMask to Localhost</span>
            </h2>
            <ol className="space-y-3 text-xs text-slate-300 list-decimal pl-5">
              <li>Open your MetaMask browser extension.</li>
              <li>Click the Network selector dropdown at the top-left and click <strong>"Add network"</strong> &gt; <strong>"Add a network manually"</strong>.</li>
              <li>Fill in the local network parameters:
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px] bg-slate-950 p-3 rounded border border-slate-800">
                  <div>Network Name: <span className="text-emerald-400">Hardhat Localhost</span></div>
                  <div>RPC URL: <span className="text-emerald-400">http://127.0.0.1:8545</span></div>
                  <div>Chain ID: <span className="text-emerald-400">31337</span></div>
                  <div>Currency Symbol: <span className="text-emerald-400">ETH</span></div>
                </div>
              </li>
              <li>Click <strong>Save</strong>. In MetaMask, click on your account icon &gt; <strong>"Import account"</strong>, paste one of the Hardhat private keys, and click Import.</li>
              <li>You now have 10,000 test ETH ready to sign real smart contract votes!</li>
            </ol>
          </section>
        </div>
      )}

      {/* Tab 2: Solidity Smart Contract */}
      {activeSubTab === 'solidity' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileCode className="h-5 w-5 text-emerald-400" />
                  <span>VotingSystem.sol (Solidity 0.8.20)</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Located at: <code>contracts/VotingSystem.sol</code>
                </p>
              </div>

              <button
                onClick={() => copyToClipboard('contracts/VotingSystem.sol content', 'sol-code')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
              >
                {copiedKey === 'sol-code' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>Copy Solidity Code</span>
              </button>
            </div>

            <div className="rounded-lg bg-slate-950 p-4 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto max-h-[480px]">
              <pre className="leading-relaxed">
{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VotingSystem {
    struct Candidate {
        uint256 id;
        string name;
        string party;
        string manifesto;
        uint256 voteCount; // Tamper-proof; only admin can inspect live tally
    }

    struct BallotReceipt {
        address voterAddress;
        uint256 candidateId;
        bytes32 voterHash;
        uint256 blockNumber;
        uint256 timestamp;
    }

    address public immutable electionAdmin;
    string public electionTitle;
    bool public isElectionActive;
    uint256 public totalVotesCast;

    Candidate[] private candidates;
    mapping(address => bool) public hasVoted;
    mapping(bytes32 => bool) public isVoterHashRegistered;
    BallotReceipt[] private auditTrail;

    modifier onlyAdmin() {
        require(msg.sender == electionAdmin, "Only election admin authorized");
        _;
    }

    modifier electionOpen() {
        require(isElectionActive, "Election closed");
        _;
    }

    modifier hasNotVoted() {
        require(!hasVoted[msg.sender], "Address already voted");
        _;
    }

    function vote(uint256 _candidateId, bytes32 _voterProofHash)
        external
        electionOpen
        hasNotVoted
    {
        require(_candidateId < candidates.length, "Invalid candidate");
        require(!isVoterHashRegistered[_voterProofHash], "Voter ID already redeemed");

        hasVoted[msg.sender] = true;
        isVoterHashRegistered[_voterProofHash] = true;
        candidates[_candidateId].voteCount += 1;
        totalVotesCast += 1;

        auditTrail.push(
            BallotReceipt(msg.sender, _candidateId, _voterProofHash, block.number, block.timestamp)
        );
    }

    function getAdminResults() external view onlyAdmin returns (...) {
        // Returns live candidate totals strictly to chief election admin
    }
}`}
              </pre>
            </div>

            {/* Explanation */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-950">
                <span className="font-bold text-emerald-400 block mb-1">Double-Voting Prevention</span>
                <span className="text-slate-400">Enforced both by wallet address <code>hasVoted[address]</code> and physical Voter ID hash <code>isVoterHashRegistered[bytes32]</code>.</span>
              </div>
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-950">
                <span className="font-bold text-indigo-400 block mb-1">Admin Tally Privacy</span>
                <span className="text-slate-400"><code>candidates</code> is <code>private</code>; vote totals are inaccessible to public queries until election officer requests audit.</span>
              </div>
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-950">
                <span className="font-bold text-amber-400 block mb-1">Audit Ledger</span>
                <span className="text-slate-400">Stores block height, transaction timestamp, and cryptographic proof for post-election mathematical verification.</span>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Tab 3: MetaMask Integration */}
      {activeSubTab === 'metamask' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Cpu className="h-5 w-5 text-emerald-400" />
              <span>Ethers.js + MetaMask Integration Pattern</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              The application interfaces with MetaMask using the standard Ethereum EIP-1193 provider injected as <code>window.ethereum</code> and Ethers.js v6.
            </p>

            <div className="rounded-lg bg-slate-950 p-4 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto">
              <pre className="leading-relaxed">
{`import { ethers } from 'ethers';

// 1. Request wallet connection
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const voterAddress = await signer.getAddress();

// 2. Instantiate smart contract
const votingContract = new ethers.Contract(
  CONTRACT_ADDRESS,
  VOTING_ABI,
  signer
);

// 3. Compute Keccak-256 Voter Proof Hash (VoterID + VoterAddress)
const proofBytes = ethers.toUtf8Bytes(\`\${voterId}:\${voterAddress}\`);
const voterProofHash = ethers.keccak256(proofBytes);

// 4. Send transaction to cast ballot
const tx = await votingContract.vote(candidateId, voterProofHash);
const receipt = await tx.wait(); // Wait for block mining confirmation
console.log('Mined in Block #', receipt.blockNumber);`}
              </pre>
            </div>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm">
            <h3 className="text-sm font-bold text-white mb-2">Non-Functional Requirement: Abstracting Blockchain Complexity</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Voters are never expected to manually calculate gas limits, gas prices (Gwei), or raw hex hashes. The UI translates these steps into clean civic cards:
            </p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <p className="font-semibold text-slate-200">1. Clean Ballot Selection</p>
                <p className="text-[11px] text-slate-400 mt-1">Voters view candidate party, symbol, and manifesto with single-click action.</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <p className="font-semibold text-slate-200">2. Guided Wallet Signature</p>
                <p className="text-[11px] text-slate-400 mt-1">MetaMask confirms voter intent without exposing complex contract bytecodes.</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <p className="font-semibold text-slate-200">3. Human-Readable Proof</p>
                <p className="text-[11px] text-slate-400 mt-1">Receipt simplifies block confirmation into a clear confirmation card.</p>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Tab 4: JWT Dual-Layer Security */}
      {activeSubTab === 'jwt' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-indigo-400" />
              <span>Why JWT + Blockchain Dual-Layer Architecture?</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              In real-world democratic governance, anyone can generate an infinite number of Ethereum wallets (Sybil Attack). Holding a wallet does NOT prove citizenship or voting eligibility. 
              The system combines Web2 identification with Web3 decentralization:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950">
                <div className="flex items-center gap-2 text-indigo-400 font-bold mb-2">
                  <KeyRound className="h-4 w-4" />
                  <span>Layer 1: JWT Identity Authorization (Web2)</span>
                </div>
                <ul className="space-y-1.5 text-slate-300 list-disc pl-4 text-[11px]">
                  <li>Validates government or university Voter ID and password against the electoral roll.</li>
                  <li>Issues a cryptographically signed JSON Web Token containing claims (<code>voterId</code>, <code>role</code>, <code>exp</code>).</li>
                  <li>Ensures only authorized citizens can initiate a ballot request.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950">
                <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
                  <Cpu className="h-4 w-4" />
                  <span>Layer 2: Solidity Blockchain Immutability (Web3)</span>
                </div>
                <ul className="space-y-1.5 text-slate-300 list-disc pl-4 text-[11px]">
                  <li>Mines vote onto an immutable append-only distributed ledger.</li>
                  <li>Enforces <code>hasVoted[address] = true</code> and <code>isVoterHashRegistered[hash] = true</code>.</li>
                  <li>Guarantees zero database tampering, no deletion, and verifiable block continuity.</li>
                </ul>
              </div>
            </div>

            {/* 5-second session lock explanation */}
            <div className="mt-6 p-4 rounded-xl border border-amber-500/30 bg-amber-950/20">
              <h3 className="text-sm font-bold text-amber-300 mb-1 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-amber-400" />
                <span>The 5-Second Auto-Lock Security Mechanism</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Requirement 4 mandates: <em>"Users must be able to see their voting lists for 5 seconds before the session expires."</em><br />
                In public voting kiosks or shared terminals, if a session remains open, an attacker or coerced observer could verify who the citizen voted for. 
                Our system activates a strict 5.00-second countdown immediately upon block mining confirmation, displays the cryptographic proof, and then immediately destroys all JWT tokens in memory and storage, auto-locking the session.
              </p>
            </div>
          </section>
        </div>
      )}

      {/* Tab 5: Architecture & Data Flow */}
      {activeSubTab === 'architecture' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Layers className="h-5 w-5 text-emerald-400" />
              <span>End-to-End System Architecture Diagram</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Here is the structural blueprint of the application showing how the frontend, JWT authentication, MetaMask, and Solidity contract interact:
            </p>

            <div className="rounded-lg bg-slate-950 p-4 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto">
              <pre className="leading-relaxed">
{`┌────────────────────────────────────────────────────────────────────────┐
│                        Voter Client UI (React)                         │
│   ┌─────────────────────┐  ┌──────────────────┐  ┌─────────────────┐   │
│   │   Voter Login       │  │ Candidate Ballot │  │ 5s Timed Receipt│   │
│   │   (Voter ID + Pass) │  │ Card Interface   │  │ Auto-Lock Modal │   │
│   └──────────┬──────────┘  └────────┬─────────┘  └────────┬────────┘   │
└──────────────┼──────────────────────┼─────────────────────┼────────────┘
               │                      │                     │
               ▼                      ▼                     │
┌───────────────────────────┐  ┌─────────────────────────┐  │
│  JWT Authentication Auth  │  │   MetaMask Web3 Provider│  │
│  - Issue Voter Token      │  │   (window.ethereum)     │  │
│  - Validate Permissions   │  │   - Account detection   │  │
│  - Session Invalidation   │  │   - Transaction signing │  │
└───────────────────────────┘  └────────────┬────────────┘  │
                                            │               │
                                            ▼               │
                               ┌─────────────────────────┐  │
                               │ Ethereum Blockchain Node│◄─┘
                               │ (Hardhat / Sepolia)     │
                               │                         │
                               │ ┌─────────────────────┐ │
                               │ │  VotingSystem.sol   │ │
                               │ │  - vote()           │ │
                               │ │  - getAdminResults()│ │
                               │ │  - hasVoted mapping │ │
                               │ └─────────────────────┘ │
                               └────────────┬────────────┘
                                            │
                                            ▼
                               ┌─────────────────────────┐
                               │  Admin Analytics Portal │
                               │  - Live Result Tally    │
                               │  - Tamper Verification  │
                               └─────────────────────────┘`}
              </pre>
            </div>
          </section>
        </div>
      )}

      {/* Tab 6: College Viva Defense Guide */}
      {activeSubTab === 'viva' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-emerald-400" />
              <span>College Viva & Project Presentation Defense Q&A</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Key questions that university evaluators and external examiners commonly ask for blockchain mini-projects, along with model answers:
            </p>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950">
                <p className="font-bold text-white text-sm mb-1">
                  Q1: Why use Ethereum and Solidity instead of a traditional MySQL database?
                </p>
                <p className="text-slate-300 leading-relaxed">
                  <strong>Answer:</strong> In a centralized database, a malicious database administrator (DBA) or compromised server can alter vote counts, delete records, or insert fake ballots without leaving a cryptographic trail. In Ethereum, state changes are governed by smart contract bytecode deployed immutably. Once a block is mined, cryptographic hash chaining (Keccak-256) and consensus make post-hoc alteration computationally impossible.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950">
                <p className="font-bold text-white text-sm mb-1">
                  Q2: How does the system prevent a voter from voting multiple times?
                </p>
                <p className="text-slate-300 leading-relaxed">
                  <strong>Answer:</strong> The smart contract maintains two independent checks:
                  1. <code>mapping(address =&gt; bool) public hasVoted</code> prevents the Ethereum wallet from submitting a second transaction.
                  2. <code>mapping(bytes32 =&gt; bool) public isVoterHashRegistered</code> prevents the physical Voter ID hash from being redeemed through any other wallet address.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950">
                <p className="font-bold text-white text-sm mb-1">
                  Q3: Why are results only visible to the Admin?
                </p>
                <p className="text-slate-300 leading-relaxed">
                  <strong>Answer:</strong> Showing real-time tallies to voters during an active election creates the "Bandwagon Effect" or voter intimidation, altering voting behavior. In our contract, the <code>candidates</code> array is declared <code>private</code>, and only the authenticated Chief Election Officer calling <code>getAdminResults()</code> with the <code>onlyAdmin</code> modifier can query tallies.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950">
                <p className="font-bold text-white text-sm mb-1">
                  Q4: What is the purpose of the 5-second timed receipt?
                </p>
                <p className="text-slate-300 leading-relaxed">
                  <strong>Answer:</strong> Ballot secrecy. In shared or kiosk voting environments, displaying who was voted for creates opportunity for vote-selling or coercion. The 5-second countdown provides mathematical confirmation to the voter before invalidating the JWT and closing the session permanently.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}

    </div>
  );
};
