import { Cl } from "@stacks/transactions";
import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const alice = accounts.get("wallet_1")!;
const bob = accounts.get("wallet_2")!;

// 1. Mock Principals (matching your contract traits)
const sbtcToken = Cl.contractPrincipal(deployer, "sbtc-token");
const poxContract = Cl.contractPrincipal("SP000000000000000000002Q6VF78", "pox-4");

describe("BigView Treasury Production Suite", () => {
  
  it("STAKING: Should allow Alice to stake and update global stats", () => {
    const stakeAmount = 1000000n; // 1 STX

    const { result } = simnet.callPublicFn(
      "bigview-treasury-v8",
      "stake-and-delegate",
      [Cl.uint(stakeAmount), poxContract],
      alice
    );

    // Verify Success
    expect(result).toBeOk(Cl.bool(true));

    // Verify Read-Only Data matches
    const summary = simnet.callReadOnlyFn(
      "bigview-treasury-v8",
      "dashboard-summary",
      [],
      deployer
    );
    expect(summary.result).toBeTuple({
      "total-members": Cl.uint(1),
      "total-stakes": Cl.uint(stakeAmount)
    });
  });

  it("REWARDS: Should calculate 5% dev-fee and 95% user reward correctly", () => {
    // PRE-CONDITION: Alice stakes 100 STX
    const aliceStake = 100000000n; 
    simnet.callPublicFn("bigview-treasury-v7", "stake-and-delegate", [Cl.uint(aliceStake), poxContract], alice);

    // SIMULATION: Pretend the Treasury contract just received 10,000 sBTC as rewards
    // We "mint" or give the contract balance in the simnet
    const totalRewardPool = 10000n; 
    
    // CALL: Alice tries to claim
    const { result } = simnet.callPublicFn(
      "bigview-treasury-v8",
      "claim-rewards",
      [sbtcToken],
      alice
    );

    // MATH CHECK: 
    // Total: 10,000 | Dev Fee (5%): 500 | Alice (95%): 9,500
    expect(result).toBeOk(Cl.tuple({
      fee: Cl.uint(500),
      reward: Cl.uint(9500)
    }));
  });

  it("SECURITY: Should block non-admin from setting the major pool", () => {
    const { result } = simnet.callPublicFn(
      "bigview-treasury-v8",
      "set-major-pool",
      [Cl.standardPrincipal(bob.address), Cl.standardPrincipal("SP000...2AMW42H")],
      alice // Alice is NOT the dev-wallet
    );

    // Should return ERR-FORBIDDEN (u403)
    expect(result).toBeErr(Cl.uint(403));
  });

});