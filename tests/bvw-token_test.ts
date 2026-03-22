import { expect, it, describe } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!; // This is the CONTRACT-OWNER
const wallet_1 = accounts.get("wallet_1")!;
const wallet_2 = accounts.get("wallet_2")!;

describe("BigView Token (BVW) Production Tests", () => {

  it("should return correct metadata and decimals", () => {
    const decimals = simnet.callReadOnlyFn("bigview-token", "get-decimals", [], deployer);
    const uri = simnet.callReadOnlyFn("bigview-token", "get-token-uri", [], deployer);

    expect(decimals.result).toBeOk(Cl.uint(6));
    expect(uri.result).toBeOk(Cl.some(Cl.stringUtf8("ipfs://Qme7ss3ARVgxv6rXqVPiURzNFo5S/bigview.json")));
  });

  it("should allow the OWNER to mint tokens", () => {
    const mintCall = simnet.callPublicFn(
      "bigview-token",
      "mint",
      [Cl.uint(1000000), Cl.principal(wallet_1)],
      deployer 
    );
    expect(mintCall.result).toBeOk(Cl.bool(true));
  });

  it("should REJECT minting if called by a non-owner", () => {
    const fakeMint = simnet.callPublicFn(
      "bigview-token",
      "mint",
      [Cl.uint(1000000), Cl.principal(wallet_2)],
      wallet_1 // wallet_1 is NOT the deployer
    );
    expect(fakeMint.result).toBeErr(Cl.uint(401)); // Matches your ERR-NOT-AUTHORIZED
  });

  it("should successfully TRANSFER tokens between users", () => {
    // 1. Give wallet_1 some tokens first
    simnet.callPublicFn("bigview-token", "mint", [Cl.uint(1000), Cl.principal(wallet_1)], deployer);

    // 2. Wallet_1 sends 500 to Wallet_2
    const transferCall = simnet.callPublicFn(
      "bigview-token",
      "transfer",
      [Cl.uint(500), Cl.principal(wallet_1), Cl.principal(wallet_2), Cl.none()],
      wallet_1
    );

    expect(transferCall.result).toBeOk(Cl.bool(true));
  });
});