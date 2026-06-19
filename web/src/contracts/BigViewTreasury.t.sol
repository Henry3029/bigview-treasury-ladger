// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC1967Proxy} from "../../lib/openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "forge-std/Test.sol";
import "./BigViewTreasury.sol";

contract BigViewTest is Test {
    BigViewTreasury public BigViewContract;

    // Designated mock test addresses
    address public poolAddress = address(999);
    address public devAddress = address(0xDDD);
address public user1 = address(1);

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
        assertEq(
poolBalanceBefore, 0);

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
address user = address(1);

        // 1. SETUP: Fill the contract vault with 10 Ether using deal()
        deal(address(BigViewContract), startingVaultAmount);

// Slot 0 is typically where your first mapping lives. Adjust if userStates is defined lower.
        bytes32 userStateSlot = keccak256(abi.encode(user, uint256(0)));

// This force-writes address(1) into the 'usersAddress' field of the struct
        vm.store(address(BigViewContract), userStateSlot, bytes32(uint256(uint160(user))));


        // 2. HOAX: Pretend to be user address(1) to claim rewards
        hoax(user, 0 ether);

        // 3. ACT: Call the claim function with the 10 Ether amount
        BigViewContract.claimReward(startingVaultAmount);

        // 4. ASSERT 1: Prove the contract vault completely emptied out
        assertEq(address(BigViewContract).balance, 0 ether);

        // 5. ASSERT 2: Prove the user exclusively received their 95% cut
        assertEq(user.balance, expectedUserCut);

        // 6. ASSERT 3: Prove the Developer address received their strict 5% fee
        assertEq(devAddress.balance, expectedDevFee);
    }

// 🧪 TEST 1: Total Unstake (Withdrawing everything)
    function test_TotalUnstake() public {
        deal(address(BigViewContract), 100 ether);

        hoax(user1);
        BigViewContract.unstake(100 ether); // Pass the full amount

        assertEq(address(BigViewContract).balance, 0 ether);
        assertEq(user1.balance, 100 ether);
    }

// 🧪 TEST 2: Partial Unstake (Withdrawing a fraction)
    function test_PartialUnstake() public {
        // Start with 100 ether in the contract vault
        deal(address(user1), 160 ether);

// 2. Pretend to be user1 and STAKE the 100 ether into the contract
    // (This automatically fills the contract vault AND updates the struct state!)
    hoax(user1);
    BigViewContract.deposit{value: 100 ether}(user1);


        hoax(user1);
        // User only pulls out 40 ether
        BigViewContract.unstake(40 ether); 

        // Assertions match the split math perfectly!
        assertEq(address(BigViewContract).balance, 60 ether); // 100 - 40 left behind
        assertEq(user1.balance, 40 ether);                    // 40 received
    }

}
