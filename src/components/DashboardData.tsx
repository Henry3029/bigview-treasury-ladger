"use client";

import React, { useEffect, useState } from 'react';
import { Loader2, Users, PieChart, TrendingUp } from 'lucide-react'; 
import { useReadContracts } from 'wagmi';
import { formatEther } from 'viem';
import { abi as treasuryAbi } from '@/constants/abis/BigViewTreasury.json';

export default function DashboardData() {
  const [mounted, setMounted] = useState(false);
  const treasuryAddress = process.env.NEXT_PUBLIC_TREASURY_ADDRESS;

  // Hydration fix for Next.js
  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Fetch Global Treasury Data
  const { data, isLoading, isError } = useReadContracts({
    contracts: [
      {
        address: treasuryAddress as `0x${string}`,
        abi: treasuryAbi,
        functionName: 'totalMembersCount',
      },
      {
        address: treasuryAddress as `0x${string}`,
        abi: treasuryAbi,
        functionName: 'totalStakedAmount',
      },
      {
        address: treasuryAddress as `0x${string}`,
        abi: treasuryAbi,
        functionName: 'rewardRate',
      }
    ],
  });

  if (!mounted) return null;

  // --- THE SPINNER LOGIC ---
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-gray-100 shadow-sm animate-pulse">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="mt-4 text-xs text-gray-400 font-bold uppercase tracking-widest">Syncing Treasury...</p>
      </div>
    );
  }

  // Extract values from the results array safely
  const totalMembers = data?.[0]?.result ? Number(data[0].result).toString() : "0";
  const totalStaked = data?.[1]?.result ? formatEther(data[1].result as bigint) : "0";
  const rate = data?.[2]?.result ? Number(data[2].result).toString() : "0";

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        
        {/* Total Members Card */}
        <div className="p-5 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-gray-400">
            <Users size={14} />
            <span className="text-[10px] uppercase font-black tracking-widest">Members</span>
          </div>
          <span className="text-2xl font-bold text-slate-900">
            {totalMembers}
          </span>
        </div>
        
        {/* Total Staked Card */}
        <div className="p-5 bg-blue-600 rounded-3xl shadow-lg flex flex-col gap-2 text-white">
          <div className="flex items-center gap-2 opacity-80">
            <TrendingUp size={14} />
            <span className="text-[10px] uppercase font-black tracking-widest text-blue-100">Global Stake</span>
          </div>
          <span className="text-2xl font-bold">
            {Number(totalStaked).toLocaleString()}
            <span className="text-xs ml-1 opacity-70">ETH</span>
          </span>
        </div>

      </div>

      {/* Reward Rate Overview */}
      <div className="p-5 bg-slate-900 rounded-3xl shadow-sm flex items-center justify-between text-white">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Current Reward Rate</span>
          <span className="text-xl font-bold">
            {rate} <span className="text-xs text-orange-400">BVW per 1 ETH</span>
          </span>
        </div>
        <PieChart className="text-slate-700" size={32} />
      </div>
    </div>
  );
}