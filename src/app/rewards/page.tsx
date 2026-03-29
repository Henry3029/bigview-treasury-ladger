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
    <main className="min-h-screen w-full bg-[#060606] text-white pb-32 font-inter">
      
      {/* 1. OPay EMERALD HEADER: Highlighting the BVW Balance */}
      <div className="w-full bg-gradient-to-b from-[#004D3C] to-[#060606] px-6 pt-12 pb-10">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black italic tracking-tighter uppercase">Rewards</h1>
          <button 
            onClick={() => refetch()}
            className="p-2 bg-white/10 rounded-full text-white/60 active:rotate-180 transition-transform duration-500"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <RefreshCcw size={20} />}
          </button>
        </div>

        {/* Cashback & Vouchers Row */}
        <div className="flex gap-10">
          <div className="flex flex-col gap-1">
            <span className="text-white/50 text-[10px] font-black uppercase tracking-widest">BVW Yield</span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center text-amber-950 font-black text-[9px]">BVW</div>
              <span className="text-3xl font-black italic tracking-tighter">{pending}</span>
              <ChevronRight size={18} className="text-white/30" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-white/50 text-[10px] font-black uppercase tracking-widest">Active Stake</span>
            <div className="flex items-center gap-2">
              <Ticket size={22} className="text-emerald-400" />
              <span className="text-3xl font-black italic tracking-tighter">{Number(liveStaked).toFixed(2)} <span className="text-sm opacity-40">ETH</span></span>
              <ChevronRight size={18} className="text-white/30" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4 space-y-8">
        
        {/* 2. ICON GRID: Quick Reward Actions */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Weekly Drop', icon: <Zap size={22} />, color: 'text-amber-400', bg: 'bg-amber-400/10' },
            { label: 'Referral', icon: <Gift size={22} />, color: 'text-pink-400', bg: 'bg-pink-400/10' },
            { label: 'Boosters', icon: <TrendingUp size={22} />, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
            { label: 'Governance', icon: <Ticket size={22} />, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className={`w-16 h-16 ${item.bg} ${item.color} rounded-[1.5rem] flex items-center justify-center border border-white/5 shadow-xl`}>
                {item.icon}
              </div>
              <span className="text-[9px] font-black uppercase tracking-tight text-neutral-500 text-center leading-tight">{item.label}</span>
            </div>
          ))}
        </div>

        {/* 3. HOT REWARDS: Voucher-style cards */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] italic">Hot Yield Boosters</h3>
            <div className="h-[2px] flex-grow bg-white/5 rounded-full" />
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {[1, 2].map((v) => (
              <div key={v} className="min-w-[200px] bg-neutral-900 border border-white/5 rounded-[2rem] p-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
                <p className="text-emerald-400 text-2xl font-black italic tracking-tighter mb-1">+5% APY</p>
                <p className="text-[10px] font-bold text-neutral-500 mb-6 uppercase tracking-widest">Stake Booster v.{v}</p>
                <button className="w-full py-2.5 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] active:scale-95 transition-all">
                  Claim
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 4. DAILY BONUS: List-style tasks */}
        <section className="bg-neutral-900/40 rounded-[2.5rem] p-6 border border-white/5">
           <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-600 mb-6">Daily Quests</h3>
           <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black italic uppercase tracking-tight leading-none">Yield Multiplier</h4>
                    <p className="text-[10px] text-neutral-500 font-bold mt-1 uppercase text-amber-500/80">+Up to 6.5%</p>
                  </div>
                </div>
                <button className="px-6 py-2 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest">Go</button>
              </div>
           </div>
        </section>

      </div>
    </main>
  );
}