const { mimcSpongecontract } = require('circomlibjs');
// const { ethers } = require("hardhat");
const { ethers, network } = require("hardhat");
const { generateCommitment, calculateMerkleRootAndZKProof } = require('zk-merkle-tree');
const {getRandomBallot, generateRSAKeyPair , decryptAllBallots, encryptMessage, calcVoteCount} = require("./utils.js");
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
        const candidates = 3;
        let {publicKey, privateKey}= generateRSAKeyPair();
        let votes = [];

        // REGISTER VOTERS, GENERATE PROOF OF MERKEL MEMBERSHIP, VOTE
        for(let i =0; i< 20; i++){
            const commitment = await generateCommitment();
            await zktreevote.connect(signer).registerVoter(i, commitment.commitment)

            const [ballot, vote] = getRandomBallot(candidates);
            votes.push(vote);
            
            // ENCRYPT WALLET
            encryptedBallot = encryptMessage(publicKey, ballot);
            console.log(`\nEncrypted Ballot: ${encryptedBallot}\n` );

            
            const cd1 = await calculateMerkleRootAndZKProof(zktreevote.address, signer, TREE_LEVELS, commitment, "keys/Verifier.zkey")
            await zktreevote.connect(signer).vote(encryptedBallot, cd1.nullifierHash, cd1.root, cd1.proof_a, cd1.proof_b, cd1.proof_c)
            console.log(`Yes I voted for candidate no. ${vote}.` );
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
