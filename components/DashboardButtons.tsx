"use client";
import React from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { openContractCall } from '@stacks/connect';
import { 
  uintCV, 
  boolCV, 
  stringAsciiCV, 
  PostConditionMode 
} from '@stacks/transactions';
import { StacksTestnet } from '@stacks/network';

export default function DashboardButtons() {
  const { authenticated } = usePrivy();
  const { wallets } = useWallets();

  const handleContractCall = async (functionName: string, args: any[]) => {
    if (!authenticated) return alert("Please login via email first!");

    // 1. Find the Privy Embedded Wallet
    const embeddedWallet = wallets.find((w) => w.walletClientType === 'privy');
    if (!embeddedWallet) return alert("No embedded wallet found.");

    // 2. Define the Stacks Transaction
    const network = new StacksTestnet(); 
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
    const contractName = process.env.NEXT_PUBLIC_CONTRACT_NAME!;

    const options = {
      contractAddress,
      contractName,
      functionName,
      functionArgs: args,
      network,
      postConditionMode: PostConditionMode.Allow,
      onFinish: (data: any) => {
        console.log("TX Success:", data.txId);
        alert(`Transaction Sent! ID: ${data.txId}`);
      },
      onCancel: () => console.log("User dismissed the prompt"),
    };

    // 3. Trigger the call
    // Stacks.js automatically detects the provider when using Privy
    await openContractCall(options);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Button to Vote Yes on Proposal #1 */}
      <button 
        onClick={() => handleContractCall('vote', [uintCV(1), boolCV(true)])}
        className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
      >
        Vote Yes (#1)
      </button>
      
      {/* Button to Vote No on Proposal #1 */}
      <button 
        onClick={() => handleContractCall('vote', [uintCV(1), boolCV(false)])}
        className="bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition"
      >
        Vote No (#1)
      </button>

      {/* Button to Register a Wallet */}
      <button 
        onClick={() => handleContractCall('register-wallet', [
          /* principalCV(userAddress), principalCV(walletAddress) */
        ])}
        className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
      >
        Register Wallet
      </button>

      {/* Button to Add Member */}
      <button 
        onClick={() => handleContractCall('add-member', [/* principalCV(userAddress) */])}
        className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition"
      >
        Become Member
      </button>
    </div>
    );
}