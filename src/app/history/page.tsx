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
      <div className="flex py-16 items-center justify-center min-h-screen">
        <div className="p-8 text-center text-gold-buttons/80 animate-pulse font-black tracking-[0.4em] text-[10px]">
          Loading...
        </div>
      </div>
    );
  }

  return (
   { /* MAIN LAYOUT: Deep Slate Background */}
    <div className="pt-16 md:p-10 pb-24 min-h-screen font-inter">
      
      {/* Header Section: BigView Branding */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-black rounded-bigview text-white shadow-lg shadow-white/20">
              <History size={20} />
            </div>
            <h1 className="text-3xl font-black text-color-white tracking-tighter leading-none">
              Transaction History
            </h1>
          </div>
          <p className="text-white text-[10px] font-extrabold tracking-tight ml-1">
            Track your interactions with the <span className="text-gold-buttons">Bigview Treasury</span> on Base.
          </p>
        </div>

        {authenticated && (
          <div className="px-4 py-2 bg-white/5 rounded-bigview border border-white/5 backdrop-blur-md flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="text-[9px] font-bold text-solid-green tracking-tight">
              Live Feed Active
            </span>
          </div>
        )}
      </div>
      
      {/* Table Container: Glassmorphism look */}
      <div className="bg-white/5 rounded-bigview shadow-2xl border border-white/5 overflow-hidden p-2 backdrop-blur-xl">
        {authenticated ? (
          {/* We pass the Privy address to your table */}
          <TreasuryTable address={address || null} />
        ) : (
          {/* Empty/Disconnected State */}
          <div className="p-24 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-black rounded-bigview flex items-center justify-center mb-6 text-color-white/ border border-white/5 shadow-inner">
              <Wallet size={40} />
            </div>
            <p className="text-white font-bold tracking-tight text-[10px]">
              Connection Required
            </p>
            <p className="text-white text-[11px] font-bold mt-2 max-w-[200px] tracking-tighter leading-tight">
              Please connect your wallet to View History.
            </p>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
          <ReceiptText size={14} className="text-gold-buttons/80" />
          <span className="text-[9px] font-bold text-color-white tracking-[0.2em]">
            Data synced with Base Sepolia Explorer
          </span>
        </div>
      </div>
    </div>
  );
}