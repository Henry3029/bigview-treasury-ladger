// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC1967Proxy} from "../../lib/openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "forge-std/Test.sol";
import "./BigViewTreasury.sol";

contract BigViewTest is Test {
    BigViewTreasury public BigViewContract;

    // Create a fake address that represents the major pool grid account.
    address public poolAddress = address(999);

    function setUp() public {
        // 1. Deploy the implementation contract blueprint
        BigViewTreasury implementation = new BigViewTreasury();

        // 2. Encode the initialization function call data with the poolAddress argument
bytes memory initData = abi.encodeWithSelector(
            BigViewTreasury.initialize.selector,
            poolAddress
        );


        // 3. Deploy the Proxy pointing to the implementation and pass the initialization payload!
        ERC1967Proxy proxy = new ERC1967Proxy(address(implementation), initData);

        // 4. Wrap the proxy address back into your contract interface variable
        BigViewContract = BigViewTreasury(address(proxy));
    } // <-- CLOSED THE setUp FUNCTION PROPERLY HERE

    function test_DepositForwardToMajorPool() public {
        hoax(address(1), 100 ether);

        // Record the pool's balance BEFORE the deposit (should be 0)
        uint256 poolBalanceBefore = poolAddress.balance;
        assertEq(poolBalanceBefore, 0);

        // Act: Deposit funds (Ensure this matches your final contract parameters!)
        // If you kept (address user) in the contract, keep address(1) here.
        // If you removed it as recommended earlier, change this to: BigViewContract.deposit{value: 10 ether}();
        BigViewContract.deposit{value: 10 ether}(address(1));

        // Assertions
        assertEq(address(BigViewContract).balance, 0);
        
        // The poolAddress balance should now be EXACTLY 10 ether!
        assertEq(poolAddress.balance, 10 ether);
    }
}
