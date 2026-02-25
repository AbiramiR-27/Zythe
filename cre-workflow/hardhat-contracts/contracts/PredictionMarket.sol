            // Track participants for each market
    mapping(uint256 => address[]) public marketParticipants;
    import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
    import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
        /**
         * Fetch the latest price from the Chainlink price feed for a given market.
         * Returns price as int256 and the feed's decimals.
         */
    function getLatestPrice(uint256 _marketId) public view returns (int256 price, uint8 decimals) {
    Market storage market = markets[_marketId];
    require(market.resolutionFeed != address(0), "No price feed for this market");
    AggregatorV3Interface feed = AggregatorV3Interface(market.resolutionFeed);
            (
                ,
                int256 answer,
                ,
                ,
            ) = feed.latestRoundData();
            uint8 feedDecimals = feed.decimals();
            return (answer, feedDecimals);
        }
    /**
     * Chainlink Automation-compatible function to check and settle expired markets.
     * This can be called by an automation bot to automatically emit SettlementRequested for markets past their deadline.
     */
    function checkAndRequestSettlements(uint256 fromMarketId, uint256 toMarketId) external {
        for (uint256 i = fromMarketId; i <= toMarketId && i <= marketCount; i++) {
            Market storage market = markets[i];
            if (!market.resolved && market.deadline != 0 && block.timestamp >= market.deadline) {
                emit SettlementRequested(i);
            }
        }
    }
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract PredictionMarket is VRFConsumerBaseV2 {
        // Chainlink VRF variables
        VRFCoordinatorV2Interface private COORDINATOR;
        uint64 private s_subscriptionId;
        bytes32 private s_keyHash;
        uint32 private s_callbackGasLimit = 100000;
        uint16 private s_requestConfirmations = 3;
        uint32 private s_numWords = 1;
        mapping(uint256 => uint256) public randomResults; // requestId => random number
    struct Market {
        string question;
        uint256 deadline;
        address resolutionFeed;  // Chainlink price feed address
        bool resolved;
        string outcome;
        uint256 totalYes;
        uint256 totalNo;
        mapping(address => bool) hasVoted;
        mapping(address => bool) vote;
    }
    
    mapping(uint256 => Market) public markets;
    uint256 public marketCount;
    
    // Chainlink Forwarder address on Sepolia
    address public forwarder;
    
    // Events
    event MarketCreated(uint256 indexed marketId, string question, uint256 deadline, address feed);
    event PredictionMade(uint256 indexed marketId, address indexed user, bool vote, uint256 amount);
    event SettlementRequested(uint256 indexed marketId);
    event MarketResolved(uint256 indexed marketId, string outcome);
    
    constructor(address _forwarder, address vrfCoordinator, uint64 subscriptionId, bytes32 keyHash) VRFConsumerBaseV2(vrfCoordinator) {
        require(_forwarder != address(0), "Invalid forwarder address");
        forwarder = _forwarder;
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        s_subscriptionId = subscriptionId;
        s_keyHash = keyHash;
    }
        /**
         * Request a random number from Chainlink VRF.
         * Returns the requestId for tracking.
         */
        function requestRandomNumber() external returns (uint256 requestId) {
            requestId = COORDINATOR.requestRandomWords(
                s_keyHash,
                s_subscriptionId,
                s_requestConfirmations,
                s_callbackGasLimit,
                s_numWords
            );
        }

        /**
         * Callback function used by VRF Coordinator.
         */
        function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
            randomResults[requestId] = randomWords[0];
        }
    
    // Create a new prediction market
    function createMarket(
        string memory _question, 
        uint256 _deadline, 
        address _feed
    ) external {
        require(block.timestamp >= lastMarketCreation[msg.sender] + CREATION_COOLDOWN, "Cooldown period not met");
        require(_deadline > block.timestamp, "Deadline must be in future");
        require(_feed != address(0), "Invalid feed address");
        
        marketCount++;
        Market storage market = markets[marketCount];
        market.question = _question;
        market.deadline = _deadline;
        market.resolutionFeed = _feed;
        
        lastMarketCreation[msg.sender] = block.timestamp;

        emit MarketCreated(marketCount, _question, _deadline, _feed);
    }
    
    // Make a prediction (0.01 ETH required)
    function predict(uint256 _marketId, bool _vote) external payable {
        Market storage market = markets[_marketId];
        
        require(block.timestamp < market.deadline, "Market closed");
        require(!market.hasVoted[msg.sender], "Already voted");
        require(msg.value == 0.01 ether, "Must pay exactly 0.01 ETH");
        
        market.hasVoted[msg.sender] = true;
        market.vote[msg.sender] = _vote;
        
        if (_vote) {
            market.totalYes++;
        } else {
            market.totalNo++;
        }

        // Add participant to the list
        marketParticipants[_marketId].push(msg.sender);
            /**
             * Pick a random winner from market participants using Chainlink VRF random number.
             * @param marketId The market to pick a winner from.
             * @param requestId The VRF requestId to use for randomness.
             * @return winner The randomly selected winner address.
             */
            function pickRandomWinner(uint256 marketId, uint256 requestId) external view returns (address winner) {
                require(markets[marketId].resolved, "Market not resolved");
                address[] storage participants = marketParticipants[marketId];
                require(participants.length > 0, "No participants");
                uint256 random = randomResults[requestId];
                require(random != 0, "Randomness not fulfilled");
                uint256 winnerIndex = random % participants.length;
                return participants[winnerIndex];
            }
        
        emit PredictionMade(_marketId, msg.sender, _vote, msg.value);
    }
    
    // Request settlement (triggers CRE workflow)
    function requestSettlement(uint256 _marketId) external {
        Market storage market = markets[_marketId];
        
        require(block.timestamp >= market.deadline, "Market still active");
        require(!market.resolved, "Already resolved");
        
        emit SettlementRequested(_marketId);
    }
    
    // Called by Chainlink CRE via Forwarder
    function onReport(uint256 _marketId, string memory _outcome) external {
        require(msg.sender == forwarder, "Only forwarder can call");
        
        Market storage market = markets[_marketId];
        require(!market.resolved, "Already resolved");
        require(market.deadline != 0, "Market does not exist");
        
        market.resolved = true;
        market.outcome = _outcome;
        
        emit MarketResolved(_marketId, _outcome);
    }
    
    // Get market details
    function getMarket(uint256 _marketId) external view returns (
        string memory question,
        uint256 deadline,
        bool resolved,
        string memory outcome,
        uint256 totalYes,
        uint256 totalNo
    ) {
        Market storage market = markets[_marketId];
        return (
            market.question,
            market.deadline,
            market.resolved,
            market.outcome,
            market.totalYes,
            market.totalNo
        );
    }
    
    // Check if user has voted
    function hasUserVoted(uint256 _marketId, address _user) external view returns (bool) {
        return markets[_marketId].hasVoted[_user];
    }
    
    // Get user's vote
    function getUserVote(uint256 _marketId, address _user) external view returns (bool) {
        require(markets[_marketId].hasVoted[_user], "User hasn't voted");
        return markets[_marketId].vote[_user];
    }
    
    // Get total funds in contract
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    mapping(address => uint256) public lastMarketCreation;
    uint256 public constant CREATION_COOLDOWN = 1 days;
}