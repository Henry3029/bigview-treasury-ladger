// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./BigViewToken.sol";

contract BigViewTreasuryV2 is ReentrancyGuard {
    // --- State Variables ---
    BigViewToken public immutable rewardToken;
    address public devWallet;
    address public majorPoolAddress;
    
    uint256 public totalMembersCount;
    uint256 public totalStakedAmount;
    uint256 public rewardRate = 10; // 10 BVW per 1 ETH

    struct Member {
        bool isMember;
        uint256 amount;
        uint256 unclaimedBVW; // BATCHING: Stores rewards until claimed
    }

    mapping(address => Member) public members;
    
event Staked(address indexed user, uint256 ethAmount, uint256 bvwEarned);
event RewardsClaimed(address indexed user, uint256 amount);
event ExternalYieldClaimed(address indexed user, address token, uint256 amount);

    // --- Errors ---
    error NotAuthorized();
    error NoStake();
    error TransferFailed();
    error InvalidAmount();
    error NothingToClaim();

    constructor(address _tokenAddress, address _majorPool) {
        rewardToken = BigViewToken(_tokenAddress); 
        devWallet = msg.sender;
        majorPoolAddress = _majorPool;
    }

    /**
     * @notice Stakes ETH and records rewards for later claiming (Batching)
     */
    function stakeAndDelegate() external payable nonReentrant {
        if (msg.value == 0) revert InvalidAmount();

        // 1. Update Membership
        if (!members[msg.sender].isMember) {
            members[msg.sender].isMember = true;
            totalMembersCount += 1;
        }
        
        // 2. Calculate and Store Rewards (Instead of minting immediately)
        uint256 bvwToEarn = msg.value * rewardRate;
        members[msg.sender].unclaimedBVW += bvwToEarn;
        
        members[msg.sender].amount += msg.value;
        totalStakedAmount += msg.value;

        // 3. Interactions: 90/10 Split
        uint256 poolShare = (msg.value * 90) / 100;
        (bool success, ) = majorPoolAddress.call{value: poolShare}("");
        if (!success) revert TransferFailed();
        
        emit Staked(msg.sender, msg.value, bvwToEarn);
    }

    /**
     * @notice Claim accumulated BVW Governance Tokens in one transaction
     */
    function claimGovernanceRewards() external nonReentrant {
        uint256 amount = members[msg.sender].unclaimedBVW;
        if (amount == 0) revert NothingToClaim();

        // Reset before minting (Security: Anti-Reentrancy)
        members[msg.sender].unclaimedBVW = 0;
        
        rewardToken.mint(msg.sender, amount);
        
        emit RewardsClaimed(msg.sender, amount);
    }

    /**
     * @notice Claim External Rewards (sBTC/USDT) sent to the contract
     */
    function claimExternalYield(address _tokenAddress) external nonReentrant {
        uint256 userStake = members[msg.sender].amount;
        if (userStake == 0 || totalStakedAmount == 0) revert NoStake();

        IERC20 externalToken = IERC20(_tokenAddress);
        uint256 contractBalance = externalToken.balanceOf(address(this));
        if (contractBalance == 0) revert NothingToClaim();

        // Math: (User Stake * Total Rewards) / Total Protocol Stake
        uint256 totalUserReward = (userStake * contractBalance) / totalStakedAmount;
        if (totalUserReward == 0) revert NothingToClaim();

        uint256 devFee = (totalUserReward * 5) / 100;
        uint256 finalUserReward = totalUserReward - devFee;

        bool feeSent = externalToken.transfer(devWallet, devFee);
        bool rewardSent = externalToken.transfer(msg.sender, finalUserReward);
        
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