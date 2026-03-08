"use client";
import React, { useState } from 'react'; // Added useState to React import
import { useConnect } from '@stacks/connect-react';
import { STACKS_TESTNET } from '@stacks/network';
import { AnchorMode, PostConditionMode } from '@stacks/transactions';

export const ClaimButton = () => {
  const { doContractCall } = useConnect();
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

  const handleClaim = async () => {
    // Hardcoding these for now to ensure the "white page" doesn't return
    const contractAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
    const contractName = 'bigview-treasury';

    await doContractCall({
      network: STACKS_TESTNET,
      anchorMode: AnchorMode.Any,
      contractAddress: contractAddress,
      contractName: contractName,
      functionName: 'claim-rewards', 
      functionArgs: [], 
      postConditionMode: PostConditionMode.Allow,
      onFinish: (data) => {
        console.log('Transaction sent:', data.txId);
        notify('Claim Request Sent! Check your wallet history', 'success');
      },
      onCancel: () => {
        notify('Claim cancelled.', 'error'); 
      },
    });
  }; // <--- FIXED: Added missing closing bracket for handleClaim

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
        className="btn-grain py-2 px-6"
      >
        Claim Now
      </button>
    </>
  );
};