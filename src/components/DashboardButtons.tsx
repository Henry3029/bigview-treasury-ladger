"use client";

import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Loader2, Wallet, ArrowRight, ExternalLink, CheckCircle } from 'lucide-react';
import { abi as treasuryAbi } from '@/constants/abis/BigViewTreasury.json';

export default function DashboardButtons() {
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<'success' | 'error' | 'info' | null>(null);

  // 1. Privy & Wagmi Hooks
  const { login, authenticated, ready } = usePrivy();
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  // 2. Watch for the transaction to complete
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const getExplorerUrl = (txHash: string) => `https://sepolia.basescan.org/tx/${txHash}`;

  const notify = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage(text);
    setStatus(type);
    setTimeout(() => {
      setMessage(null);
      setStatus(null);
    }, 4000);
  };

  // 3. Handle the Solidity Contract Call
  const handleClaim = async () => {
    if (!ready) return;

    if (!authenticated) {
      notify("Please connect your wallet first!", "info");
      login();
      return;
    }

    // Using the environment variable instead of hardcoded string
    const treasuryAddress = process.env.NEXT_PUBLIC_TREASURY_ADDRESS;

    if (!treasuryAddress) {
      return notify("Treasury address not configured", "error");
    }

    try {
      writeContract({
        address: treasuryAddress as `0x${string}`,
        abi: treasuryAbi,
        // Updated to match your Solidity function: claimGovernanceRewards
        functionName: 'claimGovernanceRewards', 
        args: [], 
      });
    } catch (err) {
      console.error("Contract call failed:", err);
      notify("Request failed", "error");
    }
  };

  // 4. Listen for Success or Errors
  useEffect(() => {
    if (isConfirmed) notify('Rewards Claimed Successfully!', 'success');
    if (error) {
      const errorMsg = error.message?.includes("NothingToClaim") 
        ? "You have no rewards to claim yet."
        : 'Transaction failed.';
      notify(errorMsg, 'error');
    }
  }, [isConfirmed, error]);

  const isLoading = isPending || isConfirming;

  return (
    <div className="flex flex-col gap-6 p-4">
      
      {/* Notifications Area */}
      {message && (
        <div className={`p-4 rounded-2xl flex items-center justify-between border animate-in fade-in slide-in-from-top-2 ${
          status === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 
          status === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 
          'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <div className="flex items-center gap-3">
            {status === 'success' ? <CheckCircle size={18} /> : <div className="w-2 h-2 rounded-full bg-current animate-pulse" />}
            <span className="text-sm font-medium">{message}</span>
          </div>
          {status === 'success' && hash && (
            <a href={getExplorerUrl(hash)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-bold underline">
              Track <ExternalLink size={14} />
            </a>
          )}
        </div>
      )}

      {/* CORE ACTIONS SECTION */}
      <section>
        <h3 className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black mb-4 ml-1">Treasury Actions</h3>
        
        <div className="flex flex-col gap-4">
          {/* Stake Button */}
          <button 
            disabled={isLoading}
            onClick={() => window.location.href = '/stake'} 
            className="btn-grain flex flex-col items-center justify-center disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <Wallet size={20} />
              </div>
              <span className="font-bold text-lg">Stake Assets</span>
            </div>
            <ArrowRight size={20} />
          </button>

          {/* Updated Claim Button */}
          <button 
            disabled={isLoading || !ready}
            onClick={handleClaim}
            className="w-full bg-white border border-gray-100 p-5 rounded-3xl flex items-center justify-between hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50"
          >
            <span className="font-bold text-gray-700 uppercase tracking-tight">
              {isLoading ? 'Processing...' : 'Claim BVW Rewards'}
            </span>
            {isLoading ? <Loader2 className="animate-spin text-blue-600" size={20} /> : <div className="w-2 h-2 rounded-full bg-blue-600" />}
          </button>
        </div>
      </section>
    </div>
  );
}