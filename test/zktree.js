const { mimcSpongecontract } = require('circomlibjs');
// const { ethers } = require("hardhat");
const { ethers, network } = require("hardhat");
const { generateCommitment, calculateMerkleRootAndZKProof } = require('zk-merkle-tree');
const {getRandomBallot, generateRSAKeyPair , decryptAllBallots, encryptMessage, calcVoteCount, convertGasToUsd} = require("./utils.js");
const fs = require("fs");


const SEED = "mimcsponge";

// the default verifier is for 20 levels, for different number of levels, you need a new verifier circuit
const TREE_LEVELS = 20;
async function createSigner() {
    // Get the provider from Hardhat
    const provider = ethers.provider;

    // Get the signer using the provider
    const signer = await provider.getSigner();

    // Set the properties of the JsonRpcSigner object
    signer._isSigner = true;
    signer._index = 0;
    signer._address = null;
    // Access the created JsonRpcSigner object
    return signer;
}
async function createSigner1() {
    // This is correctly providing me the JSONRPCSigner
    // Create a JSON-RPC provider
    const providerUrl = "http://127.0.0.1:8545/";
    const provider = ethers.providers.getDefaultProvider(providerUrl);

    // Get the signer using the provider
    const signer = provider.getSigner();

    // Set the properties of the JsonRpcSigner object
    signer._isSigner = true;
    signer._index = 0;
    signer._address = null;

    // Access the created JsonRpcSigner object
    return signer;

}
describe("ZKTree Smart contract test", () => {
    let zktreevote
    before(async () => {
        const signer = await createSigner1();
        // const signers = await ethers.getSigners()
        const MiMCSponge = new ethers.ContractFactory(mimcSpongecontract.abi, mimcSpongecontract.createCode(SEED, 220), signer)
        const mimcsponge = await MiMCSponge.deploy()
        const Verifier = await ethers.getContractFactory("Verifier", signer);
        const verifier = await Verifier.deploy();
        const ZKTreeVote = await ethers.getContractFactory("ZKTreeVote", signer);
        zktreevote = await ZKTreeVote.deploy(TREE_LEVELS, mimcsponge.address, verifier.address, 4);


        // Create a data folder if it doesn't exist
        if (!fs.existsSync('data')) {
            fs.mkdirSync('data');
        }
        const csvFilePath = 'data/data_voter_registration.csv';
        if (!fs.existsSync(csvFilePath)) {
            const csvHeader = 'Iteration,TimeRegisterVoter (milliseconds)\n';
            fs.writeFileSync(csvFilePath, csvHeader, 'utf8');
        }
        if (!fs.existsSync("data/data_proof_generation.csv")) {
            const Header= 'Iteration, ProofGenerationTime (ms)\n';
            fs.writeFileSync('data/data_proof_generation.csv', Header, 'utf8');
        }
        if (!fs.existsSync("data/data_vote_cast.csv")){
            const Header= 'Iteration, VoteCastTime (ms), Gas (Unit), Gas Cost (USD)\n';
            fs.writeFileSync('data/data_vote_cast.csv', Header, 'utf8');
        }
    });

    it("Test the full process", async () => {
        // Obtain the local Hardhat provider
        const signer = await createSigner1();
        const candidates = 20;
        let {publicKey, privateKey}= generateRSAKeyPair();
        let votes = [];

        // REGISTER VOTERS, GENERATE PROOF OF MERKEL MEMBERSHIP, VOTE
        for(let i =0; i< 1000; i++){
            // REG VOTER
            const startTimeGenerateCommitment = performance.now();

            const commitment = await generateCommitment();
            let tx = await zktreevote.connect(signer).registerVoter(i, commitment.commitment);

            let receipt = await tx.wait();
            let gas_units = receipt.gasUsed.toString();
            let gas_USD = convertGasToUsd(gas_units);

            const endTimeGenerateCommitment = performance.now();
            const timeRegisterVoter = endTimeGenerateCommitment - startTimeGenerateCommitment;
            console.log(`Time spent on generateCommitment ${i + 1}: ${timeRegisterVoter} milliseconds`);

            // Append data to data.csv
            const csvData = `${i + 1},${timeRegisterVoter}, ${gas_units}, ${gas_USD}\n`;
            fs.appendFileSync('data/data_voter_registration.csv', csvData, 'utf8');

            //BALLOT
            const [ballot, vote] = getRandomBallot(candidates);
            votes.push(vote);
            
            // ENCRYPT BALLOT
            encryptedBallot = encryptMessage(publicKey, ballot);
            console.log(`\nEncrypted Ballot: ${encryptedBallot}\n` );


            const startProofGeneration = performance.now();

            const cd1 = await calculateMerkleRootAndZKProof(zktreevote.address, signer, TREE_LEVELS, commitment, "keys/Verifier.zkey")

            const endProofGeneration = performance.now();
            const ProofGenTime = endProofGeneration - startProofGeneration;
            const proofData = `${i + 1},${ProofGenTime}\n`;
            fs.appendFileSync('data/data_proof_generation.csv', proofData, 'utf8');

            let startTime = performance.now();

            tx = await zktreevote.connect(signer).vote(encryptedBallot, cd1.nullifierHash, cd1.root, cd1.proof_a, cd1.proof_b, cd1.proof_c);
            console.log(`Yes voted for candidate no. ${vote}.` );

            receipt = await tx.wait();
            gas_units = receipt.gasUsed.toString();
            gas_USD = convertGasToUsd(gas_units);

            let endTime = performance.now();
            let duration = endTime - startTime;
            let data = `${i + 1},${duration}, ${gas_units}, ${gas_USD}\n`;
            fs.appendFileSync('data/data_vote_cast.csv', data, 'utf8');




        }

        //  FETCH BALLOTS
        const ballots = await zktreevote.connect(signer).getAllBallots();      
        console.log("All encrypted Ballots fetched from blockchain: ", ballots);

        // DECRYPT ALL BALLOTS
        const decryptedBallots = decryptAllBallots(ballots, privateKey, candidates);
        console.log(decryptedBallots);

        // RESULT DECLARATION
        const result = calcVoteCount(decryptedBallots);
        console.log(result);
        console.log(votes);
        
    });

});
