// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// 1. Point to the EXACT paths you found in your terminal search!
import {Initializable} from "../../lib/openzeppelin-contracts/contracts/proxy/utils/Initializable.sol";
import {ReentrancyGuard} from "../../lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";

contract BigViewTreasury is Initializable, ReentrancyGuard {

    address public majorPoolAddress;
    address public devFeeAddress;
    uint256 public totalRewards;

    mapping(address => uint256) public usersBalance;

    event RewardReceived(address indexed sender, uint256 amount);

    struct UserState {
        address usersAddress;
        uint256 rewardClaimed;
        bool failedClaimed;
        bool successfulClaimed;
    } 

    mapping(address => UserState) public userRecords;

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

        uint256 devFee = (rewardAmount * 5) / 100;
        uint256 userCut = rewardAmount - devFee;

        (bool devSuccess, ) = payable(devFeeAddress).call{value: devFee}("");
        require(devSuccess, "Dev Fee Transfer Failed");

        (bool userSuccess, ) = payable(msg.sender).call{value: userCut}("");
        require(userSuccess, "User Reward Transfer Failed");
    }
}
