const NodeRSA = require('node-rsa');
const bigInt = require('big-integer'); // Import the big-integer library

// Function to generate RSA key pair
 function generateRSAKeyPair() {
  const key = new NodeRSA({ b: 2048 }); // Adjust the key size as needed
  const privateKey = key.exportKey('private');
  const publicKey = key.exportKey('public');
  return { privateKey, publicKey };
}

// Function to generate a random number between 1 and range-1
function generateRandomNumber(range) {
  return Math.floor(Math.random() * range);
}

// Function to encrypt a message using a public key
function encryptMessage(publicKey, message) {
  const key = new NodeRSA();
  key.importKey(publicKey, 'public');
  return key.encrypt(message.toString(), 'base64');
}

// Function to decrypt a message using a private key
function decryptMessage(privateKey, encryptedMessage) {
  const key = new NodeRSA();
  key.importKey(privateKey, 'private');
  return key.decrypt(encryptedMessage, 'utf8');
}

function getRandomBallot(candidates){
    // Generate a random number between 1 and 100
    const vote = generateRandomNumber(candidates + 1);
    const randomness = generateRandomNumber(Number.MAX_SAFE_INTEGER);

    // Calculate 100 * randomness + vote using big-integer
    const bigRandomness = bigInt(randomness.toString()); // Convert randomness to a big integer
    const ballot = bigRandomness.multiply(candidates + 1).add(vote);
    return ballot;
}
// Example usage
// export 
// const { privateKey, publicKey } = generateRSAKeyPair();

// const encryptedMessage = encryptMessage(publicKey, ballot);
// const decryptedMessage = decryptMessage(privateKey, encryptedMessage);

// console.log('Vote:', vote);
// console.log('Encrypted Message:', encryptedMessage);
// console.log('Result (100 * randomness + vote):', ballot.toString()); // Convert result to a string for printing
// console.log("Decrypted Ballot: ", decryptedMessage);
// console.log("Decrypted choice: ", Number(bigInt(decryptedMessage).mod(candidates + 1)));

module.exports = {
    generateRSAKeyPair,
    getRandomBallot
}