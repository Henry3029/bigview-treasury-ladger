// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC1967Proxy} from "../../lib/openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "forge-std/Test.sol";
import "./BigViewTreasury.sol";

contract BigViewTest is Test {
    BigViewTreasury public BigViewContract;

    // Designated mock test addresses
    address public poolAddress = address(999);
    address public devAddress = address(99);

    function setUp() public {
        // 1. Deploy the implementation contract blueprint
        BigViewTreasury implementation = new BigViewTreasury();

        // 2. FIXED: Encoded with the EXACT order the contract expects: (_devFeeAddress, _majorPoolAddress)
        bytes memory initData = abi.encodeWithSelector(
            BigViewTreasury.initialize.selector,
            devAddress,    // 1st parameter: address(99)
            poolAddress    // 2nd parameter: address(999)
        );

        // 3. Deploy the Proxy pointing to the implementation and pass the initialization payload
        ERC1967Proxy proxy = new ERC1967Proxy(address(implementation), initData);

        // 4. Wrap the proxy address back into your contract interface variable
        BigViewContract = BigViewTreasury(address(proxy));
    } 

    function test_DepositForwardToMajorPool() public {
        hoax(address(1), 100 ether);

        uint256 poolBalanceBefore = poolAddress.balance;
        assertEq(poolBalanceBefore, 0);

        // Act: Deposit funds through the proxy gateway
        BigViewContract.deposit{value: 10 ether}(address(1));

        // Assertions: Contract must pass funds along immediately
        assertEq(address(BigViewContract).balance, 0);
        assertEq(poolAddress.balance, 10 ether);
    }

    function test_ReceiveRewards() public {
        hoax(address(999), 100 ether);
        BigViewContract.receiveReward{value: 100 ether}();
        assertEq(address(BigViewContract).balance, 100 ether);
    }

    function test_ClaimRewardWithDevFee() public {
        uint256 startingVaultAmount = 10 ether;
        uint256 expectedDevFee = 0.5 ether;  // 5% of 10 Ether
        uint256 expectedUserCut = 9.5 ether; // 95% of 10 Ether

        // 1. SETUP: Fill the contract vault with 10 Ether using deal()
        deal(address(BigViewContract), startingVaultAmount);

        // 2. HOAX: Pretend to be user address(1) to claim rewards
        hoax(address(1));

        // 3. ACT: Call the claim function with the 10 Ether amount
        BigViewContract.claimReward(startingVaultAmount);

        // 4. ASSERT 1: Prove the contract vault completely emptied out
        assertEq(address(BigViewContract).balance, 0 ether);

        // 5. ASSERT 2: Prove the user exclusively received their 95% cut
        assertEq(address(1).balance, expectedUserCut);

        // 6. ASSERT 3: Prove the Developer address received their strict 5% fee
        assertEq(devAddress.balance, expectedDevFee);
    }
}
