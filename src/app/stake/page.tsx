'use client';

import React, { useState, useEffect } from 'react';
import { openContractCall, UserSession, AppConfig } from '@stacks/connect';
import { 
  uintCV, 
  principalCV,
  PostConditionMode, 
  Pc 
} from '@stacks/transactions';
import { STACKS_TESTNET } from '@stacks/network';

// 1. INITIALIZE NATIVE STACKS SESSION
const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export default function StakePage() {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<'success' | 'error' | 'info' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const notify = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage(text);
    setStatus(type);
    setTimeout(() => {
      setMessage(null);
      setStatus(null);
    }, 4000);
  };

  const handleStake = async () => {
    // 2. NATIVE AUTH CHECK
    if (!userSession.isUserSignedIn()) {
      return notify("Please connect your wallet first", "info");
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return notify("Enter a valid amount", "error");
    }

    const userData = userSession.loadUserData();
    const userAddress = userData.profile.stxAddress.testnet;

    setIsLoading(true);

    try {
      const microStacks = BigInt(Math.floor(Number(amount) * 1000000));
      
      // Standard PoX-4 Contract for Testnet
      const poxContract = 'ST000000000000000000002AMW42H.pox-4';
      
      // Create Post Condition: "I will send exactly X microstacks"
      const postCondition = Pc.principal(userAddress).willSendEq(microStacks).ustx();
      
      await openContractCall({
        userSession, // 3. The magic happens here: Connect handles the wallet popup
        network: STACKS_TESTNET,
        contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!, 
        contractName: process.env.NEXT_PUBLIC_CONTRACT_NAME!,
        functionName: 'stake-and-delegate',
        functionArgs: [
          uintCV(microStacks), 
          principalCV(poxContract)
        ],
        postConditionMode: PostConditionMode.Deny, 
        postConditions: [postCondition],
        appDetails: {
          name: 'Bigview Treasury',
          icon: window.location.origin + '/logo.png',
        },
        onFinish: (data) => {
          setIsLoading(false);
          notify("Stake submitted! TxID: " + data.txId.slice(0, 8), "success");
          setAmount('');
        },
        onCancel: () => {
          setIsLoading(false);
          notify("Transaction cancelled", "info");
        },
      });
    } catch (error) {
      console.error(error);
      notify("Staking failed. Check console.", "error");
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen p-8 bg-slate-50">
      {message && (
        <div className={`max-w-md mx-auto mb-4 p-4 rounded-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 shadow-sm ${
          status === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 
          status === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 
          'bg-blue-50 border-blue-200 text-blue-700'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            status === 'success' ? 'bg-green-500' : status === 'error' ? 'bg-red-500' : 'bg-blue-500'
          }`} />
          <span className="text-sm font-medium">{message}</span>
        </div>
      )}

      <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-slate-900 mb-2 italic tracking-tight">Stake STX</h2>
          <p className="text-sm text-gray-500">Lock your STX to earn rewards and support the Bigview treasury.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Amount to Lock</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full p-5 bg-gray-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-xl"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-gray-300">STX</span>
            </div>
          </div>

          <button 
            onClick={handleStake}
            disabled={isLoading}
            className={`w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-lg transition-all disabled:opacity-50 ${
              isLoading ? 'cursor-not-allowed' : 'hover:bg-blue-700 active:scale-95'
            }`}
          >
            {isLoading ? 'Processing...' : 'Confirm Stake'}
          </button>

          <p className="text-[10px] text-center text-gray-400 px-4">
            Staking locks your funds for the duration of the cycle. Ensure you have extra STX for gas fees.
          </p>
        </div>
      </div>
    </main>
  );
}