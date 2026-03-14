'use client';

import React, { useState } from 'react';
import { useConnect } from '@stacks/connect-react'; 
import { AppConfig, UserSession } from "@stacks/auth"; // Corrected import
import { 
  uintCV, 
  PostConditionMode, 
  Pc 
} from '@stacks/transactions';
import { openContractCall } from '@stacks/connect'; // Use openContractCall for cleaner async handling
import { STACKS_TESTNET } from '@stacks/network';

// 1. Initialize the Session outside the component
const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export default function StakePage() {
  const [amount, setAmount] = useState('');
  
  // 2. Added missing state variables for messages
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<'success' | 'error' | 'info' | null>(null);

  const notify = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage(text);
    setStatus(type);
    setTimeout(() => {
      setMessage(null);
      setStatus(null);
    }, 4000);
  };

  const handleStake = async () => {
    // 3. Check if user is even signed in before doing logic
    if (!userSession.isUserSignedIn()) {
      return authenticate();
    }

    if (!amount || isNaN(Number(amount))) {
      return notify("Enter a valid amount", "error");
    }

    try {
      // 1. Convert to microStacks (1 STX = 1,000,000 microStacks)
    const microStacks = BigInt(Math.floor(Number(amount) * 1000000));
      const userData = userSession.loadUserData();
      const userAddress = userData.profile.stxAddress.testnet; 

if (!userAddress) {
  return notify("Could not find your Stacks address. Try reconnecting.", "error");
}
      // 4. Create the Post-Condition (Security Guard)
const postCondition = Pc.principal(userAddress).willSendEq(microStacks).ustx();

     // 4. Execute the Contract Call
    await openContractCall({
      // Use your .env variables here!
      network: process.env.NEXT_PUBLIC_NETWORK,
      contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!, 
      contractName: process.env.NEXT_PUBLIC_CONTRACT_NAME!,
      functionName: 'stake-and-delegate',
      functionArgs: [uintCV(microStacks), principalCV(poxContractPrincipal)],
        
        postConditionMode: PostConditionMode.Deny, 
        postConditions: [postCondition],

        onFinish: (data) => {
          console.log("TX Data:", data);
          notify("Transaction submitted! Check your wallet.", "success");
        },
        onCancel: () => {
          notify("Transaction cancelled", "info");
        },
      });
    } catch (error) {
      console.error(error);
      notify("Something went wrong with the contract call", "error");
    }
  };

  return (
    <main className="min-h-screen p-8 bg-slate-50">
      {message && (
        <div className={`max-w-md mx-auto mb-4 p-4 rounded-xl border transition-all ${
          status === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 
          status === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 
          'bg-blue-50 border-blue-200 text-blue-700'
        }`}>
          {message}
        </div>
      )}
      <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Stake STX</h2>
        <div className="space-y-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount in STX"
            className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          <button 
            onClick={handleStake}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100"
          >
            Confirm Stake
          </button>
        </div>
      </div>
    </main>
  );
}