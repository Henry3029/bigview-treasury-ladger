'use client';

import React, { useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import { 
  uintCV, 
  PostConditionMode, 
  FungibleConditionCode,
  makeStandardStxPostCondition
} from '@stacks/transactions';
import { STACKS_TESTNET } from '@stacks/network';

export default function StakePage() {
  const { doContractCall } = useConnect();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<'success' | 'error' | 'info' | null>(null);
  const notify = (text: string, type: 'success' | 'error' | 'info') => {
  setMessage(text);
  setStatus(type);
  
  // This removes the message after 4 seconds
  setTimeout(() => {
    setMessage(null);
    setStatus(null);
  }, 4000);
};

  const handleStake = async () => {
    if (!amount || isNaN(Number(amount))) return notify("Enter a valid amount", "error");

    // Convert STX to micro-STX (multiply by 1,000,000)
    const microStacks = Number(amount) * 1000000;

    await doContractCall({
      network: STACKS_TESTNET,
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'bigview-treasury',
      functionName: 'stake-and-delegate', // <--- MAKE SURE THIS MATCHES YOUR CLARITY FUNCTION
      functionArgs: [uintCV(microStacks)],
      postConditionMode: PostConditionMode.Allow, 
      onFinish: (data) => {
        console.log("Transaction sent!", data);
        notify("Transaction submitted to the blockchain!", "success");
      },
      onCancel: () => {
        console.log("User cancelled");
        notify("you cancelled the transaction" "info");
      },
    });
  };

  return (
    <main className="min-h-screen p-8 bg-slate-50">
    {/* 3. This is how you "put it in the return block" */}
      {message && (
        <p className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">
          {message}
        </p>
      )}
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