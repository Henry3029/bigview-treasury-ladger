import { expect } from "chai";
import { ethers } from "hardhat";

describe("BigView Token (BVW) Suite", function () {
  async function deployTokenFixture() {
    // Get accounts (Equivalent to simnet.getAccounts)
    const [owner, alice, bob] = await ethers.getSigners();

    // Deploy the Token (Equivalent to Clarinet's automatic deployment)
    const Token = await ethers.getContractFactory("BigViewToken");
    const token = await Token.deploy();

    return { token, owner, alice, bob };
  }

  it("METADATA: Should have the correct name and symbol", async function () {
    const { token } = await deployTokenFixture();

    expect(await token.name()).to.equal("BigView");
    expect(await token.symbol()).to.equal("BVW");
  });

  it("MINTING: Should allow the owner to mint new tokens", async function () {
    const { token, owner, alice } = await deployTokenFixture();
    const mintAmount = ethers.parseUnits("100", 6); // 100 tokens with 6 decimals

    // Mint tokens to Alice
    await token.connect(owner).mint(alice.address, mintAmount);

    expect(await token.balanceOf(alice.address)).to.equal(mintAmount);
  });

  it("SECURITY: Should block non-owners from minting", async function () {
    const { token, alice, bob } = await deployTokenFixture();
    const mintAmount = ethers.parseUnits("100", 6);

    // Alice tries to mint to Bob (should fail)
    // In Solidity/OpenZeppelin, this throws an 'OwnableUnauthorizedAccount' error
    await expect(
      token.connect(alice).mint(bob.address, mintAmount)
    ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
  });

  it("TRANSFER: Should allow Alice to transfer to Bob", async function () {
    const { token, owner, alice, bob } = await deployTokenFixture();
    const amount = ethers.parseUnits("50", 6);

    // Give Alice some tokens first
    await token.connect(owner).mint(alice.address, amount);

    // Alice transfers to Bob
    await token.connect(alice).transfer(bob.address, amount);

    expect(await token.balanceOf(bob.address)).to.equal(amount);
    expect(await token.balanceOf(alice.address)).to.equal(0);
  });
});