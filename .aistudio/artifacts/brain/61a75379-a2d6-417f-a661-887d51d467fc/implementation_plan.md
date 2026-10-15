# Decentralized Voting System (Smart Contract & JWT Integration)

A secure, tamper-proof decentralized voting prototype abstracting Ethereum blockchain complexity for voters while enforcing voter authentication via JWT, smart contract ballot verification, a 5-second post-voting review receipt lock, an admin-only live tally portal, and comprehensive academic setup documentation.

## User Review & Critical Decisions

> [!IMPORTANT]
> The architectural decisions below synthesize your project requirements and your answers to the three clarification questions.

- **Blockchain Connection Mode**: **MetaMask Only (Web3 Ethers Integration)**. The prototype connects directly to the user's injected MetaMask provider (`window.ethereum`). It detects connected accounts, network status (Localhost / Sepolia / Ethereum testnet), requests transaction signing for voting, and provides a guided setup guide and fallback bridge if MetaMask is not detected.
- **Admin Verification Portal**: **Live Results Tally & Cryptographic Vote Verification Only**. As requested, election tally totals and tamper-proof ballot verifications are restricted to the Admin dashboard. Voters cast anonymous ballots on-chain without previewing current tallies beforehand.
- **5-Second Post-Vote Review**: **Timed Vote Confirmation Receipt with Auto-Lock**. Once a voter's ballot is mined on Ethereum, an interactive confirmation receipt is displayed for exactly 5.0 seconds with a real-time progress bar. When the timer reaches zero, the voter's JWT session immediately expires and clears all local tokens, returning to the secure login screen to prevent coercion or multiple voting.

---

## 1. Overview & Core Concept

- **What It Does**: Enables registered voters to log in using their government/institutional Voter ID and password, obtain a signed JWT session, view authorized candidates, cast a verifiable vote to an Ethereum smart contract via MetaMask, inspect their cryptographic transaction receipt for 5 seconds before session auto-lock, and allows administrators to view real-time tallies and verify block tamper-proof invariants.
- **Target Audience**: College / Academic evaluators, students, and blockchain project reviewers assessing a functional proof of concept that demonstrates real-world decentralized governance principles.
- **Key Value**: Bridges Web2 security (JWT role-based voter authorization) with Web3 decentralization (immutable Solidity smart contract storage), completely abstracting transaction gas complexity while ensuring one-person-one-vote enforcement.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Authentication (JWT Voter / Admin Portal)**:
   - Voters log in with their Voter ID (`VOTER-2026-001`, etc.) and secure password.
   - Server issues a signed JWT containing voter claims (`voterId`, `hasVoted`, `role: voter`).
   - Admin access tab allows electoral officers to authenticate (`admin / admin123`) to unlock cryptographic audit tools.
2. **MetaMask Wallet Sync**:
   - Visual wallet connection badge in top navigation indicating MetaMask status, connected account (`0x...`), and network name (e.g. `Localhost 8545` or `Sepolia`).
   - One-click connect button with auto-check for active network.
3. **Ballot Selection & On-Chain Vote**:
   - Clean, high-contrast candidate ballot cards with candidate profile, party/manifesto, and single-click "Cast Ballot" action.
   - MetaMask pops up asking the user to confirm and sign the smart contract call `vote(uint256 candidateId)`.
4. **5-Second Timed Confirmation Receipt & Auto-Lock**:
   - Once mined, a full modal displays the transaction hash, block number, candidate selected, and an active 5-second countdown timer.
   - At $t = 0\text{s}$, the session auto-locks, destroys the JWT in memory/storage, and routes to a clean session completion screen.
5. **Admin Portal (Live Results & Tamper Verification)**:
   - Live vote distribution bar charts and candidate scoreboards.
   - Cryptographic verification log displaying block headers, Merkle roots, transaction nonces, and smart contract tamper audits.
6. **Documentation & Viva Setup Hub**:
   - Embedded interactive documentation hub containing MetaMask setup steps, Ganache/Hardhat local network configuration, full `VotingSystem.sol` code, ABI, and step-by-step setup commands.

### Visual Identity & Theme
- **Aesthetic Direction**: Utilitarian, cryptographic civic interface inspired by modern fintech and security protocols.
- **Color Palette**:
  - Dominant Canvas: Clean Deep Slate (`#0B0F19`) / Neutral Pearl (`#F8FAFC`) with high-contrast surfaces (`#111827` / `#FFFFFF`).
  - Accent Color: Emerald Green (`#059669` / `#10B981`) for verified transactions and active civic trust; Indigo/Cobalt (`#4F46E5`) for primary actions.
  - Border Lines: Hairline borders (`border-slate-800` / `border-slate-200`) with zero unnecessary pill capsules.
