// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./BigViewToken.sol";

contract BigViewTreasury is ReentrancyGuard {
    // --- State Variables ---
    BigViewToken public immutable rewardToken; // Matches our 'rewardToken' declaration
    address public devWallet;
    address public majorPoolAddress;
    
    uint256 public totalMembersCount;
    uint256 public totalStakedAmount;
    uint256 public rewardRate = 10; // 10 BVW per 1 ETH

    struct Member {
        bool isMember;
        uint256 amount;
    }

    mapping(address => Member) public members;

    // --- Errors ---
    error NotAuthorized();
    error NoStake();
    error TransferFailed();
    error InvalidAmount();

    // UPDATED: Standardized variable names
    constructor(address _tokenAddress, address _majorPool) {
        rewardToken = BigViewToken(_tokenAddress); 
        devWallet = msg.sender;
        majorPoolAddress = _majorPool;
    }

    /**
     * @notice Stakes ETH, sends 90% to Pool, and MINTS Governance Tokens
     */
    function stakeAndDelegate() external payable nonReentrant {
        if (msg.value == 0) revert InvalidAmount();

        // 1. EFFECTS
        if (!members[msg.sender].isMember) {
            members[msg.sender].isMember = true;
            totalMembersCount += 1;
        }
        
        members[msg.sender].amount += msg.value;
        totalStakedAmount += msg.value;

        // 2. GOVERNANCE: Minting the "Sidekick" tokens
        uint256 bvwToMint = msg.value * rewardRate;
        rewardToken.mint(msg.sender, bvwToMint); // Uses 'rewardToken'

        // 3. INTERACTIONS: 90/10 Split
        uint256 poolShare = (msg.value * 90) / 100;
        (bool success, ) = majorPoolAddress.call{value: poolShare}("");
        if (!success) revert TransferFailed();
    }

    /**
     * @notice Claim Real Yield (ETH or sBTC) based on your Stake %
     */
    function claimRewards(address _tokenAddress) external nonReentrant {
        uint256 userStake = members[msg.sender].amount;
        if (userStake == 0 || totalStakedAmount == 0) revert NoStake();

        IERC20 externalRewardToken = IERC20(_tokenAddress);
        uint256 contractBalance = externalRewardToken.balanceOf(address(this));

        uint256 totalUserReward = (userStake * contractBalance) / totalStakedAmount;
        uint256 devFee = (totalUserReward * 5) / 100;
        uint256 finalUserReward = totalUserReward - devFee;

        bool feeSent = externalRewardToken.transfer(devWallet, devFee);
        bool rewardSent = externalRewardToken.transfer(msg.sender, finalUserReward);
        
        if (!feeSent || !rewardSent) revert TransferFailed();
    }

    // --- Admin Functions ---

    function setRewardRate(uint256 _newRate) external {
        if (msg.sender != devWallet) revert NotAuthorized();
        rewardRate = _newRate;
    }

    function setMajorPool(address _newPool) external {
        if (msg.sender != devWallet) revert NotAuthorized();
        majorPoolAddress = _newPool;
    }
}