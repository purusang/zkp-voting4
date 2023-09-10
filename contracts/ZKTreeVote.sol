// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "zk-merkle-tree/contracts/ZKTree.sol";

contract ZKTreeVote is ZKTree {
    address public owner;
    mapping(address => bool) public validators;
    mapping(uint256 => bool) uniqueHashes;
    // uint numOptions;
    uint256[] public ballots;
    // mapping(uint => uint) optionCounter;
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
        uint256 _uniqueHash,
        uint256 _commitment
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
        uint256 _ballot,
        uint256 _nullifier,
        uint256 _root,
        uint[2] memory _proof_a,
        uint[2][2] memory _proof_b,
        uint[2] memory _proof_c
    ) external {
        // require(_option <= numOptions, "Invalid option!");
        _nullify(
            bytes32(_nullifier),
            bytes32(_root),
            _proof_a,
            _proof_b,
            _proof_c
        );
        ballots.push(_ballot);
    }

    // Function to get all the ballots
    function getAllBallots() external view returns (uint256[] memory) {
        return ballots;
    }
}
