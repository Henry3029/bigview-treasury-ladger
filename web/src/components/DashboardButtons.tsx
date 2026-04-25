"use client";

import React from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Gift, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardButtons() {
  const { login, authenticated } = usePrivy();
  const router = useRouter();

  const handleSwap = () => router.push('/swap');
  const handleClaim = () => {
    if (!authenticated) return login();
    router.push('/claim'); 
  };

  return (
  <>
  {/* 1. Container: Spanning full width for the dashboard */}
  <div className="flex gap-3 w-full px-1">
    
    {/* 1. SWAP BVW BUTTON */}
    <button 
      onClick={handleSwap}
      className="flex-1 flex items-center gap-3 p-3 bg-violet-glow/10 rounded-bigview border-t border-b border-white/5 hover:bg-violet-glow/20 active:scale-[0.98] transition-all group"
    >
      <div className="text-left overflow-hidden">
        <span className="block text-[10px] font-black  tracking-widest text-color-white truncate">Swap</span>
        <span className="block text-[8px] font-bold tracking-tighter text-white/40 truncate">BVW Token</span>
      </div>
    </button>

    {/* 2. CLAIM REWARDS BUTTON */}
    <button 
      onClick={handleClaim}
      className="flex-1 flex items-center gap-3 p-3 bg-violet-glow/10 rounded-bigview border border-white/5 hover:bg-violet-glow/20 active:scale-[0.98] transition-all group"
    >
      {/* Brand Icon Box - Gold themed for the "Reward" feeling */}
      <div className="shrink-0 w-12 h-12 bg-gold-buttons rounded-bigview flex items-center justify-center border border-white/10 shadow-2xl group-hover:border-white/50 transition-colors">
        <Gift size={20} className="text-text-color" strokeWidth={2.5} />
      </div>
      
      <div className="text-left flex-1 overflow-hidden">
        <span className="block text-[10px] font-black uppercase tracking-widest text-white truncate">Claim</span>
        <span className="block text-[8px] font-bold tracking-tighter text-white/40 truncate">Rewards</span>
      </div>
      
      {/* Chevron styling updated to match Bigview text colors */}
      <ChevronRight size={14} className="hidden sm:block text-white/20 group-hover:text-gold-buttons transition-colors" />
    </button>

  </div>
  </>
);
}