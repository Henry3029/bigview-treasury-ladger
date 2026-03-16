"use client";
import React, { useState } from 'react';
import { openContractCall } from '@stacks/connect';
import { STACKS_TESTNET } from '@stacks/network';
import { AnchorMode, PostConditionMode } from '@stacks/transactions';
// 1. IMPORT PRIVY HOOKS
import { usePrivy, useWallets } from '@privy-io/react-auth';

export const ClaimButton = () => {
  // 2. INITIALIZE PRIVY
  const { authenticated, login } = usePrivy();
  const { wallets } = useWallets();
  
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
    // 3. AUTH CHECK
    if (!authenticated) {
      return login();
    }

    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    const contractName = process.env.NEXT_PUBLIC_CONTRACT_NAME;

    if (!contractAddress || !contractName) {
      notify("Configuration Error", "error");
      return;
    }

    setIsLoading(true);

    try {
      // 4. FIND THE PRIVY WALLET & GET SESSION
      const embeddedWallet = wallets.find((w) => w.walletClientType === 'privy');
      
      // This is the magic line that kills the "Origin" error:
      const userSession = embeddedWallet ? await (embeddedWallet as any).getCoreSession?.() : undefined;

      await openContractCall({
        userSession, // <--- PASS THE SESSION HERE
        network: STACKS_TESTNET,
        anchorMode: AnchorMode.Any,
        contractAddress: contractAddress,
        contractName: contractName,
        functionName: 'claim-rewards', 
        functionArgs: [], 
        postConditionMode: PostConditionMode.Allow,
        
        appDetails: {
          name: 'Bigview Treasury',
          icon: window.location.origin + '/images/bigview-image.png',
        },

        onFinish: (data) => {
          setIsLoading(false);
          notify('Claim Request Sent!', 'success');
        },
        onCancel: () => {
          setIsLoading(false);
          notify('Claim cancelled.', 'info'); 
        },
      });
    } catch (error) {
      setIsLoading(false);
      console.error("Contract call failed:", error);
      notify("Transaction failed.", "error");
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