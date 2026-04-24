"use client";
import React, { useEffect, useState } from 'react';
import { Users, TrendingUp, PieChart } from 'lucide-react'; 
import { createPublicClient, http, formatEther } from 'viem';
import { baseSepolia } from 'viem/chains';
import treasuryAbi from '@/constants/abis/BigViewTreasuryV2.json';

// 1. ADD THE INTERFACE HERE
interface DashboardDataProps {
  stake?: string; // The '?' makes it optional so it won't crash if it's missing
}

// 2. PASS PROPS INTO THE FUNCTION
export default function DashboardData({ stake }: DashboardDataProps) {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({ members: "0", staked: "0" });
  const [loading, setLoading] = useState(true);

  const treasuryAddress = process.env.NEXT_PUBLIC_TREASURY_ADDRESS as `0x${string}`;

  useEffect(() => {
    setMounted(true);
    
    const client = createPublicClient({
      chain: baseSepolia,
      transport: http(), 
    });

    async function getBlockchainData() {
      try {
        const data = await client.multicall({
          contracts: [
            { address: treasuryAddress, abi: treasuryAbi, functionName: 'totalMembersCount' },
            { address: treasuryAddress, abi: treasuryAbi, functionName: 'totalStakedAmount' },
          ]
        });

        setStats({
          members: data[0].result ? Number(data[0].result).toString() : "0",
          // 3. LOGIC: Use the 'stake' prop if it exists, otherwise use the blockchain result
          staked: stake ? stake.replace(" ETH", "") : (data[1].result ? formatEther(data[1].result as bigint) : "0"),
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }

    getBlockchainData();
  }, [treasuryAddress, stake]); // Add stake to dependency array

  if (!mounted || loading) return <div className="p-8 bg-charcaol/5 rounded-bigview animate-pulse border border-white/5" />;

  return (
    <div className="space-y-3 mx-2">
       {/* ... rest of your UI code stays exactly the same ... */}
       <div className="grid grid-cols-2 gap-3">
          {/* Members Card */}
          <div className="p-2 border border-white/5 rounded-bigview flex flex-col gap-1 shadow-sm">
            <div className="flex items-center gap-2 text-color-white/40">
              <Users size={12} strokeWidth={3} />
              <span className="text-[8px]  font-black tracking-[0.2em]">Network Size</span>
            </div>
            <span className="text-xl font-black tracking-tighter text-color-white">
              {stats.members} <span className="text-[10px] text-color-white/20 not-italic">Users</span>
            </span>
          </div>
          
          {/* APY Card */}
          <div className="p-4 border border-white/5 rounded-bigview flex flex-col gap-1 shadow-sm">
            <div className="flex items-center gap-2 text-color-white/60">
              <TrendingUp size={12} strokeWidth={3} />
              <span className="text-[8px]  font-bold tracking-[0.2em]">Yield Rate</span>
            </div>
            <span className="text-xl font-bold tracking-tighter text-color-white">
              12.5% <span className="text-[10px] text-color-white/40 not-italic">APY</span>
            </span>
          </div>
       </div>

       {/* Global Treasury Stat */}
       <div className="p-5 border border-white/5 rounded-bigview flex items-center justify-between shadow-xl relative overflow-hidden">
         <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-electric-yellow/20 rounded-full" />
         <div className="flex flex-col gap-1 relative z-10">
           <span className="text-[8px]  font-black tracking-[0.2em] text-color-white/40">Total Value Locked</span>
           <span className="text-2xl font-black tracking-tighter text-color-white">
             {/* Use the updated stats.staked */}
             {Number(stats.staked).toLocaleString()} <span className="text-xs text-solid-green">ETH</span>
           </span>
         </div>
         <div className="p-2 rounded-bigview border border-white/10 shadow-inner group transition-transform hover:scale-105">
            <PieChart size={20} className="text-blue" strokeWidth={2.5} />
         </div>
       </div>
    </div>
  );
}