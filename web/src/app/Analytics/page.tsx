'use client';

import React from 'react';
import EarnCard from '@/components/EarnCard'; // Importing your new component
import { TrendingUp, ShieldCheck, Zap, ArrowUpRight } from 'lucide-react';

export default function EarnPage() {
  return (
  <>
  /* 1. CLEAN SLATE: Removed bg-neutral-950 to let layout.tsx handle the background */
  <div className="min-h-screen text-white pt-16 pb-16 font-inter">
    <div className="max-w-6xl mx-auto">
      
      {/* 1. Header: Bigview Branding Applied */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-color-ash rounded-bigview shadow-lg shadow-gold-buttons/20">
              <TrendingUp size={24} className="text-color-white" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white">Growth Vaults</h1>
          </div>
          <p className="text-color-white/40 font-black text-[10px] tracking-tight ml-1 ">
            Deploy idle assets to the <span className="text-gold-buttons">Bigview Ecosystem</span> and generate passive yield.
          </p>
        </div>

        <div className="px-5 py-3 bg-white/5 rounded-bigview border border-white/5 flex items-center gap-3 backdrop-blur-sm">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-[10px] font-black tracking-tight text-white/30">Total Protocol TVL:</span>
          <span className="text-sm font-black text-color-white">$1.24M+</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* 2. Strategy List (Simplified Left Side) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-color-ash/[0.02] rounded-bigview p-8 border border-white/5 relative overflow-hidden backdrop-blur-md">
            {/* Background Decorative Glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-violet-glow/5 blur-[100px] rounded-full" />
            
            <div className="flex items-center justify-between mb-10 relative z-10">
              <h3 className="font-black text-xl tracking-tight">Recommended Strategies</h3>
              <span className="text-[9px] font-black text-gold-buttons bg-gold-buttons/10 px-3 py-1 rounded-bigview border border-gold-buttons/20 tracking-tight">
                Base Mainnet
              </span>
            </div>

            {/* Strategy Card: ETH/USDC via Aerodrome */}
            <div className="group relative bg-black/40 p-6 rounded-bigview border border-white/5 hover:border-gold-buttons/30 transition-all cursor-pointer">
              <div className="flex justify-between items-center relative z-10">
                <div className="flex gap-4 items-center">
                  <div className="flex -space-x-3">
                    <div className="w-12 h-12 bg-white/5 rounded-bigview border-2 border-violet-background flex items-center justify-center text-gold-buttons font-black shadow-xl text-xl">Ξ</div>
                    <div className="w-12 h-12 bg-emerald-500 rounded-bigview border-2 border-violet-background flex items-center justify-center text-black font-black text-[10px] shadow-xl">USDC</div>
                  </div>
                  <div>
                    <span className="font-black text-white text-lg tracking-tight group-hover:text-gold-buttons transition-colors">Stable-Core ETH</span>
                    <p className="text-[10px] text-white/30 font-black tracking-tight mt-1">Automated Aerodrome Yield</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[9px] text-white/20 font-black tracking-tight mb-1">Net APY</p>
                  <p className="text-emerald-500 font-black text-3xl tracking-tighter">12.5%</p>
                </div>
              </div>
            </div>

            {/* Reward Highlights */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              <div className="p-4 bg-color-ash/[0.02] rounded-bigview border border-white/5 flex items-center gap-4">
                <Zap size={18} className="text-gold-buttons" />
                <p className="text-[10px] text-white/50 font-black tracking-tighter">Instant Compounding Rewards</p>
              </div>
              <div className="p-4 bg-color-ash/[0.02] rounded-bigview border border-white/5 flex items-center gap-4">
                <ShieldCheck size={18} className="text-emerald-500" />
                <p className="text-[10px] text-white/50 font-black tracking-tighter">Verified Smart Contract Security</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Action Sidebar (Right Side: The New Earn Component) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Insert the EarnCard here */}
            <EarnCard /> 

            {/* Simplified Risk/Info Card: Bigview Gold Styled */}
            <div className="bg-gold-buttons/5 p-6 rounded-bigview border border-gold-buttons/10">
              <h4 className="text-[10px] font-black tracking-tight text-gold-buttons mb-3 flex items-center gap-2">
                  Protocol Transparency
              </h4>
              <p className="text-[10px] text-solid-green leading-relaxed font-black tracking-tighter">
                By depositing, your assets enter a managed vault that optimizes yield across Base. 
              </p>
              <div className="mt-4 flex items-center gap-2 text-white font-black text-[9px] tracking-tight cursor-pointer hover:text-gold-buttons transition-colors">
                View Strategy Audit <ArrowUpRight size={12} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </>
);
}