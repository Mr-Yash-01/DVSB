require('dotenv').config({ path: '../.env' });  // Specify the relative path
// Ensure this line is at the very top

const { ethers } = require('ethers');
const contract = require('./Lock.json');

const CONTRACTADDRESS = process.env.CONTRACT_ADDRESS;
const INFURAKEY = process.env.PROVIDER_LINK;
const PRIVATEKEY = process.env.WALLET_PRIVATE_KEY;

// Contract address and provider
const contractAddress = CONTRACTADDRESS; // Use the environment variable
const infuraProvider = new ethers.JsonRpcProvider(INFURAKEY); // Use the environment variable

// Contract instance with provider
const contractInstance = new ethers.Contract(
    contractAddress,
    contract.abi,
    infuraProvider
);

// Use a private key to create a signer (for Node.js)
const wallet = new ethers.Wallet(PRIVATEKEY, infuraProvider); // Use the environment variable

// Contract instance with signer
const sendContract = new ethers.Contract(
    contractAddress,
    contract.abi,
    wallet
);

module.exports = { contractAddress, contractInstance, sendContract };
