"use client";

import React from 'react';
import { TrendingUp, Percent } from 'lucide-react';

// We tell the component to expect "totalStaked" and "apy" as inputs (props)
export const StatisticsGrid = ({ totalStaked, apy }: { totalStaked: string, apy: string }) => {
	
  return (
  <div className="grid grid-cols-2 gap-4 mb-8">
    {/* Pool APY / Reward Rate Card - Using Bigview Gold for "Value" */}
    <div className="bg-color-ash/5 p-6 rounded-bigview shadow-sm border border-white/5 flex flex-col gap-2 relative overflow-hidden">
      {/* Subtle branding accent */}
      <div className="absolute -right-2 -top-2 w-12 h-12 bg-color-ash/5 blur-xl rounded-full" />
      
      <div className="flex items-center gap-2 text-gold-buttons">
        <Percent size={14} strokeWidth={3} />
        <p className="text-[10px] font-black tracking-tight opacity-70">Pool APY</p>
      </div>
      
      <p className="text-2xl font-black text-color-white tracking-tighter">
        {apy}% <span className="text-[10px] not-italic opacity-30">Yield</span>
      </p>
    </div>
    
    {/* Global Staked Card - Using Violet Glow for "Network" stats */}
    <div className="bg-violet-glow/5 p-6 rounded-bigview shadow-sm border border-white/5 flex flex-col gap-2 relative overflow-hidden">
      <div className="flex items-center gap-2 text-white/40">
        <TrendingUp size={14} strokeWidth={3} />
        <p className="text-[10px] font-black tracking-tight opacity-70">Global Staked</p>
      </div>
      
      <div className="flex items-baseline gap-1">
        <p className="text-2xl font-black text-color-white tracking-tighter">
          {totalStaked}
        </p>
        <span className="text-[10px] font-black text-gold-buttons/50 tracking-tight ml-1">ETH</span>
      </div>
    </div>
  </div>
);
}