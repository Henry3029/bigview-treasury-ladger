// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// 1. FIXED: Added '-upgradeable' to the root package name
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
// 2. This matches your line perfectly!
contract BigViewTreasury is Initializable, ReentrancyGuardUpgradeable {

    address public majorPoolAddress;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // Replace your constructor logic with this initialize function!
    function initialize(address _majorPoolAddress) public initializer {
        // 3. FIXED: This sets up the reentrancy guard safety flags behind the scenes
        __ReentrancyGuard_init(); 
        
        majorPoolAddress = _majorPoolAddress;
    }

    // Your deposit function can now safely use the nonReentrant modifier!
    function deposit(address user) public payable nonReentrant {
        require(msg.value > 0, "can't deposit zero token");
        (bool success, ) = majorPoolAddress.call{value: msg.value}("");
        require(success, "Transfer Failed");
    }
}
