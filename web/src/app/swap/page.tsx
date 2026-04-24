'use client';

import React from 'react';
import SwapInterface from '@/components/SwapInterface';
import { ArrowLeftRight, Activity, ShieldCheck } from 'lucide-react';

export default function SwapPage() {
  return (
  <>
    {/* 1. CLEAN SLATE: Removed bg-neutral-950 to let layout.tsx handle the background */}
    <div className="min-h-screen relative overflow-hidden flex flex-col items-start justify-center pt-16 pb-20 font-inter">

      {/* 2. Page Header */}
      <div className="text-center mb-8 relative z-10 w-full">
        
        <h1 className="text-2xl font-black text-white tracking-tighter mb-2">
          Exchange Assets
        </h1>
        <p className="text-blue/80 font-black text-[10px] max-w-xs mx-auto leading-relaxed tracking-tight">
          Swap Base Sepolia tokens with <span className="text-gold-buttons">Bigview</span> Liquidity.
        </p>
      </div>

      {/* 3. The Swap Component - Unified with Bigview Tokens */}
      <div className="w-full max-w-md relative z-10 mt-4">
        <SwapInterface />
      </div>

      {/* 4. Footer Info & Network Status */}
      <div className="mt-10 flex flex-col items-center gap-4 relative z-10">
        <div className="flex gap-4 text-[9px] font-black text-white/20 tracking-tight">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-color-ash/5 rounded-bigview border border-white/5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            Base Sepolia
          </div>
          <div className="flex items-center gap-1.5">
            Slippage: <span className="text-white/40">0.5%</span>
          </div>
          <div className="flex items-center gap-1.5">
            Fee: <span className="text-solid-green">1.0%</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-color-white/10">
          <Activity size={12} />
          <span className="text-[8px] font-black tracking-tight">Live Pricing Engine</span>
        </div>
      </div>
    </div>
    </>
  );
  }