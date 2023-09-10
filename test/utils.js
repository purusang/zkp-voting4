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
    const vote = generateRandomNumber(candidates)+1;
    const randomness = generateRandomNumber(Number.MAX_SAFE_INTEGER);

    // Calculate 100 * randomness + vote using big-integer
    const bigRandomness = bigInt(randomness.toString()); // Convert randomness to a big integer
    const ballot = bigRandomness.multiply(candidates + 1).add(vote);
    return [ballot, vote];
}

function decryptAllBallots(encryptedBallots, privateKey, candidates) {
    const decryptedBallots = [];
    for (const encryptedBallot of encryptedBallots) {
      try {
        const decryptedBallot = decryptMessage(privateKey, encryptedBallot);
        decryptedBallots.push(Number(bigInt(decryptedBallot).mod(candidates + 1)));
      } catch (error) {
        console.error('Error decrypting ballot:', error);
      }
    }
  
    return decryptedBallots;
  }

function calcVoteCount(ballots){
    const uniqueValueCounts = {};

    // Iterate through the array
    ballots.forEach((value) => {
    if (uniqueValueCounts[value]) {
        uniqueValueCounts[value]++; // Increment the count if the value already exists
    } else {
        uniqueValueCounts[value] = 1; // Initialize count to 1 for a new unique value
    }
    });

    // Print the counts of unique values
    // for (const value in uniqueValueCounts) {
    // console.log(`Value ${value}: Count ${uniqueValueCounts[value]}`);
    // }
    return uniqueValueCounts;
}
module.exports = {
    generateRSAKeyPair,
    getRandomBallot,
    decryptAllBallots,
    encryptMessage,
    calcVoteCount
}