require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure Ethereum provider
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

// Load PredictionMarket contract
const predictionMarketAddress = process.env.CONTRACT_ADDRESS;
const predictionMarketABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_forwarder",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "marketId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "question",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "feed",
        "type": "address"
      }
    ],
    "name": "MarketCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "marketId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "outcome",
        "type": "string"
      }
    ],
    "name": "MarketResolved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "marketId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "vote",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "PredictionMade",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "marketId",
        "type": "uint256"
      }
    ],
    "name": "SettlementRequested",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "CREATION_COOLDOWN",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_question",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_deadline",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_feed",
        "type": "address"
      }
    ],
    "name": "createMarket",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "forwarder",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getContractBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_marketId",
        "type": "uint256"
      }
    ],
    "name": "getMarket",
    "outputs": [
      {
        "internalType": "string",
        "name": "question",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "resolved",
        "type": "bool"
      },
      {
        "internalType": "string",
        "name": "outcome",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "totalYes",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "totalNo",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_marketId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "getUserVote",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_marketId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "hasUserVoted",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "lastMarketCreation",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "marketCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "markets",
    "outputs": [
      {
        "internalType": "string",
        "name": "question",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "resolutionFeed",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "resolved",
        "type": "bool"
      },
      {
        "internalType": "string",
        "name": "outcome",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "totalYes",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "totalNo",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_marketId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_outcome",
        "type": "string"
      }
    ],
    "name": "onReport",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_marketId",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "_vote",
        "type": "bool"
      }
    ],
    "name": "predict",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_marketId",
        "type": "uint256"
      }
    ],
    "name": "requestSettlement",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
const predictionMarketContract = new ethers.Contract(predictionMarketAddress, predictionMarketABI, wallet);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// World ID Proof Verification Route
app.post('/api/verify-world-id', async (req, res) => {
  const { proof, signal, actionId } = req.body;

  try {
    // Example logic for off-chain proof verification
    const isValid = await someWorldIDVerificationFunction(proof, signal, actionId);

    if (isValid) {
      res.status(200).json({ success: true, message: 'World ID verified successfully!' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid World ID proof.' });
    }
  } catch (error) {
    console.error('Error verifying World ID:', error);
    res.status(500).json({ success: false, message: 'Verification failed', error: error.message });
  }
});

// Prediction Market Routes
app.post('/api/create-prediction', async (req, res) => {
  const { question, options, endTime } = req.body;

  try {
    const tx = await predictionMarketContract.createPrediction(question, options, endTime);
    await tx.wait();

    res.status(200).json({ success: true, message: 'Prediction market created successfully!', transactionHash: tx.hash });
  } catch (error) {
    console.error('Error creating prediction market:', error);
    res.status(500).json({ success: false, message: 'Failed to create prediction market', error: error.message });
  }
});

app.get('/api/predictions', async (req, res) => {
  try {
    const predictions = await predictionMarketContract.getAllPredictions();

    res.status(200).json({ success: true, predictions });
  } catch (error) {
    console.error('Error fetching predictions:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch predictions', error: error.message });
  }
});

app.post('/api/resolve-prediction', async (req, res) => {
  const { predictionId, result } = req.body;

  try {
    const tx = await predictionMarketContract.resolvePrediction(predictionId, result);
    await tx.wait();

    res.status(200).json({ success: true, message: 'Prediction market resolved successfully!', transactionHash: tx.hash });
  } catch (error) {
    console.error('Error resolving prediction market:', error);
    res.status(500).json({ success: false, message: 'Failed to resolve prediction market', error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});