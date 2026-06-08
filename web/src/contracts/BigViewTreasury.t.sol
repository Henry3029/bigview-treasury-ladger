// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol"; // 1. Brings in the Foundry tools file
import "./BigViewTreasury.sol";    // 2. Brings in your actual smart contract file

// 3. "is Test" unlocks hoax() and assertEq()
contract BigViewTest is Test {
    BigViewTreasury public =  BigViewContract; // The slot to hold your contract

// create a fake address that represents the major pool grid account.
address public poolAddress = address(999);

    // 4. This runs automatically before every single test
    function setUp() public {
 
// pass our fake pool address to the constructor, when deploying
        BigViewContract = new BigViewTreasury(poolAddress); 
    }

    // 5. Now your tests down here can use it!
    function test_DepositForwardToMajorPool() public {
        hoax(address(1), 100 ether);

// Record the pool's balance BEFORE the deposit (should be 0)
        uint256 poolBalanceBefore = poolAddress.balance;
        assertEq(poolBalanceBefore, 0);

BigViewContract.deposit{value: 10 ether}(address(1));
        assertEq(address(BigViewContract).balance, 0);

// The poolAddress balance should now be EXACTLY 10 ether!
        assertEq(poolAddress.balance, 10 ether);
    }
}
