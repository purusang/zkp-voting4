const { mimcSpongecontract } = require('circomlibjs');
// const { ethers } = require("hardhat");
const { ethers, network } = require("hardhat");
const { generateCommitment, calculateMerkleRootAndZKProof } = require('zk-merkle-tree');
const { getRandomBallot, getRandomBallotAndRand, generateRSAKeyPair , decryptAllBallots, encryptMessage, calcVoteCount, convertGasToUsd, Hacker, delay, findWinner} = require("./utils.js");
const fs = require("fs");


const SEED = "mimcsponge";

// the default verifier is for 20 levels, for different number of levels, you need a new verifier circuit

describe("ZKTree Smart contract test", () => {
// Text Coloring Logic
    before(async () => {
    });


    it("Test gas to used", async () => {
        let dep_cost = 2582302 + 1483361 + 3281960;
        let cand = 161270;
        let voter = 1064248;
        let ballot = 573392;

        let admin_cost = ((dep_cost )) //+ voter*40 // + ballot
        let voter_cost = ballot + voter // + ballot
        // let tot_cost =   ballot
        let usd = convertGasToUsd(admin_cost);
        console.log(`Admin Gas cost ${admin_cost} GasToUsd `, usd);

        usd = convertGasToUsd(voter_cost);
        console.log(`Voter Gas cost ${voter_cost} GasToUsd `, usd);

        total_cost_per_voter = ((dep_cost )/500) + voter + ballot
        usd = convertGasToUsd(total_cost_per_voter);
        console.log(`Total Gas cost/voter ${total_cost_per_voter} GasToUsd `, usd);
    });
    
});
