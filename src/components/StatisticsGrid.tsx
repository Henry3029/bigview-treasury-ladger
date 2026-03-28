"use client";

import React from 'react';
import { TrendingUp, Percent } from 'lucide-react';

// We tell the component to expect "totalStaked" and "apy" as inputs (props)
export const StatisticsGrid = ({ totalStaked, apy }: { totalStaked: string, apy: string }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      {/* Pool APY / Reward Rate Card */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-green-600">
          <Percent size={14} strokeWidth={3} />
          <p className="text-[10px] uppercase font-black tracking-widest opacity-70">Pool APY</p>
        </div>
        {/* Shows the variable passed from your contract data */}
        <p className="text-2xl font-black text-slate-900 tracking-tight">
          {apy}%
        </p>
      </div>
      
      {/* Global Staked Card */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-blue-600">
          <TrendingUp size={14} strokeWidth={3} />
          <p className="text-[10px] uppercase font-black tracking-widest opacity-70">Global Staked</p>
        </div>
        <div className="flex items-baseline gap-1">
          <p className="text-2xl font-black text-slate-900 tracking-tight">
            {totalStaked}
          </p>
          <span className="text-[10px] font-black text-slate-400">ETH</span>
        </div>
      </div>
    </div>
  );
};