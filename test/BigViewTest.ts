import { expect } from "chai";
import { ethers } from "hardhat";
import { BigViewTreasury, BigViewToken } from "../typechain-types"; // Generated automatically

describe("BigView Treasury Production Suite", function () {
  let treasury: BigViewTreasury;
  let token: BigViewToken;
  let deployer: any;
  let alice: any;
  let bob: any;

  beforeEach(async function () {
    // 1. Get Accounts (Equivalent to simnet.getAccounts)
    [deployer, alice, bob] = await ethers.getSigners();

    // 2. Deploy Token
    const TokenFactory = await ethers.getContractFactory("BigViewToken");
    token = await TokenFactory.deploy();

    // 3. Deploy Treasury (Equivalent to Clarinet's automatic deployment)
    const TreasuryFactory = await ethers.getContractFactory("BigViewTreasury");
    treasury = await TreasuryFactory.deploy(bob.address); // Pass bob as the initial pool
  });

  it("STAKING: Should allow Alice to stake and update global stats", async function () {
    const stakeAmount = ethers.parseEther("1.0"); // 1 ETH

    // Alice stakes 1 ETH
    await expect(treasury.connect(alice).stakeAndDelegate({ value: stakeAmount }))
      .to.emit(treasury, "Transfer") // Optional: if you add events
      .to.not.be.reverted;

    expect(await treasury.totalStakedAmount()).to.equal(stakeAmount);
  });

  it("SECURITY: Should block Alice from setting the major pool (Error 403 equivalent)", async function () {
    // Only the devWallet (deployer) can do this. Alice should fail.
    await expect(
      treasury.connect(alice).setMajorPool(bob.address)
    ).to.be.revertedWithCustomError(treasury, "NotAuthorized"); 
    // ^ Matches the "error NotAuthorized()" we put in your Solidity code
  });
});