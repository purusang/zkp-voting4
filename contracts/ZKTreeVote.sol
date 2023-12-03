// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "zk-merkle-tree/contracts/ZKTree.sol";

contract ZKTreeVote is ZKTree {
    address public owner;
    mapping(address => bool) public validators;
    mapping(uint256 => bool) uniqueHashes;
    // uint numOptions;
    string[] public ballots;
    mapping(string => bool) submittedBallots;
    uint256 candidates;

    constructor(
        uint32 _levels,
        IHasher _hasher,
        IVerifier _verifier,
        uint256 _candidates
    ) ZKTree(_levels, _hasher, _verifier) {
        owner = msg.sender;
        candidates = _candidates;
    }

    function registerValidator(address _validator) external {
        require(msg.sender == owner, "Only owner can add validator!");
        validators[_validator] = true;
    }

    function registerVoter(
        uint256 _uniqueHash,    // secret
        uint256 _commitment     // nullifier
    ) external {
        // require(validators[msg.sender], "Only validator can commit!");
        require(
            !uniqueHashes[_uniqueHash],
            "This unique hash is already used!"
        );
        _commit(bytes32(_commitment));
        uniqueHashes[_uniqueHash] = true;
    }

    function vote(
        string memory _ballot,
        uint256 _nullifier,
        uint256 _root,
        uint[2] memory _proof_a,
        uint[2][2] memory _proof_b,
        uint[2] memory _proof_c
    ) external {
        require( !submittedBallots[_ballot], "Ballot with same value not allowed!"); 
        _nullify(
            bytes32(_nullifier),
            bytes32(_root),
            _proof_a,
            _proof_b,
            _proof_c
        );
        ballots.push(_ballot);
        submittedBallots[_ballot] = true;
    }

    // Function to get all the ballots
    function getAllBallots() external view returns (string[] memory) {
        return ballots;
    }
}
