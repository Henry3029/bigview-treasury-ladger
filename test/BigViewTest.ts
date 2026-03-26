import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;

// We use 'any' temporarily to avoid TypeChain path errors on mobile
describe("BigView Treasury Production Suite", function () {
  let treasury: any;
  let token: any;
  let deployer: any;
  let alice: any;
  let bob: any;

  beforeEach(async function () {
    // 1. Get Accounts
    [deployer, alice, bob] = await ethers.getSigners();

    // 2. Deploy Token
    const TokenFactory = await ethers.getContractFactory("BigViewToken");
    token = await TokenFactory.deploy();

    // 3. Deploy Treasury
    const TreasuryFactory = await ethers.getContractFactory("BigViewTreasury");
    // We pass bob's address as the initial pool argument for the constructor
    treasury = await TreasuryFactory.deploy(bob.address);
  });

  it("STAKING: Should allow Alice to stake and update global stats", async function () {
    const stakeAmount = ethers.parseEther("1.0");

    // We check for the 'Staked' event which is in the Solidity code I gave you
    await expect(treasury.connect(alice).stakeAndDelegate({ value: stakeAmount }))
      .to.emit(treasury, "Staked")
      .withArgs(alice.address, stakeAmount);

    expect(await treasury.totalStakedAmount()).to.equal(stakeAmount);
  });

  it("SECURITY: Should block Alice from setting the major pool", async function () {
    // Alice tries to call a function meant for the devWallet (deployer)
    await expect(
      treasury.connect(alice).setMajorPool(bob.address)
    ).to.be.revertedWithCustomError(treasury, "NotAuthorized");
  });
});