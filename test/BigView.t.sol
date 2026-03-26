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
        // We prank as 'dev' so the Treasury thinks the dev is the owner
        vm.prank(dev);
        token = new BigViewToken();
        
        vm.prank(dev);
        treasury = new BigViewTreasury(bob);
    }

    // --- EXISTING TESTS ---
    function test_Metadata() public view {
        assertEq(token.name(), "BigView");
    }

    function test_Staking() public {
        hoax(alice, 5 ether);
        treasury.stakeAndDelegate{value: 1 ether}();
        assertEq(treasury.totalStakedAmount(), 1 ether);
    }

    // --- NEW SECURITY & LOGIC TESTS ---

    function test_Security_AliceCannotChangePool() public {
        vm.prank(alice);
        // This cheatcode tells Forge: "The next line MUST fail with NotAuthorized"
        vm.expectRevert(NotAuthorized.selector);
        treasury.setMajorPool(alice);
    }

    function test_Security_DevCanChangePool() public {
        vm.prank(dev);
        treasury.setMajorPool(alice);
        assertEq(treasury.majorPool(), alice);
    }

    function test_Revert_OnZeroStake() public {
        hoax(alice, 1 ether);
        vm.expectRevert("Cannot stake 0");
        treasury.stakeAndDelegate{value: 0}();
    }
}