"use client";
import React from 'react';
import { useConnect } from '@stacks/connect-react';
import { STACKS_TESTNET } from '@stacks/network';
import { AnchorMode, PostConditionMode } from '@stacks/transactions';
import { useState } from 'react';

export const ClaimButton = () => {
  const { doContractCall } = useConnect();
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<'success' | 'error' | 'info' | null>(null);

const notify = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage(text);
      setStatus(type);

        // Automatically hide the message after 4 seconds
          setTimeout(() => {
              setMessage(null);
                  setStatus(null);
                    }, 4000);
                    };

  const handleClaim = async () => {
    await doContractCall({
      network: STACKS_TESTNET,
      anchorMode: AnchorMode.Any,
      contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '',
      contractName: process.env.NEXT_PUBLIC_CONTRACT_NAME || '',
      functionName: 'claim-rewards', // Must match your .clar file!
      functionArgs: [], // Rewards usually don't need arguments
      postConditionMode: PostConditionMode.Allow,
      onFinish: (data) => {
        console.log('Transaction sent:', data.txId);
        notify('Claim Request Sent! Check your wallet history', 'success');
  
  // Optional: Hide the message automatically after 5 seconds
  setTimeout(() => setMessage(null), 5000);
      },
      onCancel: () => {
        console.log('User cancelled the claim.');
        notify('Claim cancelled.');
  setTimeout(() => setMessage(null), 3000);
      },
    });
  };

  return (
    <>
  {message && (
  <div className="mx-4 mb-4 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
    <span className="text-sm font-medium">{message}</span>
  </div>
)}
    <button 
      onClick={handleClaim}
      className="w-full bg-white text-green-700 py-3 rounded-full font-bold shadow-md hover:bg-gray-100 active:scale-95 transition-all"
    >
      Claim Now
    </button>
  </>
  );
  };