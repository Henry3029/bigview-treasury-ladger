'use client';

import React, { useState } from 'react';
import { useConnect, useUserSession } from '@stacks/connect-react'; // Added useUserSession
import { 
  uintCV, 
  PostConditionMode, 
  Pc, 
  FungibleConditionCode 
} from '@stacks/transactions';
import { STACKS_TESTNET } from '@stacks/network';

export default function StakePage() {
  const { doContractCall } = useConnect();
  const { userSession } = useUserSession(); // Get the session
  const [amount, setAmount] = useState('');
  
  // ... (keeping your message/notify logic the same) ...
  const notify = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage(text);
    setStatus(type);
    setTimeout(() => {
      setMessage(null);
      setStatus(null);
    }, 4000);
  };

  const handleStake = async () => {
    if (!amount || isNaN(Number(amount))) return notify("Enter a valid amount", "error");

    const microStacks = Number(amount) * 1000000;
    const userData = userSession.loadUserData();
    const userAddress = userData.profile.stxAddress.testnet; // The "Source" of the STX

    // 1. Create the Security Guard (The Post-Condition)
    const postCondition = Pc.principalSTX(userAddress)
      .willSendEq(microStacks); 
      // This means: "User will send EQUAL to this amount and NO MORE."

    await doContractCall({
      network: STACKS_TESTNET,
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'bigview-treasury',
      functionName: 'stake-and-delegate',
      functionArgs: [uintCV(microStacks)],
      
      // 2. Switch to Deny mode (Strict security)
      postConditionMode: PostConditionMode.Deny, 
      postConditions: [postCondition],

      onFinish: (data) => {
        notify("Transaction submitted! Check your wallet.", "success");
      },
      onCancel: () => {
        notify("Transaction cancelled", "info");
      },
    });
  };

  // ... (rest of your return block stays the same) ...
  return (
    <main className="min-h-screen p-8 bg-slate-50">
      {message && (
        <div className={`max-w-md mx-auto mb-4 p-4 rounded-xl border ${
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