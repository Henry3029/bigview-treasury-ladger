"use client";
import React, { useEffect, useState } from 'react';
import { Users, TrendingUp, PieChart } from 'lucide-react'; 
import { createPublicClient, http, formatEther } from 'viem';
import { baseSepolia } from 'viem/chains';
import treasuryAbi from '@/constants/abis/BigViewTreasury.json';

export default function DashboardData() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({ members: "0", staked: "0" });
  const [loading, setLoading] = useState(true);

  const treasuryAddress = process.env.NEXT_PUBLIC_TREASURY_ADDRESS as `0x${string}`;

  useEffect(() => {
    setMounted(true);
    
    // Create the "Eye" (Public Client) to look at the blockchain
    const client = createPublicClient({
      chain: baseSepolia,
      transport: http(), // Uses default public RPC
    });

    async function getBlockchainData() {
      try {
        // We use 'multicall' to fetch both numbers in ONE single request (Faster!)
        const data = await client.multicall({
          contracts: [
            { address: treasuryAddress, abi: treasuryAbi, functionName: 'totalMembersCount' },
            { address: treasuryAddress, abi: treasuryAbi, functionName: 'totalStakedAmount' },
          ]
        });

        setStats({
          members: data[0].result ? Number(data[0].result).toString() : "0",
          staked: data[1].result ? formatEther(data[1].result as bigint) : "0",
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }

    getBlockchainData();
  }, [treasuryAddress]);

  if (!mounted || loading) return <div className="p-8 bg-gold-background/5 rounded-bigview animate-pulse border border-white/5" />;

  return (
  <div className="space-y-3 w-full">
    <div className="grid grid-cols-2 gap-3">
      
      {/* Members Card - Using Bigview Deep Violet Tones */}
      <div className="p-4 bg-violet-glow/10 border border-white/5 rounded-bigview flex flex-col gap-1 shadow-sm">
        <div className="flex items-center gap-2 text-white/40">
          <Users size={12} strokeWidth={3} />
          <span className="text-[8px] uppercase font-black tracking-[0.2em]">Network Size</span>
        </div>
        <span className="text-xl font-black italic tracking-tighter uppercase text-white">
          {stats.members} <span className="text-[10px] text-white/20 not-italic">Users</span>
        </span>
      </div>
      
      {/* APY Card - Using Bigview Gold for High Visibility */}
      <div className="p-4 bg-gold-buttons border border-white/5 rounded-bigview flex flex-col gap-1 shadow-sm">
        <div className="flex items-center gap-2 text-text-color/60">
          <TrendingUp size={12} strokeWidth={3} />
          <span className="text-[8px] uppercase font-black tracking-[0.2em]">Yield Rate</span>
        </div>
        <span className="text-xl font-black italic tracking-tighter uppercase text-text-color">
          12.5% <span className="text-[10px] text-text-color/40 not-italic">APY</span>
        </span>
      </div>
    </div>

    {/* Global Treasury Stat - Full Width with Violet Glow Accents */}
    <div className="p-5 bg-violet-glow/5 border border-white/5 rounded-bigview flex items-center justify-between shadow-xl relative overflow-hidden">
      {/* Brand background glow for the 'Big' stat */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-violet-glow/20 blur-3xl rounded-full" />
      
      <div className="flex flex-col gap-1 relative z-10">
        <span className="text-[8px] uppercase font-black tracking-[0.2em] text-white/40">Total Value Locked</span>
        <span className="text-2xl font-black italic tracking-tighter uppercase text-white">
          {Number(stats.staked).toLocaleString()} <span className="text-xs text-gold-buttons">ETH</span>
        </span>
      </div>

      {/* Icon Box using the deep violet background */}
      <div className="p-3 bg-violet-background rounded-bigview border border-white/10 shadow-inner group transition-transform hover:scale-105">
         <PieChart size={20} className="text-gold-buttons" strokeWidth={2.5} />
      </div>
    </div>
  </div>
);
}