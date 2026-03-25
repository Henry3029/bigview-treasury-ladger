"use client";
import SwapInterface from '@/components/SwapInterface';

export default function SwapPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden flex flex-col items-center justify-center py-20 px-4">
      
      {/* 1. Background Decorative Elements (DeFi Style) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-100/50 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]" />

      {/* 2. Page Header */}
      <div className="text-center mb-8 relative z-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
          Exchange Assets
        </h1>
        <p className="text-slate-500 font-medium">
          Swap STX ecosystem tokens instantly with zero friction.
        </p>
      </div>

      {/* 3. The Swap Component */}
      <div className="w-full max-w-md relative z-10">
        <SwapInterface />
      </div>

      {/* 4. Footer Info */}
      <div className="mt-8 flex gap-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Stacks Mainnet
        </div>
        <div>Slippage: 4%</div>
        <div>Fee: 0.3%</div>
      </div>
    </div>
  );
}