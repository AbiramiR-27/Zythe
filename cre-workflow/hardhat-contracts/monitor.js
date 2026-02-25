// Basic event monitoring script for PredictionMarket contract
// Listens for key events and logs them to the console
// You can extend this to send alerts via email, Telegram, Discord, etc.

const { ethers } = require("ethers");
require("dotenv").config();

// --- CONFIG ---
const RPC_URL = process.env.RPC_URL || "https://sepolia.infura.io/v3/YOUR_INFURA_KEY";
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "<DEPLOYED_CONTRACT_ADDRESS>";
const ABI = require("./PredictionMarketABI.json"); // Export your contract ABI as JSON

// --- SETUP ---
const provider = new ethers.JsonRpcProvider(RPC_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

// --- EVENT LISTENERS ---
contract.on("MarketCreated", (marketId, question, deadline, feed) => {
  console.log(`[MarketCreated] ID: ${marketId}, Q: ${question}, Deadline: ${deadline}, Feed: ${feed}`);
});

contract.on("PredictionMade", (marketId, user, vote, amount) => {
  console.log(`[PredictionMade] Market: ${marketId}, User: ${user}, Vote: ${vote}, Amount: ${ethers.formatEther(amount)} ETH`);
});

contract.on("SettlementRequested", (marketId) => {
  console.log(`[SettlementRequested] Market: ${marketId}`);
});

contract.on("MarketResolved", (marketId, outcome) => {
  console.log(`[MarketResolved] Market: ${marketId}, Outcome: ${outcome}`);
});

// VRF randomness monitoring (if you emit an event in fulfillRandomWords, add a listener here)

console.log("Listening for PredictionMarket events...");
