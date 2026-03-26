// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/contracts/BigViewToken.sol";
import "../src/contracts/BigViewTreasury.sol";

contract BigViewTest is Test {
    BigViewToken token;
    BigViewTreasury treasury;
    
    // Test addresses
    address dev = address(0x123);
    address alice = address(0x1);
    address bob = address(0x2);

    function setUp() public {
        // 1. Deploy Token as Dev
        vm.startPrank(dev);
        token = new BigViewToken();
        
        // 2. Deploy Treasury (Needs Token address and Major Pool address)
        // Note: Constructor order is (token, pool)
        treasury = new BigViewTreasury(address(token), bob);

        // 3. AUTHORIZE Treasury to mint BVW tokens
        // Make sure your BigViewToken.sol has the 'addMinter' function!
        token.addMinter(address(treasury));
        vm.stopPrank();
    }

    // --- METADATA & SETUP ---
    function test_Metadata() public view {
        assertEq(token.name(), "BigView");
        // FIXED: Changed bvwToken() to rewardToken() to match your Treasury contract
        assertEq(address(treasury.rewardToken()), address(token));
    }

    // --- STAKING & MINTING (The "Strong Token" Logic) ---
    function test_Staking_MintsSidekickTokens() public {
        uint256 stakeAmount = 1 ether;
        uint256 expectedMint = stakeAmount * treasury.rewardRate();

        hoax(alice, 5 ether);
        treasury.stakeAndDelegate{value: stakeAmount}();

        // Check if Alice got her 10 BVW (1 ETH * 10)
        assertEq(token.balanceOf(alice), expectedMint);
        // Check if total staked in Treasury is correct
        assertEq(treasury.totalStakedAmount(), stakeAmount);
    }

    // --- GOVERNANCE & SECURITY ---
    function test_Security_AliceCannotChangePool() public {
        vm.prank(alice);
        // Explicitly check the error from the Treasury contract
        vm.expectRevert(BigViewTreasury.NotAuthorized.selector);
        treasury.setMajorPool(alice);
    }

    function test_Security_DevCanChangeRate() public {
        vm.prank(dev);
        treasury.setRewardRate(20); // Changing from 10 to 20
        assertEq(treasury.rewardRate(), 20);
    }

    // --- EDGE CASES ---
    function test_Revert_OnZeroStake() public {
        hoax(alice, 1 ether);
        vm.expectRevert(BigViewTreasury.InvalidAmount.selector);
        treasury.stakeAndDelegate{value: 0}();
    }
    
    // --- FINANCIAL LOGIC (The 90/10 Split) ---
    function test_Staking_Split_90_10() public {
        uint256 stakeAmount = 1 ether;
        uint256 expectedPoolShare = (stakeAmount * 90) / 100; // 0.9 ETH
        uint256 expectedTreasuryShare = (stakeAmount * 10) / 100; // 0.1 ETH

        uint256 bobBalanceBefore = address(bob).balance;

        hoax(alice, 2 ether);
        treasury.stakeAndDelegate{value: stakeAmount}();

        // 1. Check if Bob (Major Pool) got 0.9 ETH
        assertEq(address(bob).balance, bobBalanceBefore + expectedPoolShare);

        // 2. Check if the Treasury contract kept 0.1 ETH
        assertEq(address(treasury).balance, expectedTreasuryShare);
    }
}