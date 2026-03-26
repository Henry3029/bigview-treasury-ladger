// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/contracts/BigViewToken.sol";
import "../src/contracts/BigViewTreasury.sol";

contract DeployBigView is Script {
    function run() external {
        // 1. Setup the deployer's private key from .env
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // 2. Define the Major Pool (Bob's address or a multisig)
        // You can also move this to .env if you prefer
        address majorPool = 0x_YOUR_MAJOR_POOL_ADDRESS_HERE; 

        vm.startBroadcast(deployerPrivateKey);

        // 3. Deploy BigView Token
        BigViewToken token = new BigViewToken();
        console.log("BigViewToken deployed at:", address(token));

        // 4. Deploy BigView Treasury
        BigViewTreasury treasury = new BigViewTreasury(address(token), majorPool);
        console.log("BigViewTreasury deployed at:", address(treasury));

        // 5. Setup Permissions: Add Treasury as a Minter
        token.addMinter(address(treasury));
        console.log("Treasury authorized as Minter.");

        vm.stopBroadcast();
    }
}