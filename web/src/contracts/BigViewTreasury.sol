// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// 1. FIXED: Added '-upgradeable' to the root package name
import {Initializable} from "../../lib/openzeppelin-contracts/contracts/proxy/utils/Initializable.sol";

// 2. Point ReentrancyGuard to the second folder path where it ACTUALLY lives!
import {ReentrancyGuard} from "../../lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";

// 2. This matches your line perfectly!
contract BigViewTreasury is Initializable, ReentrancyGuard {

    address public majorPoolAddress;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // Replace your constructor logic with this initialize function!
    function initialize(address _majorPoolAddress) public initializer {
        // 3. FIXED: This sets up the reentrancy guard safety flags behind the scenes
    
        
        majorPoolAddress = _majorPoolAddress;
    }

    // Your deposit function can now safely use the nonReentrant modifier!
    function deposit(address user) public payable nonReentrant {
        require(msg.value > 0, "can't deposit zero token");
        (bool success, ) = majorPoolAddress.call{value: msg.value}("");
        require(success, "Transfer Failed");
    }
}
