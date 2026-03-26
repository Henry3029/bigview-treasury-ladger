// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./BigViewToken.sol";

/**
 * @title BigView Treasury (Governance & Reward Edition)
 */
contract BigViewTreasury is ReentrancyGuard {
    // --- State Variables ---
    BigViewToken public bvwToken;
    address public devWallet;
    address public majorPoolAddress;
    
    uint256 public totalMembersCount;
    uint256 public totalStakedAmount;
    uint256 public rewardRate = 10; // 10 BVW per 1 ETH (Scarce & Strong)

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

    constructor(address _tokenAddress, address _majorPool) {
        bvwToken = BigViewToken(_tokenAddress);
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

        // 2. GOVERNANCE: Mint BVW "Sidekick" tokens to the staker
        // This gives them voting power in the DAO
        uint256 bvwToMint = msg.value * rewardRate;
        bvwToken.mint(msg.sender, bvwToMint);

        // 3. INTERACTIONS: Send ETH to the Major Pool for investment
        // We send 90% and keep 10% in treasury for immediate claims/liquidity
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

        IERC20 rewardToken = IERC20(_tokenAddress);
        uint256 contractBalance = rewardToken.balanceOf(address(this));

        // Logic: (My Stake / Total Staked) * Total Rewards in Treasury
        uint256 totalUserReward = (userStake * contractBalance) / totalStakedAmount;
        uint256 devFee = (totalUserReward * 5) / 100;
        uint256 finalUserReward = totalUserReward - devFee;

        bool feeSent = rewardToken.transfer(devWallet, devFee);
        bool rewardSent = rewardToken.transfer(msg.sender, finalUserReward);
        
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