- **Typography**:
  - Headings: `Plus Jakarta Sans` or `Outfit` with balanced headline tracking.
  - Body: `DM Sans` or `Public Sans`.
  - Hashes & Blocks: Tabular numerals with `JetBrains Mono` / `font-mono tabular-nums`.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Hybrid JWT + MetaMask Dual Layer Authentication**
  - *Chosen Approach*: Voter identity is authenticated via JWT (verifying voter eligibility against official voter roll), while vote immutability is handled by the Ethereum smart contract via MetaMask signing.
  - *Why*: In real elections, holding an Ethereum wallet alone does not prove citizenship or voting eligibility. The JWT layer maps physical Voter IDs to single-use voting nonces, while the smart contract prevents duplicate voting on-chain (`mapping(address => bool) public hasVoted`).
  - *Alternatives Considered*: Pure wallet login (allows Sybil attacks with multiple wallets) vs Pure server-side DB (not decentralized).
- **Decision 2: 5-Second Session Auto-Lock Strategy**
  - *Chosen Approach*: A strictly controlled client-side and server-side invalidation timer triggered immediately upon blockchain transaction confirmation.
  - *Why*: Meets Functional Requirement #4 precisely. Prevents coercion and stops subsequent users from viewing previous ballots on shared voting booths.
- **Decision 3: Complete Project Setup & Viva Documentation Hub**
  - *Chosen Approach*: Build a dedicated, interactive "Architecture & Setup Guide" tab directly into the UI, complete with copy-pasteable Hardhat/Ganache commands, MetaMask configuration settings, and complete `VotingSystem.sol` contract source code.
  - *Why*: The user explicitly stated this is for a college mini project and learning purpose; having the architecture diagrams and terminal setup instructions readily available in the app makes presentations and execution seamless.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
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
                               │ │  - getResults()     │ │
                               │ │  - hasVoted mapping │ │
                               │ └─────────────────────┘ │
                               └────────────┬────────────┘
                                            │
                                            ▼
                               ┌─────────────────────────┐
                               │  Admin Analytics Portal │
                               │  - Live Result Tally    │
                               │  - Tamper Verification  │
                               └─────────────────────────┘
```

### Data Model & Smart Contract Specification (`VotingSystem.sol`)

- **Candidate Struct**:
  - `uint256 id`
  - `string name`
  - `string party`
  - `string manifesto`
  - `uint256 voteCount` (only accessible by contract owner/admin)
- **State Mappings**:
  - `mapping(address => bool) public hasVoted`
  - `mapping(string => bool) public voterIdUsed`
  - `address public immutable admin`
- **Modifiers**:
  - `onlyAdmin()`: Restricts access to tally viewing and election lifecycle.
  - `hasNotVoted()`: Prevents duplicate votes per wallet address.

### Step-by-Step Implementation Sequence

1. **Smart Contract & Web3 Services**:
   - Provide `contracts/VotingSystem.sol` with complete Solidity 0.8.20 code.
   - Provide contract ABI and ethers.js interaction service (`src/services/web3Service.ts`) with methods: `connectWallet()`, `castVote()`, `checkHasVoted()`, `fetchAdminResults()`, `getBlockchainBlock()`.
2. **JWT Authentication & Mock Voter Registry**:
   - Secure voter store (`src/services/authService.ts`) with sample pre-registered Voter IDs and passwords.
   - JWT token generator and validator with expiration management.
3. **Ballot & Voting UI**:
   - Candidate showcase cards with bio, party symbol, and vote button.
   - Transaction status pipeline (Waiting for MetaMask approval -> Mining transaction -> Confirmed).
4. **5-Second Timed Confirmation Receipt**:
   - Dedicated modal with circular/linear progress bar ticking down from 5.0s to 0.0s.
   - Display of TX hash, block number, timestamp, and gas used.
   - Automatic session wipe and logout transition on timeout.
5. **Admin-Only Live Tally & Cryptographic Audit**:
   - Protected admin view requiring administrator credentials.
   - Real-time tally charts and cryptographic proof inspector.
6. **Project Setup & Architecture Hub**:
   - In-depth documentation view with prerequisites, MetaMask network setup (Chain ID, RPC URL), local testnet guide (Hardhat / Ganache), and working mechanism overview.
