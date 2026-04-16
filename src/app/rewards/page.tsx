'use client';

import React, { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { createPublicClient, http, formatUnits } from 'viem';
import { baseSepolia } from 'viem/chains';
import { RefreshCcw, Loader2, ChevronRight, Gift, Zap, Ticket, TrendingUp } from 'lucide-react';

// Use your V2 ABI
import tokenAbi from '@/constants/abis/BigViewTreasuryV2.json';

export default function RewardsPage() {
  const { user, authenticated } = usePrivy();
  const address = user?.wallet?.address;

  const [pending, setPending] = useState("0.00");
  const [liveStaked, setLiveStaked] = useState("0.00");
  const [isLoading, setIsLoading] = useState(false);

  const contractAddress = "0xE5d555B65924BcB6FB7B8aAD9303727A8f3F5788" as `0x${string}`;

  // 1. SETUP PUBLIC CLIENT
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC)
  });

  const fetchRewardsData = async () => {
    if (!address || !authenticated) return;
    
    try {
      setIsLoading(true);
      const data = await publicClient.readContract({
        address: contractAddress,
        abi: tokenAbi,
        functionName: 'members',
        args: [address],
      });

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
    } catch (err) {
      console.error("Error fetching rewards:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRewardsData();
  }, [address, authenticated]);

  return (
    <main className="min-h-screen w-full pb-22 font-inter bg-charcaol text-white mx-auto">
      
      {/* REWARDS HEADER: Deep Slate & Gold Accents */}
      <div className="w-full bg-gradient-to-b from-gold-buttons/10 via-transparent to-transparent pt-12 pb-10">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black tracking-tighter">Rewards</h1>
          <button 
            onClick={() => fetchRewardsData()}
            disabled={isLoading}
            className="p-2 bg-white/5 rounded-full text-white/40 active:rotate-180 transition-all border border-white/5"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin text-gold-buttons" /> : <RefreshCcw size={20} />}
          </button>
        </div>

        {/* Yield & Stake Row */}
        <div className="flex gap-10">
          <div className="flex flex-col gap-1">
            <span className="text-white/30 text-[10px] font-black tracking-tight">BVW Yield</span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gold-buttons rounded-full flex items-center justify-center text-black font-black text-[9px] shadow-lg shadow-gold-buttons/20">BVW</div>
              <span className="text-3xl font-black tracking-tighter">{pending}</span>
              <ChevronRight size={18} className="text-white/40" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-white/30 text-[10px] font-black tracking-tight">Active Stake</span>
            <div className="flex items-center gap-2">
              <Ticket size={22} className="text-gold-buttons" />
              <span className="text-3xl font-black tracking-tighter">
                {Number(liveStaked).toFixed(2)} <span className="text-sm opacity-20">ETH</span>
              </span>
              <ChevronRight size={18} className="text-white/20" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4 space-y-8">
        
        {/* ICON GRID */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Weekly Drop', icon: <Zap size={22} />, color: 'text-gold-buttons', bg: 'bg-gold-buttons/10' },
            { label: 'Referral', icon: <Gift size={22} />, color: 'text-pink-400', bg: 'bg-pink-400/10' },
            { label: 'Boosters', icon: <TrendingUp size={22} />, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
            { label: 'Governance', icon: <Ticket size={22} />, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className={`w-16 h-16 ${item.bg} ${item.color} rounded-bigview flex items-center justify-center border border-white/5 shadow-xl active:scale-90 transition-all`}>
                {item.icon}
              </div>
              <span className="text-[9px] font-black tracking-tight text-white/30 text-center leading-tight">{item.label}</span>
            </div>
          ))}
        </div>

        {/* HOT REWARDS */}
        <section>
          <div className="flex items-center gap-2 mb-4 px-1">
            <h3 className="text-[10px] font-black tracking-tight text-white/40">Hot Yield Boosters</h3>
            <div className="h-px flex-grow bg-white/5 rounded-full" />
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {[1, 2].map((v) => (
              <div key={v} className="min-w-[200px] bg-[#1E293B] border border-white/5 rounded-bigview p-5 relative overflow-hidden backdrop-blur-md">
                <div className="absolute top-0 left-0 w-full h-1 bg-gold-buttons" />
                <p className="text-color-white text-2xl font-black tracking-tighter mb-1">+5% APY</p>
                <p className="text-[10px] font-black text-white/20 mb-6 tracking-tight">Stake Booster v.{v}</p>
                <button className="w-full py-2.5 bg-charcaol text-color-white rounded-full text-[10px] font-black tracking-tight active:scale-95 transition-all shadow-lg shadow-gold-buttons/10">
                  Claim
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* DAILY QUESTS */}
        <section className="bg-[#1E293B] rounded-bigview p-6 border border-white/5 backdrop-blur-sm">
           <h3 className="text-[10px] font-black tracking-tight text-white/20 mb-6">Daily Quests</h3>
           <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-charcaol rounded-bigview flex items-center justify-center text-color-white border border-white/5">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black tracking-tight leading-none text-white">Yield Multiplier</h4>
                    <p className="text-[10px] text-emerald-400 font-black mt-1">+Up to 6.5%</p>
                  </div>
                </div>
                <button className="px-6 py-2 bg-charcaol border border-white/10 text-white rounded-full text-[10px] font-black tracking-tight hover:bg-gold-buttons hover:text-black transition-all">Go</button>
              </div>
           </div>
        </section>

      </div>
    </main>
  );
}