import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;

describe("BigView Token (BVW) Suite", function () {
  async function deployTokenFixture() {
    const [owner, alice, bob] = await ethers.getSigners();
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
    const mintAmount = ethers.parseUnits("100", 18); // Check if your .sol uses 18 or 6!
    await token.mint(alice.address, mintAmount);
    expect(await token.balanceOf(alice.address)).to.equal(mintAmount);
  });
});