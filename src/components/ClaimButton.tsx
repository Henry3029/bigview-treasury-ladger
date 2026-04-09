"use client";

import React, { useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { encodeFunctionData, createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import treasuryAbi from '@/constants/abis/BigViewTreasury.json';

export const ClaimButton = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<'success' | 'error' | 'info' | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const { login, ready, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const wallet = wallets[0]; 

  const notify = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage(text);
    setStatus(type);
    setTimeout(() => {
      setMessage(null);
      setStatus(null);
    }, 4000);
  };

  const handleClaim = async () => {
    if (!ready) return;

    if (!authenticated) {
      notify("Redirecting to login...", "info");
      login();
      return;
    }

    if (!wallet) {
      return notify("No wallet connected!", "error");
    }

    setIsConfirming(true);

    try {
      // 1. Ensure correct chain
      if (wallet.chainId !== 'eip155:84532') {
        await wallet.switchChain(84532);
      }

      // 2. Encode the function call (Translator)
      const data = encodeFunctionData({
        abi: treasuryAbi,
        functionName: 'claimGovernanceRewards',
        args: [],
      });

      // 3. Send Transaction via Privy
      const treasuryAddress = "0xD9f4Ef73dd57c40c5e5FE0e2bbd9Ba4535645f44";
      const txHash = await wallet.sendTransaction({
        to: treasuryAddress as `0x${string}`,
        data: data,
        // value is 0 by default for claims
      });

      notify("Transaction sent! Waiting for confirmation...", "info");

      // 4. Manual Wait for Receipt (Viem Public Client)
      const publicClient = createPublicClient({
        chain: baseSepolia,
        transport: http(),
      });

      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash as `0x${string}` });

      if (receipt.status === 'success') {
        notify('Claim Successful!', 'success');
      } else {
        notify('Transaction reverted on-chain.', 'error');
      }

    } catch (err: any) {
      console.error("Claim failed:", err);
      const errorMsg = err.message?.includes("User rejected") 
        ? "Transaction rejected." 
        : "Claim failed.";
      notify(errorMsg, "error");
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <>
      {message && (
        /* 1. Status Message: Using Bigview rounding and text-color logic */
        <div className={`mx-4 mb-4 p-4 border rounded-bigview flex items-center gap-2 animate-in fade-in slide-in-from-top-2 shadow-sm ${
          status === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 
          status === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 
          'bg-gold-buttons/10 border-gold-buttons/20 text-gold-buttons'
        }`}>
          {/* Animated Status Dot */}
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            status === 'success' ? 'bg-emerald-500' : 
            status === 'error' ? 'bg-red-500' : 
            'bg-gold-buttons'
          }`}></div>
          
          <span className="text-[10px] font-black uppercase tracking-tight italic">
            {message}
          </span>
        </div>
      )}
      
      {/* 2. Main Action Button: Using bg-gold-buttons and text-text-color */}
      <button 
        onClick={handleClaim}
        disabled={isConfirming || !ready}
        className={`bg-gold-buttons text-text-color py-3 px-8 rounded-bigview transition-all font-black uppercase text-xs italic tracking-widest shadow-xl ${
          isConfirming ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
        }`}
      >
        {isConfirming ? 'Processing...' : !authenticated ? 'Connect to Claim' : 'Claim Now'}
      </button>
    </>
  );
};