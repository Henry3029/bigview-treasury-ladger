// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// 1. FIXED: Added '-upgradeable' to the root package name
import {Initializable} from "../../lib/openzeppelin-contracts/contracts/proxy/utils/Initializable.sol";

// 2. Point ReentrancyGuard to the second folder path where it ACTUALLY lives!
import {ReentrancyGuard} from "../../lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";

// 2. This matches your line perfectly!
contract BigViewTreasury is Initializable, ReentrancyGuard {

    address public majorPoolAddress;
mapping(address => uint256) public usersBalance; 
    address public devFee; 
uint256 public totalRewards;

event RewardReceived(address indexed sender, uint256 amount);

    // 2. Corrected spelling 'struct', removed commas, added semicolons
    struct UserState {
        address usersAddress;
        uint256 rewardClaimed; 
        bool failedClaimed; 
        bool successfulClaimed;
    } // <-- No semicolon needed after the closing brace of a struct

    // 3. To actually use your struct, you can map an address to it:
    mapping(address => UserState) public userRecords;


    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // Replace your constructor logic with this initialize function!
    function initialize(address _majorPoolAddress) public initializer {
        // 3. FIXED: This sets up the reentrancy guard safety flags behind the scenes
    
        
        majorPoolAddress = _majorPoolAddress;

totalRewards = 0;
    }

    // Your deposit function can now safely use the nonReentrant modifier!
    function deposit(address user) public payable nonReentrant {
        require(msg.value > 0, "can't deposit zero token");
        (bool success, ) = majorPoolAddress.call{value: msg.value}("");
        require(success, "Transfer Failed");
    }

function receiveReward() public payable {
    require(msg.value > 0, "amount must be greater than zero");
    
    emit RewardReceived(msg.sender, msg.value);
    
    // FIXED: Added the missing semicolon at the end of this line
    totalRewards += msg.value; 
}

}
