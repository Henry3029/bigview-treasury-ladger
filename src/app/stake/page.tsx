'use client';

import React, { useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import { 
  uintCV, 
  PostConditionMode, 
  FungibleConditionCode,
  createAssetInfo,
  makeStandardSTXPostCondition
} from '@stacks/transactions';
import { StacksTestnet } from '@stacks/network';

export default function StakePage() {
  const { doContractCall } = useConnect();
  const [amount, setAmount] = useState('');

  const handleStake = async () => {
    if (!amount || isNaN(Number(amount))) return alert("Enter a valid amount");

    // Convert STX to micro-STX (multiply by 1,000,000)
    const microStacks = Number(amount) * 1000000;

    await doContractCall({
      network: new StacksTestnet(),
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'bigview-treasury',
      functionName: 'stake-tokens', // <--- MAKE SURE THIS MATCHES YOUR CLARITY FUNCTION
      functionArgs: [uintCV(microStacks)],
      postConditionMode: PostConditionMode.Allow, 
      onFinish: (data) => {
        console.log("Transaction sent!", data);
        alert("Transaction submitted to the blockchain!");
      },
      onCancel: () => {
        console.log("User cancelled");
      },
    });
  };

  return (
    <main className="min-h-screen p-8 bg-slate-50">
      <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-2xl shadow-lg border border-gold-100">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Stake your STX</h2>
        
        <div className="space-y-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount in STX"
            className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
          />

          <button 
            onClick={handleStake}
            className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition-all active:scale-95"
          >
            Confirm Stake
          </button>
        </div>
      </div>
    </main>
  );
}