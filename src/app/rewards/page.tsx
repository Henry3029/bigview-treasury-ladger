'use client';

import React, { useEffect, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { RefreshCcw, Loader2, ChevronRight, Gift, Zap, Ticket, TrendingUp } from 'lucide-react';

// Import your Treasury ABI
import { abi as treasuryAbi } from '@/constants/abis/BigViewTreasury.json';

export default function RewardsPage() {
  const { address, isConnected } = useAccount();
  const [pending, setPending] = useState("0.00");
  const [liveStaked, setLiveStaked] = useState("0.00");

  const contractAddress = process.env.NEXT_PUBLIC_TREASURY_CONTRACT_ADDRESS as `0x${string}`;

  const { data, isLoading, refetch } = useReadContract({
    address: contractAddress,
    abi: treasuryAbi,
    functionName: 'members',
    args: [address],
    query: { enabled: !!address && isConnected }
  });

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const [isMember, amount, unclaimedBVW] = data;
      if (isMember) {
        setLiveStaked(formatUnits(amount, 18));
        setPending(Number(formatUnits(unclaimedBVW, 18)).toLocaleString(undefined, { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        }));
      }
    }
  }, [data]);

  return (
  /* 1. CLEAN SLATE: Let layout.tsx handle the background */
  <main className="min-h-screen w-full pb-32 font-inter">
    
    {/* REWARDS HEADER: Transitioning from Violet-Glow to your global background */}
    <div className="w-full bg-gradient-to-b from-violet-glow/30 via-violet-glow/5 to-transparent px-6 pt-12 pb-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black italic tracking-tighter uppercase text-white">Rewards</h1>
        <button 
          onClick={() => refetch()}
          className="p-2 bg-white/5 rounded-full text-white/40 active:rotate-180 transition-transform duration-500 border border-white/5"
        >
          {isLoading ? <Loader2 size={20} className="animate-spin" /> : <RefreshCcw size={20} />}
        </button>
      </div>

      {/* Yield & Stake Row */}
      <div className="flex gap-10">
        <div className="flex flex-col gap-1">
          <span className="text-white/30 text-[10px] font-black uppercase tracking-widest italic">BVW Yield</span>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gold-buttons rounded-full flex items-center justify-center text-text-color font-black text-[9px] italic">BVW</div>
            <span className="text-3xl font-black italic tracking-tighter text-white">{pending}</span>
            <ChevronRight size={18} className="text-white/20" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-white/30 text-[10px] font-black uppercase tracking-widest italic">Active Stake</span>
          <div className="flex items-center gap-2">
            <Ticket size={22} className="text-gold-buttons" />
            <span className="text-3xl font-black italic tracking-tighter text-white">{Number(liveStaked).toFixed(2)} <span className="text-sm opacity-20">ETH</span></span>
            <ChevronRight size={18} className="text-white/20" />
          </div>
        </div>
      </div>
    </div>

    <div className="px-6 -mt-4 space-y-8">
      
      {/* 2. ICON GRID: Standardized with rounded-bigview */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Weekly Drop', icon: <Zap size={22} />, color: 'text-gold-buttons', bg: 'bg-gold-buttons/10' },
          { label: 'Referral', icon: <Gift size={22} />, color: 'text-pink-400', bg: 'bg-pink-400/10' },
          { label: 'Boosters', icon: <TrendingUp size={22} />, color: 'text-violet-glow', bg: 'bg-violet-glow/10' },
          { label: 'Governance', icon: <Ticket size={22} />, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className={`w-16 h-16 ${item.bg} ${item.color} rounded-bigview flex items-center justify-center border border-white/5 shadow-xl active:scale-90 transition-all`}>
              {item.icon}
            </div>
            <span className="text-[9px] font-black uppercase tracking-tight text-white/30 text-center leading-tight italic">{item.label}</span>
          </div>
        ))}
      </div>

      {/* 3. HOT REWARDS: Bigview Voucher Style */}
      <section>
        <div className="flex items-center gap-2 mb-4 px-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] italic text-white/40">Hot Yield Boosters</h3>
          <div className="h-px flex-grow bg-white/5 rounded-full" />
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {[1, 2].map((v) => (
            <div key={v} className="min-w-[200px] bg-white/[0.03] border border-white/5 rounded-bigview p-5 relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 left-0 w-full h-1 bg-gold-buttons" />
              <p className="text-gold-buttons text-2xl font-black italic tracking-tighter mb-1">+5% APY</p>
              <p className="text-[10px] font-black text-white/20 mb-6 uppercase tracking-widest italic">Stake Booster v.{v}</p>
              <button className="w-full py-2.5 bg-gold-buttons text-text-color rounded-full text-[10px] font-black uppercase tracking-[0.2em] active:scale-95 transition-all shadow-lg shadow-gold-buttons/5">
                Claim
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. DAILY QUESTS: Glassmorphic list */}
      <section className="bg-white/[0.02] rounded-bigview p-6 border border-white/5 backdrop-blur-sm">
         <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-6 italic">Daily Quests</h3>
         <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-violet-glow/10 rounded-bigview flex items-center justify-center text-violet-glow border border-white/5">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-black italic uppercase tracking-tight leading-none text-white">Yield Multiplier</h4>
                  <p className="text-[10px] text-gold-buttons font-black mt-1 uppercase italic">+Up to 6.5%</p>
                </div>
              </div>
              <button className="px-6 py-2 bg-white/5 border border-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors">Go</button>
            </div>
         </div>
      </section>

    </div>
  </main>
);
}