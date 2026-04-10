"use client";

import React, { useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { createWalletClient, custom, publicActions } from 'viem';
import { baseSepolia } from 'viem/chains';
import { Loader2, CheckCircle2, Zap } from 'lucide-react';
// Import your Treasury ABI
import treasuryAbi from '@/constants/abis/BigViewTreasuryV2.json';

export const RewardHeader = ({ totalEarned, pending }: { totalEarned: string, pending: string }) => {
  const { authenticated, login } = usePrivy();
  const { wallets } = useWallets();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const contractAddress = process.env.NEXT_PUBLIC_TREASURY_ADDRESS as `0x${string}`;

  const handleClaim = async () => {
    if (!authenticated) return login();
    const wallet = wallets[0];
    if (!wallet) return;

    try {
      setIsProcessing(true);

      // 1. Create a Viem Wallet Client using the Privy provider
      const provider = await wallet.getEthereumProvider();
      const client = createWalletClient({
        account: wallet.address as `0x${string}`,
        chain: baseSepolia,
        transport: custom(provider)
      }).extend(publicActions); // Extends with public actions like 'waitForTransactionReceipt'

      // 2. Write to the Contract
      const hash = await client.writeContract({
        address: contractAddress,
        abi: treasuryAbi,
        functionName: 'claimGovernanceRewards',
        account: wallet.address as `0x${string}`,
      });

      // 3. Wait for the receipt
      await client.waitForTransactionReceipt({ hash });
      
      setIsConfirmed(true);
      setTimeout(() => setIsConfirmed(false), 5000);
    } catch (error) {
      console.error("Claim Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const canClaim = Number(pending.replace(/,/g, '')) > 0;

  return (
  /* 1. Main Container: Ensuring background and text follow Bigview variables */
  <div className="bg-violet-background p-6 rounded-bigview text-white shadow-2xl mb-6 border border-white/5 relative overflow-hidden font-inter">
    
    {/* Background Decorative Glow: Swapped to brand Gold for depth */}
    <div className="absolute -right-4 -top-4 w-32 h-32 bg-gold-buttons/10 rounded-bigview blur-3xl opacity-50" />
    
    <div className="flex flex-col items-center relative z-10">
      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Lifetime BVW Earned</p>
      <h1 className="text-4xl font-black text-center my-2 italic tracking-tighter uppercase leading-none text-white">
        {totalEarned} <span className="text-sm not-italic opacity-30 tracking-widest ml-1">BVW</span>
      </h1>
    </div>
    
    {/* Claim Section: Bigview-ified with Glassmorphism */}
    <div className="mt-6 bg-white/[0.03] backdrop-blur-xl rounded-bigview p-5 flex justify-between items-center border border-white/5 relative z-10">
      <div className="flex-1">
        <p className="text-[8px] font-black uppercase tracking-widest text-white/40 mb-1">Available</p>
        <div className="flex items-baseline gap-1">
          <p className="text-xl font-black tabular-nums italic text-gold-buttons">{pending}</p>
          <p className="text-[10px] font-black text-white/20 uppercase italic">BVW</p>
        </div>
      </div>
      
      <div className="w-1/2">
         <button 
           onClick={handleClaim}
           disabled={isProcessing || !canClaim}
           className="w-full py-3.5 bg-gold-buttons disabled:bg-white/5 disabled:text-white/20 rounded-bigview font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 group"
         >
           {isProcessing ? (
             <Loader2 size={14} className="animate-spin text-text-color" />
           ) : isConfirmed ? (
             <CheckCircle2 size={14} className="text-text-color" />
           ) : (
             <Zap size={14} className={canClaim ? "text-text-color fill-current" : "text-white/20"} />
           )}
           
           <span className="text-text-color">
             {isProcessing ? "Wait..." : isConfirmed ? "Success" : "Claim Now"}
           </span>
         </button>
      </div>
    </div>
  </div>
);
}