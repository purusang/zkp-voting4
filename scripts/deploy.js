// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require('fs');
// const { ethers } = require('hardhat');
const { mimcSpongecontract } = require('circomlibjs');

const SEED = "mimcsponge";
const TREE_LEVELS = 20;

async function main() {
  const signers = await hre.ethers.getSigners()
  const MiMCSponge = new hre.ethers.ContractFactory(mimcSpongecontract.abi, mimcSpongecontract.createCode(SEED, 220), signers[0])
  const mimcsponge = await MiMCSponge.deploy()
  console.log(`MiMC sponge hasher address: ${mimcsponge.target}`)


  const Verifier = await ethers.getContractFactory("Verifier");
  const verifier = await Verifier.deploy();
  console.log(`Verifier address: ${verifier.target}`)

  const ZKTreeVote = await ethers.getContractFactory("ZKTreeVote");
  const zktreevote = await ZKTreeVote.deploy(TREE_LEVELS, mimcsponge.target, verifier.target, 100);
  console.log(`ZKTreeVote address: ${zktreevote.target}`)


  //store addressess of just deployed smart contracts.
  const data = {
    MS: mimcsponge.target,
    VS: verifier.target,
    ZK: zktreevote.target
  };

  const jsonData = JSON.stringify(data);

  fs.writeFile('static/contracts.json', jsonData, 'utf8', (err) => {
    if (err) {
      console.error('An error occurred while writing the file:', err);
    } else {
      console.log('JSON data has been successfully saved to file.');
    }
  });

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});




// import * as fs from 'fs'
// import { ethers } from "hardhat";
// import { mimcSpongecontract } from 'circomlibjs'

// const SEED = "mimcsponge";
// const TREE_LEVELS = 20;

// async function main() {
//     const signers = await ethers.getSigners()
//     const MiMCSponge = new ethers.ContractFactory(mimcSpongecontract.abi, mimcSpongecontract.createCode(SEED, 220), signers[0])
//     const mimcsponge = await MiMCSponge.deploy()
//     console.log(`MiMC sponge hasher address: ${mimcsponge.target}`)

//     const Verifier = await ethers.getContractFactory("Verifier");
//     const verifier = await Verifier.deploy();
//     console.log(`Verifier address: ${verifier.target}`)

//     const ZKTreeVote = await ethers.getContractFactory("ZKTreeVote");
//     const zktreevote = await ZKTreeVote.deploy(TREE_LEVELS, mimcsponge.target, verifier.target, 4);
//     console.log(`ZKTreeVote address: ${zktreevote.target}`)

//     // add the 2nd hardhat account as a validator
//     await zktreevote.registerValidator(signers[1].target)

//     fs.writeFileSync("static/contracts.json", JSON.stringify({
//         mimc: mimcsponge.target,
//         verifier: verifier.target,
//         zktreevote: zktreevote.target
//     }))
// }

// main().catch((error) => {
//     console.error(error);
//     process.exitCode = 1;
// });