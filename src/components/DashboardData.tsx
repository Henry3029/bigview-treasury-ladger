"use client";
import React, { useEffect, useState } from 'react';
import { Users, TrendingUp, PieChart } from 'lucide-react'; 
import { useReadContracts } from 'wagmi';
import { formatEther } from 'viem';
import { abi as treasuryAbi } from '@/constants/abis/BigViewTreasury.json';

export default function DashboardData() {
  const [mounted, setMounted] = useState(false);
  const treasuryAddress = process.env.NEXT_PUBLIC_TREASURY_ADDRESS;

  useEffect(() => { setMounted(true); }, []);

  const { data, isLoading } = useReadContracts({
    contracts: [
      { address: treasuryAddress as `0x${string}`, abi: treasuryAbi, functionName: 'totalMembersCount' },
      { address: treasuryAddress as `0x${string}`, abi: treasuryAbi, functionName: 'totalStakedAmount' },
    ],
  });

  if (!mounted || isLoading) return <div className="p-8 glass-card animate-pulse" />;

  const totalMembers = data?.[0]?.result ? Number(data[0].result).toString() : "0";
  const totalStaked = data?.[1]?.result ? formatEther(data[1].result as bigint) : "0";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Members Card */}
        <div className="p-5 glass-card flex flex-col gap-2">
          <div className="flex items-center gap-2 text-neutral-500">
            <Users size={14} />
            <span className="text-[9px] uppercase font-black tracking-[0.2em]">Members</span>
          </div>
          <span className="text-xl font-black italic tracking-tighter uppercase">{totalMembers}</span>
        </div>
        
        {/* APY Card */}
        <div className="p-5 glass-card flex flex-col gap-2">
          <div className="flex items-center gap-2 text-amber-500">
            <TrendingUp size={14} />
            <span className="text-[9px] uppercase font-black tracking-[0.2em]">Live APY</span>
          </div>
          <span className="text-xl font-black italic tracking-tighter uppercase text-amber-400">12.5%</span>
        </div>
      </div>

      {/* Global Treasury Stat - Full Width Glass */}
      <div className="p-5 glass-card flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] uppercase font-black tracking-[0.2em] text-neutral-500">Global Stake</span>
          <span className="text-2xl font-black italic tracking-tighter uppercase">
            {Number(totalStaked).toLocaleString()} <span className="text-xs text-neutral-600">ETH</span>
          </span>
        </div>
        <PieChart size={32} className="text-neutral-800" />
      </div>
    </div>
  );
}