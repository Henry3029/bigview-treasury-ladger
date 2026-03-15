"use client";
import React, { useState } from 'react';
// We use openContractCall directly from @stacks/connect
import { openContractCall } from '@stacks/connect';
import { STACKS_TESTNET } from '@stacks/network';
import { AnchorMode, PostConditionMode } from '@stacks/transactions';

export const ClaimButton = () => {
  // REMOVED: const { doContractCall } = useConnect(); <--- This was the crasher!
  
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<'success' | 'error' | 'info' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const notify = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage(text);
    setStatus(type);
    setTimeout(() => {
      setMessage(null);
      setStatus(null);
    }, 4000);
  };

  const handleClaim = async () => {
    // 1. Fetching Real Values from .env
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    const contractName = process.env.NEXT_PUBLIC_CONTRACT_NAME;

    // Safety check: Ensure the real values exist before trying to call
    if (!contractAddress || !contractName) {
      notify("Configuration Error: Contract details missing.", "error");
      console.error("Check your .env file for NEXT_PUBLIC_CONTRACT_ADDRESS and NAME");
      return;
    }

    setIsLoading(true);

    try {
      await openContractCall({
        network: STACKS_TESTNET,
        anchorMode: AnchorMode.Any,
        contractAddress: contractAddress,
        contractName: contractName,
        functionName: 'claim-rewards', 
        functionArgs: [], 
        postConditionMode: PostConditionMode.Allow,
        
        // App details are required when using the direct function
        appDetails: {
          name: 'Bigview Treasury',
          icon: window.location.origin + '/images/bigview-image.png',
        },

        onFinish: (data) => {
          setIsLoading(false);
          console.log('Transaction sent:', data.txId);
          notify('Claim Request Sent! Check your wallet history', 'success');
        },
        onCancel: () => {
          setIsLoading(false);
          notify('Claim cancelled.', 'error'); 
        },
      });
    } catch (error) {
      setIsLoading(false);
      console.error("Contract call failed:", error);
      notify("Failed to open wallet popup.", "error");
    }
  };

  return (
    <>
      {message && (
        <div className={`mx-4 mb-4 p-4 border rounded-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ${
          status === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 
          status === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 
          'bg-blue-50 border-blue-200 text-blue-700'
        }`}>
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            status === 'success' ? 'bg-green-500' : 
            status === 'error' ? 'bg-red-500' : 
            'bg-blue-500'
          }`}></div>
          <span className="text-sm font-medium">{message}</span>
        </div>
      )}
      
      <button 
        onClick={handleClaim}
        disabled={isLoading}
        className={`btn-grain py-2 px-6 transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
      >
        {isLoading ? 'Connecting...' : 'Claim Now'}
      </button>
    </>
  );
};