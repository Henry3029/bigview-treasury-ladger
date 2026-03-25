// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title BigView Treasury (Solidity Version)
 * @author Henry Goodluck Chigozie
 */
contract BigViewTreasury is ReentrancyGuard {
    // --- State Variables ---
    address public devWallet;
    address public majorPoolAddress;
    uint256 public totalMembersCount;
    uint256 public totalStakedAmount;

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

    constructor(address _majorPool) {
        devWallet = msg.sender;
        majorPoolAddress = _majorPool;
    }

    // --- Public Functions ---

    /**
     * @notice Stakes ETH and simulates delegation
     * @dev Uses Checks-Effects-Interactions to prevent re-entrancy
     */
    function stakeAndDelegate() external payable nonReentrant {
        if (msg.value == 0) revert InvalidAmount();

        // 1. CHECKS (Already done above)

        // 2. EFFECTS (Update state BEFORE external interaction)
        if (!members[msg.sender].isMember) {
            members[msg.sender].isMember = true;
            totalMembersCount += 1;
        }
        
        members[msg.sender].amount += msg.value;
        totalStakedAmount += msg.value;

        // 3. INTERACTIONS (The external transfer/delegation call)
        // In Solidity/Ethereum, delegation to a pool often happens 
        // via a separate call to the staking provider's contract.
        (bool success, ) = majorPoolAddress.call{value: msg.value}("");
        if (!success) revert TransferFailed();
    }

    /**
     * @notice Claim rewards in a specific ERC20 token
     */
    function claimRewards(address _tokenAddress) external nonReentrant {
        uint256 userStake = members[msg.sender].amount;
        if (userStake == 0) revert NoStake();
        if (totalStakedAmount == 0) revert NoStake();

        IERC20 sbtcToken = IERC20(_tokenAddress);
        uint256 contractBalance = sbtcToken.balanceOf(address(this));

        // Calculate rewards
        uint256 totalUserReward = (userStake * contractBalance) / totalStakedAmount;
        uint256 devFee = (totalUserReward * 5) / 100;
        uint256 finalUserReward = totalUserReward - devFee;

        // 1. CHECKS (Already done)
        // 2. EFFECTS (If we were resetting stake, we'd do it here)

        // 3. INTERACTIONS
        bool feeSent = sbtcToken.transfer(devWallet, devFee);
        bool rewardSent = sbtcToken.transfer(msg.sender, finalUserReward);
        
        if (!feeSent || !rewardSent) revert TransferFailed();
    }

    // --- Admin Functions ---

    function setMajorPool(address _newPool) external {
        if (msg.sender != devWallet) revert NotAuthorized();
        majorPoolAddress = _newPool;
    }

    function rewardMember(address _member, uint256 _amount, address _token) external {
        if (msg.sender != devWallet) revert NotAuthorized();
        bool success = IERC20(_token).transfer(_member, _amount);
        if (!success) revert TransferFailed();
    }

    // --- View Functions ---
    function getDashboardSummary() external view returns (uint256, uint256) {
        return (totalMembersCount, totalStakedAmount);
    }
}