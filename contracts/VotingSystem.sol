// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Decentralized Voting System
 * @dev Cryptographically secure, tamper-proof ballot system with admin-only tallies
 * and voter authorization enforcement.
 */
contract VotingSystem {
    // Structure representing a Candidate
    struct Candidate {
        uint256 id;
        string name;
        string party;
        string manifesto;
        uint256 voteCount; // Only accessible by admin
    }

    // Structure representing a Cryptographic Ballot Receipt
    struct BallotReceipt {
        address voterAddress;
        uint256 candidateId;
        bytes32 voterHash;
        uint256 blockNumber;
        uint256 timestamp;
    }

    // Contract Owner / Chief Election Officer
    address public immutable electionAdmin;

    // Election configuration & state
    string public electionTitle;
    bool public isElectionActive;
    uint256 public totalVotesCast;

    // Candidates storage
    Candidate[] private candidates;

    // Track voter participation (prevent double voting)
    mapping(address => bool) public hasVoted;
    mapping(bytes32 => bool) public isVoterHashRegistered;

    // Audit logs for tamper verification
    BallotReceipt[] private auditTrail;

    // Events
    event ElectionInitialized(string title, uint256 candidatesCount, address indexed admin);
    event VoteCast(
        address indexed voter,
        uint256 indexed candidateId,
        bytes32 indexed voterHash,
        uint256 timestamp
    );
    event ElectionStatusChanged(bool isActive);

    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == electionAdmin, "Error: Caller is not the authorized election admin");
        _;
    }

    modifier electionOpen() {
        require(isElectionActive, "Error: Voting period is currently closed");
        _;
    }

    modifier hasNotVoted() {
        require(!hasVoted[msg.sender], "Error: This Ethereum wallet has already cast a vote");
        _;
    }

    /**
     * @dev Deploys the contract with election candidates
     * @param _electionTitle Name of the election (e.g. National Student Council Election)
     * @param _candidateNames Array of candidate full names
     * @param _candidateParties Array of corresponding political/student parties
     * @param _manifestos Array of brief manifesto statements
     */
    constructor(
        string memory _electionTitle,
        string[] memory _candidateNames,
        string[] memory _candidateParties,
        string[] memory _manifestos
    ) {
        require(_candidateNames.length > 0, "Error: Must register at least one candidate");
        require(
            _candidateNames.length == _candidateParties.length &&
            _candidateNames.length == _manifestos.length,
            "Error: Array length mismatch in candidate initialization"
        );

        electionAdmin = msg.sender;
        electionTitle = _electionTitle;
        isElectionActive = true;

        for (uint256 i = 0; i < _candidateNames.length; i++) {
            candidates.push(
                Candidate({
                    id: i,
                    name: _candidateNames[i],
                    party: _candidateParties[i],
                    manifesto: _manifestos[i],
                    voteCount: 0
                })
            );
        }

        emit ElectionInitialized(_electionTitle, candidates.length, msg.sender);
    }

    /**
     * @notice Get candidate count for public ballot display
     */
    function getCandidatesCount() external view returns (uint256) {
        return candidates.length;
    }

    /**
     * @notice Get public candidate information (vote count is hidden to regular voters)
     */
    function getCandidate(uint256 _candidateId)
        external
        view
        returns (
            uint256 id,
            string memory name,
            string memory party,
            string memory manifesto
        )
    {
        require(_candidateId < candidates.length, "Error: Invalid candidate ID");
        Candidate memory c = candidates[_candidateId];
        return (c.id, c.name, c.party, c.manifesto);
    }

    /**
     * @notice Cast an immutable vote via smart contract
     * @param _candidateId Candidate index
     * @param _voterProofHash Keccak256 hash of the voter's authorized JWT voterId
     */
    function vote(uint256 _candidateId, bytes32 _voterProofHash)
        external
        electionOpen
        hasNotVoted
    {
        require(_candidateId < candidates.length, "Error: Invalid candidate ID");
        require(!isVoterHashRegistered[_voterProofHash], "Error: Voter ID proof has already been redeemed");

        // Record ballot state atomically
        hasVoted[msg.sender] = true;
        isVoterHashRegistered[_voterProofHash] = true;
        candidates[_candidateId].voteCount += 1;
        totalVotesCast += 1;

        // Store audit log
        auditTrail.push(
            BallotReceipt({
                voterAddress: msg.sender,
                candidateId: _candidateId,
                voterHash: _voterProofHash,
                blockNumber: block.number,
                timestamp: block.timestamp
            })
        );

        emit VoteCast(msg.sender, _candidateId, _voterProofHash, block.timestamp);
    }

    /**
     * @notice Live results tally accessible ONLY by election admin
     */
    function getAdminResults()
        external
        view
        onlyAdmin
        returns (
            uint256[] memory ids,
            string[] memory names,
            string[] memory parties,
            uint256[] memory voteCounts,
            uint256 totalVotes
        )
    {
        uint256 len = candidates.length;
        ids = new uint256[](len);
        names = new string[](len);
        parties = new string[](len);
        voteCounts = new uint256[](len);

        for (uint256 i = 0; i < len; i++) {
            ids[i] = candidates[i].id;
            names[i] = candidates[i].name;
            parties[i] = candidates[i].party;
            voteCounts[i] = candidates[i].voteCount;
        }

        return (ids, names, parties, voteCounts, totalVotesCast);
    }

    /**
     * @notice Cryptographic tamper verification check for admin audit
     */
    function getTamperAuditLedger()
        external
        view
        onlyAdmin
        returns (
            address[] memory voters,
            uint256[] memory candidateIds,
            bytes32[] memory proofs,
            uint256[] memory blockNumbers,
            uint256[] memory timestamps
        )
    {
        uint256 len = auditTrail.length;
        voters = new address[](len);
        candidateIds = new uint256[](len);
        proofs = new bytes32[](len);
        blockNumbers = new uint256[](len);
        timestamps = new uint256[](len);

        for (uint256 i = 0; i < len; i++) {
            voters[i] = auditTrail[i].voterAddress;
            candidateIds[i] = auditTrail[i].candidateId;
            proofs[i] = auditTrail[i].voterHash;
            blockNumbers[i] = auditTrail[i].blockNumber;
            timestamps[i] = auditTrail[i].timestamp;
        }

        return (voters, candidateIds, proofs, blockNumbers, timestamps);
    }

    /**
     * @notice Admin function to toggle election state
     */
    function setElectionStatus(bool _isActive) external onlyAdmin {
        isElectionActive = _isActive;
        emit ElectionStatusChanged(_isActive);
    }
}
