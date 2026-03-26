import { expect } from "chai";
import hre from "hardhat";

describe("BigView Treasury Production Suite", function () {
  let ethers: any; 
  let treasury: any;
  let deployer: any;
  let alice: any;
  let bob: any;

  // Deep Think Fix: Wait for HRE to load ethers
  before(async function() {
    ethers = hre.ethers;
  });

  beforeEach(async function () {
    [deployer, alice, bob] = await ethers.getSigners();

    const TokenFactory = await ethers.getContractFactory("BigViewToken");
    const token = await TokenFactory.deploy();

    const TreasuryFactory = await ethers.getContractFactory("BigViewTreasury");
    // Pass bob's address as the initial pool argument
    treasury = await TreasuryFactory.deploy(bob.address);
  });

  it("STAKING: Should allow Alice to stake and update global stats", async function () {
    const stakeAmount = ethers.parseEther("1.0");

    await expect(treasury.connect(alice).stakeAndDelegate({ value: stakeAmount }))
      .to.emit(treasury, "Staked")
      .withArgs(alice.address, stakeAmount);

    expect(await treasury.totalStakedAmount()).to.equal(stakeAmount);
  });

  it("SECURITY: Should block Alice from setting the major pool", async function () {
    await expect(
      treasury.connect(alice).setMajorPool(bob.address)
    ).to.be.revertedWithCustomError(treasury, "NotAuthorized");
  });
});