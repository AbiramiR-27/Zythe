import { ethers } from "hardhat";
import { formatEther, parseEther } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  // Chainlink Forwarder address on Sepolia (fixed address from docs)
  const FORWARDER_ADDRESS = process.env.FORWARDER_ADDRESS || "0x15fc6ae953e024d975e77382eeec56a9101f9f88";
  
  console.log("📡 Deploying PredictionMarket...");
  console.log("Chain:", "Sepolia Testnet");
  console.log("Forwarder address:", FORWARDER_ADDRESS);
  
  // Get signer info
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", formatEther(balance), "ETH");
  
  if (balance < parseEther("0.01")) {
    console.warn("⚠️  Low balance! You need Sepolia ETH for deployment.");
    console.warn("Get free ETH from: https://faucets.chain.link/sepolia");
  }
  
  // Get the contract factory
  const PredictionMarket = await ethers.getContractFactory("PredictionMarket");
  
  console.log("Deploying contract...");
  
  // Deploy the contract
  const market = await PredictionMarket.deploy(FORWARDER_ADDRESS);
  
  // Wait for deployment
  const deploymentReceipt = await market.deploymentTransaction()?.wait();
  
  console.log("\n✅ PredictionMarket deployed successfully!");
  console.log("Contract address:", await market.getAddress());
  
  // Log deployment info
  console.log("\n📋 Deployment Summary:");
  console.log("----------------------");
  console.log("Network: Sepolia");
  console.log("Contract: PredictionMarket");
  console.log("Address:", await market.getAddress());
  console.log("Forwarder:", FORWARDER_ADDRESS);
  console.log("Deployer:", deployer.address);
  console.log("Transaction hash:", deploymentReceipt?.hash);
  
  // Verify on Etherscan (optional)
  console.log("\n🔍 View on Etherscan:");
  console.log(`https://sepolia.etherscan.io/address/${await market.getAddress()}`);
  
  // Instructions for next steps
  console.log("\n📝 Next Steps:");
  console.log("1. Save this contract address in your CRE config file:");
  console.log(`   File: ../cre-workflow/prediction-market-demo/config.staging.json`);
  console.log(`   Update "marketAddress" to: ${await market.getAddress()}`);
  console.log("\n2. Run CRE simulation:");
  console.log("   cd ../cre-workflow/prediction-market-demo");
  console.log("   cre workflow simulate prediction-market-demo");
  console.log("\n3. Create a test market via HTTP trigger");
  console.log("4. Make predictions and test settlement");
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed!");
    console.error(error);
    process.exitCode = 1;
  });