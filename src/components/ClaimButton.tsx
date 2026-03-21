"use client";

import React, { useState } from 'react';
import { openContractCall, UserSession, AppConfig } from '@stacks/connect';
import { STACKS_TESTNET } from '@stacks/network';
import { AnchorMode } from '@stacks/transactions';
import { 
  uintCV, 
  principalCV,
  contractPrincipalCV,
  PostConditionMode, 
  Pc 
} from '@stacks/transactions';

// 1. INITIALIZE NATIVE STACKS SESSION
const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export const ClaimButton = () => {
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
    // 2. STACKS AUTH CHECK
    if (!userSession.isUserSignedIn()) {
      return notify("Please connect your Stacks wallet!", "info");
    }

    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    const contractName = process.env.NEXT_PUBLIC_CONTRACT_NAME;
    const sbtcAddress = process.env.NEXT_PUBLIC_SBTC_ADDRESS || 'ST1HTBVD3S9CXY9G368MGP5W7PLWSABKH6GZMZEZ';
  const sbtcName = process.env.NEXT_PUBLIC_SBTC_NAME || 'sbtc-token';

    if (!contractAddress || !contractName) {
      notify("Configuration Error", "error");
      return;
    }

    setIsLoading(true);

    try {
      // 3. NATIVE CONTRACT CALL
      await openContractCall({
        userSession, // Use the direct userSession we initialized above
        network: STACKS_TESTNET,
        anchorMode: AnchorMode.Any,
        contractAddress: contractAddress,
        contractName: contractName,
        functionName: 'claim-rewards', 
        functionArgs: [ contractPrincipalCV(sbtcAddress, sbtcName) ],
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