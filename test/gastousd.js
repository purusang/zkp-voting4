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
        let usd = convertGasToUsd(61270.667);
        console.log("convert GasToUsd ", usd);
    });
    
});
