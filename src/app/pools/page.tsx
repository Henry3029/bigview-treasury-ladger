"use client";

import React from 'react';
import AddLiquidity from '@/components/AddLiquidity';
import { Layers, TrendingUp, Info } from 'lucide-react';

export default function PoolsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 pb-32">
      {/* 1. Page Header */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-2xl shadow-lg shadow-blue-100">
              <Layers size={24} className="text-white" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">Liquidity Pools</h1>
          </div>
          <p className="text-slate-500 font-medium ml-1">
            Provide liquidity to the <span className="text-blue-600 font-bold">Bigview Ecosystem</span> and earn rewards.
          </p>
        </div>

        <div className="px-4 py-2 bg-white rounded-2xl border border-slate-100 flex items-center gap-2 shadow-sm">
          <TrendingUp size={16} className="text-green-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Value Locked:</span>
          <span className="text-sm font-black text-slate-900">$1.2M+</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* 2. Pool List (Left Side - 2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 border border-white">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-slate-900 text-xl tracking-tight italic">Active Yield Pools</h3>
              <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">
                Base Sepolia
              </span>
            </div>

            {/* ETH / BVW Pool Card */}
            <div className="group relative overflow-hidden bg-slate-50 p-6 rounded-[2rem] border-2 border-transparent hover:border-blue-100 hover:bg-white transition-all cursor-pointer">
              <div className="flex justify-between items-center relative z-10">
                <div className="flex gap-4 items-center">
                  <div className="flex -space-x-3">
                    {/* ETH Icon Placeholder */}
                    <div className="w-12 h-12 bg-blue-500 rounded-2xl border-4 border-white flex items-center justify-center text-white font-black text-xs shadow-md">
                      Ξ
                    </div>
                    {/* BVW Icon Placeholder */}
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl border-4 border-white flex items-center justify-center text-blue-400 font-black text-[10px] shadow-md">
                      BVW
                    </div>
                  </div>
                  <div>
                    <span className="font-black text-slate-900 text-lg tracking-tight">ETH / BVW</span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Primary Incentive Pool</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Estimated APY</p>
                  <p className="text-green-500 font-black text-2xl tracking-tighter">24.8%</p>
                </div>
              </div>
              
              {/* Background Decorative Blur */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/5 rounded-full blur-3xl group-hover:bg-blue-400/10 transition-all" />
            </div>

            <div className="mt-8 p-6 bg-blue-50/50 rounded-3xl border border-dashed border-blue-100 flex items-start gap-4">
               <Info size={20} className="text-blue-500 mt-1" />
               <p className="text-xs text-blue-700 font-medium leading-relaxed">
                 Liquidity providers earn a 0.3% fee on all trades proportional to their share of the pool. Rewards are distributed in real-time.
               </p>
            </div>
          </div>
        </div>

        {/* 3. Action Sidebar (Right Side - 1/3 width) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
             <AddLiquidity /> 
             
             <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-xl">
               <h4 className="text-xs font-black uppercase tracking-widest text-blue-400 mb-3">Risk Warning</h4>
               <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                Adding liquidity involves exposure to <strong>impermanent loss</strong>. If the price ratio of ETH and BVW changes significantly, you may have less value than if you simply held the assets.
               </p>
               <button className="mt-4 text-[10px] font-black text-blue-400 hover:text-white uppercase tracking-widest transition-colors underline underline-offset-4">
                 Learn more about IL
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}