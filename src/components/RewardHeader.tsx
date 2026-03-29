"use client";

import React, { useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Loader2, CheckCircle2 } from 'lucide-react';
// Import your Treasury ABI
import { abi as treasuryAbi } from '@/constants/abis/BigViewTreasury.json';

export const RewardHeader = ({ totalEarned, pending }: { totalEarned: string, pending: string }) => {
  const contractAddress = process.env.NEXT_PUBLIC_TREASURY_CONTRACT_ADDRESS as `0x${string}`;

  // 1. Setup the Claim Contract Action
  const { data: hash, writeContract, isPending } = useWriteContract();
  
  // 2. Wait for the transaction to confirm
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const handleClaim = () => {
    writeContract({
      address: contractAddress,
      abi: treasuryAbi,
      functionName: 'claimGovernanceRewards', // Matches your ABI exactly
    });
  };

  useEffect(() => {
    if (isConfirmed) {
      alert("Rewards Claimed Successfully! Check your wallet.");
    }
  }, [isConfirmed]);

  const isProcessing = isPending || isConfirming;

  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-xl mb-6 border border-white/10 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      
      <div className="flex flex-col items-center relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Lifetime BVW Earned</p>
        <h1 className="text-5xl font-black text-center my-3 italic tracking-tighter">
          {totalEarned} <span className="text-xl not-italic opacity-50">BVW</span>
        </h1>
      </div>
      
      {/* Pending Section */}
      <div className="mt-8 bg-white/10 backdrop-blur-md rounded-[2rem] p-6 flex justify-between items-center border border-white/5 relative z-10">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">Available to Claim</p>
          <div className="flex items-baseline gap-1">
            <p className="text-2xl font-bold">{pending}</p>
            <p className="text-xs font-bold text-orange-400">BVW</p>
          </div>
        </div>
        
        <div className="w-1/2">
           <button 
             onClick={handleClaim}
             disabled={isProcessing || Number(pending.replace(/,/g, '')) <= 0}
             className="w-full py-3 bg-white text-blue-600 disabled:bg-white/20 disabled:text-white/40 rounded-2xl font-black text-sm shadow-lg hover:bg-gray-100 transition-all active:scale-95 flex items-center justify-center gap-2"
           >
             {isProcessing ? (
               <Loader2 size={16} className="animate-spin" />
             ) : isConfirmed ? (
               <CheckCircle2 size={16} />
             ) : null}
             {isProcessing ? "Claiming..." : isConfirmed ? "Success!" : "Claim Now"}
           </button>
        </div>
      </div>
    </div>
  );
};