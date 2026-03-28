"use client";

import React, { useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { abi as treasuryAbi } from '@/constants/abis/BigViewTreasury.json';

export const ClaimButton = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<'success' | 'error' | 'info' | null>(null);

  // 1. Privy Hooks for onboarding
  const { login, ready, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const wallet = wallets[0]; // Gets the active wallet (Embedded or External)

  // 2. Wagmi Hooks for the transaction
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const notify = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage(text);
    setStatus(type);
    setTimeout(() => {
      setMessage(null);
      setStatus(null);
    }, 4000);
  };

  const handleClaim = async () => {
    // 3. ENHANCED VALIDATION
    if (!ready) return; // Wait for Privy to load

    if (!authenticated) {
      notify("Redirecting to login...", "info");
      login(); // This triggers Privy's "Social + Wallet" modal
      return;
    }

    if (!wallet) {
      return notify("No wallet connected!", "error");
    }

    // Ensure we are on Base Sepolia (Chain ID 84532)
    if (wallet.chainId !== 'eip155:84532') {
      await wallet.switchChain(84532);
    }

    const treasuryAddress = "0xD9f4Ef73dd57c40c5e5FE0e2bbd9Ba4535645f44";

    try {
      writeContract({
        address: treasuryAddress as `0x${string}`,
        abi: treasuryAbi,
        functionName: 'claimRewards',
        args: [], 
      });
    } catch (err) {
      console.error("Contract call failed:", err);
      notify("Transaction failed.", "error");
    }
  };

  // Keep your existing validation/UI feedback logic
  React.useEffect(() => {
    if (isConfirmed) notify('Claim Successful!', 'success');
    if (error) notify(error.message || 'Transaction failed.', 'error');
  }, [isConfirmed, error]);

  const isLoading = isPending || isConfirming;

  return (
    <>
      {/* Your existing notification UI remains exactly the same */}
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
        disabled={isLoading || !ready}
        className={`btn-grain py-2 px-6 transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
      >
        {isLoading ? 'Processing...' : !authenticated ? 'Connect to Claim' : 'Claim Now'}
      </button>
    </>
  );
};