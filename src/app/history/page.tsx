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
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="p-8 text-center text-slate-400 animate-pulse font-black uppercase tracking-widest text-xs">
          Loading Ledger...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 pb-24 min-h-screen bg-slate-50">
      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <History size={20} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">
              Transaction History
            </h1>
          </div>
          <p className="text-slate-500 text-sm font-medium ml-1">
            Track your interactions with the <span className="text-blue-600 font-bold">Bigview Treasury</span> on Base.
          </p>
        </div>

        {isConnected && (
          <div className="px-4 py-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Live Feed Active
            </span>
          </div>
        )}
      </div>
      
      {/* Table Container */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white overflow-hidden p-2">
        {isConnected ? (
          <TreasuryTable address={address || null} />
        ) : (
          <div className="p-24 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 text-slate-200">
              <Wallet size={40} />
            </div>
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">
              Connection Required
            </p>
            <p className="text-slate-300 text-sm mt-2 max-w-[200px]">
              Please connect your wallet to view your on-chain history.
            </p>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full">
          <ReceiptText size={14} className="text-slate-400" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Data synced with Base Sepolia Explorer
          </span>
        </div>
      </div>
    </div>
  );
}