"use client";

import React, { useState, useEffect } from "react";
// 1. Import necessary types
import { StacksTestnet } from "@stacks/network";
import { fetchCallReadOnlyFunction, Cl } from "@stacks/transactions";
// Import userSession from where you defined it (e.g., config.ts or auth.ts)
import { userSession } from "@/components/privyProvider"; 

// --- CONFIGURATION ---
const CONTRACT_ADDRESS = "ST414MTX2NQ4MVMRE2J9CQATKDEWVXT3DA96XHHA";
const CONTRACT_NAME = "bigview-treasury";
const network = new StacksTestnet();

export default function Dashboard() {
  const [stake, setStake] = useState<number>(0);
  const [reward, setReward] = useState<number>(0);
  const [message, setMessage] = useState<string>("Ready");

  // 2. Define data fetching function
  const fetchMySummary = async () => {
    if (!userSession.isUserSignedIn()) return;
    
    const userData = userSession.loadUserData();
    const userAddress = userData.profile.stxAddress.testnet;

    setMessage("Fetching real contract data...");

    try {
      // 3. Call the read-only function
      const result = await fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: "dashboard-summary",
        functionArgs: [], // Add arguments here if needed
        network,
        senderAddress: userAddress,
      });

      console.log("REAL CONTRACT DATA:", result);
      setMessage("Data Loaded from Testnet");
      
      // 4. Parse result (Example: assuming result is a Tuple)
      // if (result.type === 'tuple') {
      //    setStake(Number(result.data['total-staked'].value));
      //    setReward(Number(result.data['total-rewards'].value));
      // }
      
    } catch (e) {
      console.error("Contract Fetch Error:", e);
      setMessage("Error fetching from contract.");
    }
  };

  // 5. Fetch data on component mount
  useEffect(() => {
    fetchMySummary();
  }, []);
  

const handleStake = async (amount: number, setMessage: (msg: string) => void, successMsg: string) => {
    // 1. Check if the user is signed in
    if (!userSession.isUserSignedIn()) {
        alert("Please connect your wallet first.");
        return;
    }

    // 2. Prepare transaction options with types
    // Example: Staking a uint amount
    const functionArgs: ClarityValue[] = [uintCV(amount)];

    const options = {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: FUNCTION_NAME,
        functionArgs: functionArgs,
        network: new StacksTestnet(), // Switch to StacksMainnet() for production
        appDetails: {
            name: "BigView Treasury",
            icon: window.location.origin + "/logo.png",
        },
        onFinish: (data: { txId: string }) => {
            console.log("Transaction ID:", data.txId);
            setMessage(`${successMsg}! TX: ${data.txId.substring(0, 10)}...`);
            // Optional: window.location.reload();
        },
        onCancel: () => {
            setMessage("Transaction cancelled.");
        },
    };

    // 3. Trigger wallet
    const windowWithStacks = window as WindowWithStacks;
    try {
        if (windowWithStacks.StacksProvider || windowWithStacks.LeatherProvider) {
            await openContractCall(options);
        } else {
            setMessage("Wallet not found. Use a Stacks-compatible browser.");
        }
    } catch (error) {
        console.error("Transaction error:", error);
        setMessage("Transaction failed.");
    }
};

  return (
    <div>
      <h1>Treasury Dashboard</h1>
      <p>Status: {message}</p>
      <p>Staked: {stake} STX</p>
      <p>Rewards: {reward} BTC</p>
    </div>
  );
}

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      