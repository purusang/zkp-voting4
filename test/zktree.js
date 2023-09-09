const { mimcSpongecontract } = require('circomlibjs');
// const { ethers } = require("hardhat");
const { ethers, network } = require("hardhat");
const { generateCommitment, calculateMerkleRootAndZKProof } = require('zk-merkle-tree');
const {getRandomBallot, generateRSAKeyPair } = require("./utils.js");
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
    });

    it("Test the full process", async () => {
        // Obtain the local Hardhat provider
        const signer = await createSigner1();
        const candidates = 100;
        // // register 3 voters
        // const commitment3 = await generateCommitment()
        // await zktreevote.connect(signers[1]).registerCommitment(3, commitment3.commitment)
        // // console.log("commitments: ", commitment1, commitment2, commitment3);
        
        // // votes
        // first voter and first vote
        const commitment1 = await generateCommitment();
        const ballot = getRandomBallot(candidates);
        console.log("Ballot :", ballot);
        await zktreevote.connect(signer).registerCommitment(1, commitment1.commitment)
        const cd1 = await calculateMerkleRootAndZKProof(zktreevote.address, signer, TREE_LEVELS, commitment1, "keys/Verifier.zkey")
        await zktreevote.connect(signer).vote(1, cd1.nullifierHash, cd1.root, cd1.proof_a, cd1.proof_b, cd1.proof_c)
        console.log("Yes I voted for the first candidate.");
        

        // // 2nd voter and vote
        // const commitment2 = await generateCommitment()
        // await zktreevote.connect(signer).registerCommitment(2, commitment2.commitment)
        // const cd2 = await calculateMerkleRootAndZKProof(zktreevote.address, signer, TREE_LEVELS, commitment2, "keys/Verifier.zkey")
        // await zktreevote.connect(signer).vote(1, cd2.nullifierHash, cd2.root, cd2.proof_a, cd2.proof_b, cd2.proof_c)
        // console.log("I voted for the first candidate twice.");
        // // const cd3 = await calculateMerkleRootAndZKProof(zktreevote.target, signers[4], TREE_LEVELS, commitment3, "keys/Verifier.zkey")
        // // await zktreevote.connect(signers[4]).vote(2, cd3.nullifierHash, cd3.root, cd3.proof_a, cd3.proof_b, cd3.proof_c)

        // const option1 = await zktreevote.connect(signer).getOptionCounter(1);
        // const option2 = await zktreevote.connect(signer).getOptionCounter(2);
        // console.log("option 1:", option1, " option 2: ", option2);
    });

});
