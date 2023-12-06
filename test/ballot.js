const { mimcSpongecontract } = require('circomlibjs');
// const { ethers } = require("hardhat");
const { ethers, network } = require("hardhat");
const { generateCommitment, calculateMerkleRootAndZKProof } = require('zk-merkle-tree');
const {getRandomBallot, getRandomBallotAndRand, generateRSAKeyPair , decryptAllBallots, encryptMessage, calcVoteCount, convertGasToUsd, Hacker, delay, findWinner} = require("./utils.js");
const fs = require("fs");


const SEED = "mimcsponge";

// the default verifier is for 20 levels, for different number of levels, you need a new verifier circuit

describe("ZKTree Smart contract test", () => {
// Text Coloring Logic
    before(async () => {
    });


    it("Test the full process", async () => {
        let { publicKey, privateKey } = generateRSAKeyPair(); // Key used for enc and dec of ballot
        const candidates = 20;
        // Open the file for writing
        const fileStream = fs.createWriteStream('./data/ballots.txt');
        // REGISTER VOTERS, GENERATE PROOF OF MERKEL MEMBERSHIP, VOTE
        for (let i = 0; i < 1000; i++) {
            // BALLOT
            let [ballot, vote, rand] = getRandomBallotAndRand(candidates);
            vote = 1;
            // ENCRYPT BALLOT
            const encryptedPlainBallot = encryptMessage(publicKey, vote);
            const encryptedRandomizedBallot = encryptMessage(publicKey, ballot);
            // Log to console
            console.log(`\nEncrypted Ballot: ${encryptedPlainBallot}\n`);
            // Write to file
            fileStream.write(`${vote},${rand},${ballot},${encryptedRandomizedBallot}\n`);
        }
        // Close the file stream
        fileStream.end();
    });
    
});
