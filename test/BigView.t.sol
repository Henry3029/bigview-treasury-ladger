// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/contracts/BigViewToken.sol";
import "../src/contracts/BigViewTreasury.sol";

contract BigViewTest is Test {
    BigViewToken token;
    BigViewTreasury treasury;
    address alice = address(0x1);

    function setUp() public {
        token = new BigViewToken();
        treasury = new BigViewTreasury(address(0x2));
    }

    function test_Metadata() public view {
        assertEq(token.name(), "BigView");
        assertEq(token.symbol(), "BVW");
    }

    function test_Staking() public {
        hoax(alice, 5 ether); // Gives Alice 5 ETH and sets her as the caller
        treasury.stakeAndDelegate{value: 1 ether}();
        assertEq(treasury.totalStakedAmount(), 1 ether);
    }
}