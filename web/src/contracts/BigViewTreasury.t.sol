// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol"; 
import "./BigViewTreasury.sol";   

contract BigViewTest is Test {
    // FIXED: Removed the extra '=' sign here
    BigViewTreasury public BigViewContract; 

    // Create a fake address that represents the major pool grid account.
    address public poolAddress = address(999);

    function setUp() public {
        // Pass our fake pool address to the constructor, when deploying
        BigViewContract = new BigViewTreasury(poolAddress); 
    }

    function test_DepositForwardToMajorPool() public {
        hoax(address(1), 100 ether);

        // Record the pool's balance BEFORE the deposit (should be 0)
        uint256 poolBalanceBefore = poolAddress.balance;
        assertEq(poolBalanceBefore, 0);

        // Act: Deposit funds
        BigViewContract.deposit{value: 10 ether}(address(1));
        
        // Assertions
        assertEq(address(BigViewContract).balance, 0);

        // The poolAddress balance should now be EXACTLY 10 ether!
        assertEq(poolAddress.balance, 10 ether);
    }
}
