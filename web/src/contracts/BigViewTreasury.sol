// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// 1. Point to the EXACT paths you found in your terminal search!
import {Initializable} from "../../lib/openzeppelin-contracts/contracts/proxy/utils/Initializable.sol";
import {ReentrancyGuard} from "../../lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";

contract BigViewTreasury is Initializable, ReentrancyGuard {

mapping(address => UserState) public userStates;

    address public majorPoolAddress;
    address public devFeeAddress;
    uint256 public totalRewards;

    mapping(address => uint256) public usersBalance;

    event RewardReceived(address indexed sender, uint256 amount);
event RewardClaimed(address indexed receiver, uint256 amount);
event Unstaked(address indexed user, uint256 amount);

    struct UserState {
uint256 stakedAmount;
        address usersAddress;
        uint256 rewardClaimed;
        bool failedClaimed;
        bool successfulClaimed;
    } 


    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // 2. The initialize function using the precise paths you verified
    function initialize(address _devFeeAddress, address _majorPoolAddress) public initializer {
        // NOTE: Standard ReentrancyGuard does not require an internal __init function call,
        // because its storage slots default to 0 (unlocked) on deployment automatically!
        
        devFeeAddress = _devFeeAddress;
        majorPoolAddress = _majorPoolAddress;
        totalRewards = 0;
    }

    function deposit(address user) public payable nonReentrant {
        require(msg.value > 0, "can't deposit zero token");
userStates[msg.sender].stakedAmount += msg.value;
        (bool success, ) = majorPoolAddress.call{value: msg.value}("");
        require(success, "Transfer Failed");
    }

    function receiveReward() public payable {
        require(msg.value > 0, "amount must be greater than zero");
        emit RewardReceived(msg.sender, msg.value);
        totalRewards += msg.value;
    }

    function claimReward(uint256 rewardAmount) public nonReentrant {
        require(address(this).balance >= rewardAmount, "Insufficient vault funds");
require(userStates[msg.sender].usersAddress == msg.sender, "else not a member");
require(!userStates[msg.sender].successfulClaimed, "Rewards Already Claimed");

userStates[msg.sender].rewardClaimed += 1;
userStates[msg.sender].successfulClaimed = true;

        uint256 devFee = (rewardAmount * 5) / 100;
        uint256 userCut = rewardAmount - devFee;

        (bool devSuccess, ) = payable(devFeeAddress).call{value: devFee}("");
        require(devSuccess, "Dev Fee Transfer Failed");

        (bool userSuccess, ) = payable(msg.sender).call{value: userCut}("");
        require(userSuccess, "User Reward Transfer Failed");

emit RewardClaimed(msg.sender, rewardAmount); 

    }

function unstake(uint256 _amount) external {
        // 1. Point directly to the caller's personal package in storage
        UserState storage user = userStates[msg.sender];
// 2. CHECK: Does the user actually have enough staked to pull this out?
        require(user.stakedAmount >= _amount, "Insufficient staked balance");

 // 3. EFFECTS: Update the struct field (State Change)
        user.stakedAmount -= _amount;

        // 4. INTERACTIONS: Securely transfer the crypto to msg.sender
        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "Transfer failed");

        emit Unstaked(msg.sender, _amount);
    }

}
