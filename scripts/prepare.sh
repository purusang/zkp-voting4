#!/usr/bin/env bash

mkdir -p keys
mkdir -p build
# curl -O https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_15.ptau #-P ./keys
# cp powersOfTau28_hez_final_15.ptau keys/powersOfTau28_hez_final_15.ptau
circom node_modules/zk-merkle-tree/circuits/Verifier.circom --wasm --r1cs -o ./build
cp node_modules/zk-merkle-tree/dist/Verifier.r1cs build/Verifier.r1cs
npx snarkjs groth16 setup build/Verifier.r1cs keys/powersOfTau28_hez_final_15.ptau keys/Verifier.zkey
npx snarkjs zkey export solidityverifier keys/Verifier.zkey contracts/Verifier.sol
sed -i -e 's/pragma solidity \^0.6.11/pragma solidity 0.8.17/g' contracts/Verifier.sol
cp keys/Verifier.zkey static/verifier.zkey


# 16240094928889970663269183000181277436706775679203686981879557915755378059425 vote commitment