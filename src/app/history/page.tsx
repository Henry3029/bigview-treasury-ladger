'use client';

import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { ReceiptText, History, Wallet } from 'lucide-react';
import TreasuryTable from "@/components/TreasuryTable";

export default function HistoryPage() {
  const { address, isConnected } = useAccount();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Avoid hydration mismatch
  if (!isMounted) {
    return (
  /* 1. LOADING STATE: Matches your new brand foundation */
  <div className="flex items-center justify-center min-h-screen">
    <div className="p-8 text-center text-white/20 animate-pulse font-black uppercase tracking-[0.4em] text-[10px] italic">
      Loading Ledger...
    </div>
  </div>
);
}

return (
  /* 2. MAIN LAYOUT: Removed bg-slate-50 to let layout.tsx shine through */
  <div className="p-6 md:p-10 pb-24 min-h-screen font-inter">
    
    {/* Header Section: Bigview Branding */}
    <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gold-buttons rounded-bigview text-text-color shadow-lg shadow-gold-buttons/10">
            <History size={20} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter italic uppercase">
            Transaction History
          </h1>
        </div>
        <p className="text-white/40 text-xs font-black uppercase tracking-widest ml-1 italic">
          Track your interactions with the <span className="text-gold-buttons">Bigview Treasury</span> on Base.
        </p>
      </div>

      {isConnected && (
        <div className="px-4 py-2 bg-white/5 rounded-bigview border border-white/10 backdrop-blur-md flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">
            Live Feed Active
          </span>
        </div>
      )}
    </div>
    
    {/* Table Container: Glassmorphism look */}
    <div className="bg-white/[0.02] rounded-bigview shadow-2xl border border-white/5 overflow-hidden p-2 backdrop-blur-xl">
      {isConnected ? (
        <TreasuryTable address={address || null} />
      ) : (
        /* Empty/Disconnected State */
        <div className="p-24 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-white/5 rounded-bigview flex items-center justify-center mb-6 text-white/10 border border-white/5 shadow-inner">
            <Wallet size={40} />
          </div>
          <p className="text-white/60 font-black uppercase tracking-widest text-[10px] italic">
            Connection Required
          </p>
          <p className="text-white/20 text-[11px] font-bold mt-2 max-w-[200px] uppercase tracking-tighter leading-tight">
            Please connect your wallet to view your on-chain history.
          </p>
        </div>
      )}
    </div>

    {/* Footer Branding: Subtly updated for the dark theme */}
    <div className="mt-8 text-center">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
        <ReceiptText size={14} className="text-gold-buttons/50" />
        <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] italic">
          Data synced with Base Sepolia Explorer
        </span>
      </div>
    </div>
  </div>
);
}