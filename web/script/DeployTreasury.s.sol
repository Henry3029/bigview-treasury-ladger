solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/contracts/BigViewTreasury.sol";

contract DeployTreasury is Script {
    function run() external {
        // 1. Retrieve your private key from the .env file safely
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // 2. Start broadcasting transactions to the blockchain
        vm.startBroadcast(deployerPrivateKey);

        // 3. Deploy the contract passing the arguments directly in clean Solidity math
        new BigViewTreasury(
<<<<<<< HEAD
            0x28D549A2517FCB78f634088999aF99EED055ab86, // Your Token
            0x787Ba86c560569c879b93350Ca72C277E2134e1D, // cbETH
            0xa24112B301B9eb4475633523590DBd0e591D3C56  // Your Deployer Pool
=======
            0x28D549A2517FCB78f63408899af99EED055ab86, // Exact token checksum
            0x787Ba86c560569c879b93350Ca72C277E2134e1D, // Exact cbETH address
            0xa24112B301B9eb4475633523590DBd0e591D3C56,
>>>>>>> 00e13b0e03838a958206dfcb4f4b2b3baf494a8b
        );

        vm.stopBroadcast();
    }
}