// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/contracts/BigViewToken.sol";
import "../src/contracts/BigViewTreasury.sol";

contract BigViewTest is Test {
    BigViewToken token;
    BigViewTreasury treasury;
    
    address dev = address(0x123);
    address alice = address(0x1);
    address bob = address(0x2);

    function setUp() public {
        vm.startPrank(dev);
        
        // 1. Deploy Token
        token = new BigViewToken();
        
        // 2. Deploy Treasury (tokenAddress, poolAddress)
        treasury = new BigViewTreasury(address(token), bob);
        
        // 3. THE FIX: Add the treasury to the isMinter mapping
        token.addMinter(address(treasury));
        
        vm.stopPrank();
    }

    // --- METADATA ---
    function test_Metadata() public view {
        assertEq(token.name(), "BigView");
        assertEq(address(treasury.rewardToken()), address(token));
    }

    // --- BATCHING LOGIC TESTS ---

    function test_Staking_AccumulatesRewards() public {
        uint256 stakeAmount = 1 ether;
        uint256 expectedReward = stakeAmount * treasury.rewardRate();

        hoax(alice, 2 ether);
        treasury.stakeAndDelegate{value: stakeAmount}();

        // Alice's wallet balance should still be 0 (Batching)
        assertEq(token.balanceOf(alice), 0);

        // Check the Treasury "notebook" (Member struct)
        (,,uint256 unclaimed) = treasury.members(alice);
        assertEq(unclaimed, expectedReward);
    }

    function test_Claim_GovernanceTokens() public {
        uint256 stakeAmount = 1 ether;
        uint256 expectedReward = stakeAmount * treasury.rewardRate();

        hoax(alice, 2 ether);
        treasury.stakeAndDelegate{value: stakeAmount}();

        // Alice claims her batch
        vm.prank(alice);
        treasury.claimGovernanceRewards();

        // Now Alice should have her tokens
        assertEq(token.balanceOf(alice), expectedReward);
        
        // Unclaimed balance should be reset to 0
        (,,uint256 unclaimedAfter) = treasury.members(alice);
        assertEq(unclaimedAfter, 0);
    }

    // --- SECURITY & REVERTS ---

    function test_Security_AliceCannotChangePool() public {
        vm.prank(alice);
        vm.expectRevert(BigViewTreasury.NotAuthorized.selector);
        treasury.setMajorPool(alice);
    }

    function test_Security_AliceCannotMint() public {
        vm.startPrank(alice);
        // Alice tries to bypass the Treasury to mint directly
        vm.expectRevert("Not authorized to mint");
        token.mint(alice, 1000000 ether);
        vm.stopPrank();
    }

    function test_Revert_OnZeroStake() public {
        hoax(alice, 1 ether);
        vm.expectRevert(BigViewTreasury.InvalidAmount.selector);
        treasury.stakeAndDelegate{value: 0}();
    }

    function test_Revert_ClaimWithNoRewards() public {
        vm.prank(alice);
        vm.expectRevert(BigViewTreasury.NothingToClaim.selector);
        treasury.claimGovernanceRewards();
    }

    // --- FINANCIALS ---

    function test_Staking_Split_90_10() public {
        uint256 stakeAmount = 1 ether;
        uint256 expectedPoolShare = (stakeAmount * 90) / 100;
        uint256 expectedTreasuryShare = (stakeAmount * 10) / 100;

        uint256 bobBalanceBefore = address(bob).balance;

        hoax(alice, 2 ether);
        treasury.stakeAndDelegate{value: stakeAmount}();

        assertEq(address(bob).balance, bobBalanceBefore + expectedPoolShare);
        assertEq(address(treasury).balance, expectedTreasuryShare);
    }
}