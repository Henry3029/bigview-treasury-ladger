"use client";

import React from 'react';
import SwapInterface from '@/components/SwapInterface';
import { ArrowLeftRight, Activity, ShieldCheck } from 'lucide-react';

export default function SwapPage() {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col items-center justify-center py-20 px-6">
      
      {/* 1. Background Decorative Elements (Modern DeFi Style) */}
      {/* Soft blue glow top-left */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" />
      {/* Deep indigo glow bottom-right */}
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* 2. Page Header */}
      <div className="text-center mb-10 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full border border-slate-100 shadow-sm mb-6">
          <ShieldCheck size={14} className="text-blue-500" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified Base Protocol</span>
        </div>
        
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-3 italic">
          Exchange Assets
        </h1>
        <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
          Swap <span className="text-blue-600 font-bold">Base Sepolia</span> tokens instantly with near-zero friction.
        </p>
      </div>

      {/* 3. The Swap Component */}
      <div className="w-full max-w-md relative z-10">
        <div className="absolute -top-4 -right-4 bg-blue-600 text-white p-3 rounded-2xl shadow-xl rotate-12 z-20">
          <ArrowLeftRight size={20} />
        </div>
        <SwapInterface />
      </div>

      {/* 4. Footer Info & Network Status */}
      <div className="mt-12 flex flex-col items-center gap-6 relative z-10">
        <div className="flex gap-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-lg border border-slate-100">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Base Sepolia
          </div>
          <div className="flex items-center gap-2">
            Slippage: <span className="text-slate-900">0.5%</span>
          </div>
          <div className="flex items-center gap-2">
            Fee: <span className="text-slate-900">0.3%</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-300">
          <Activity size={14} />
          <span className="text-[9px] font-bold uppercase tracking-widest">Real-time pricing active</span>
        </div>
      </div>
    </div>
  );
}