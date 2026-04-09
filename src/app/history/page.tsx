'use client';

import React, { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth'; // Replaced wagmi
import { ReceiptText, History, Wallet } from 'lucide-react';
import TreasuryTable from "@/components/TreasuryTable";

export default function HistoryPage() {
  // 1. USE PRIVY INSTEAD OF WAGMI
  const { user, authenticated } = usePrivy();
  const address = user?.wallet?.address; // Get address from Privy
  
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Avoid hydration mismatch
  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0F172A]">
        <div className="p-8 text-center text-white/20 animate-pulse font-black uppercase tracking-[0.4em] text-[10px] italic">
          Loading Ledger...
        </div>
      </div>
    );
  }

  return (
    /* MAIN LAYOUT: Deep Slate Background */
    <div className="p-6 md:p-10 pb-24 min-h-screen font-inter bg-[#0F172A]">
      
      {/* Header Section: BigView Branding */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gold-buttons rounded-bigview text-black shadow-lg shadow-gold-buttons/20">
              <History size={20} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter italic uppercase leading-none">
              Transaction History
            </h1>
          </div>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-1 italic">
            Track your interactions with the <span className="text-gold-buttons">Bigview Treasury</span> on Base.
          </p>
        </div>

        {authenticated && (
          <div className="px-4 py-2 bg-white/5 rounded-bigview border border-white/10 backdrop-blur-md flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">
              Live Feed Active
            </span>
          </div>
        )}
      </div>
      
      {/* Table Container: Glassmorphism look */}
      <div className="bg-[#1E293B] rounded-bigview shadow-2xl border border-white/5 overflow-hidden p-2 backdrop-blur-xl">
        {authenticated ? (
          /* We pass the Privy address to your table */
          <TreasuryTable address={address || null} />
        ) : (
          /* Empty/Disconnected State */
          <div className="p-24 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-[#0F172A] rounded-bigview flex items-center justify-center mb-6 text-white/5 border border-white/5 shadow-inner">
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

      {/* Footer Branding */}
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