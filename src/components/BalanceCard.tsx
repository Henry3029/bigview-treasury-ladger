'use client';
import { useState } from 'react';
import { Eye, EyeOff, ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';

export default function BalanceCard({ amount = "0.00 ETH" }: { amount?: string }) {
  const [showBalance, setShowBalance] = useState(true);

  return (
    /* 1. OPay Gold Gradient using your global CSS class */
    <div className="w-full p-6 opay-gold-card shadow-2xl shadow-amber-900/20">
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
            Available Balance
          </span>
          <button 
            onClick={() => setShowBalance(!showBalance)}
            className="p-1 hover:bg-white/10 rounded-full transition-colors text-white"
          >
            {showBalance ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
        </div>
        
        <Link 
          href="/history" 
          className="flex items-center gap-1 text-[10px] font-black uppercase tracking-tight text-white/90 hover:opacity-70 transition-opacity"
        >
          Transaction History
          <ChevronRight size={14} />
        </Link>
      </div>

      <div className="flex items-center justify-between">
        {/* Tabular nums makes the ETH balance look like a pro banking app */}
        <h2 className="text-4xl font-black italic tracking-tighter tabular-nums text-white">
          {showBalance ? amount : "••••••"}
        </h2>

        <button className="flex items-center gap-1.5 px-6 py-3 bg-neutral-950 text-amber-400 rounded-full text-[10px] font-black shadow-2xl active:scale-95 transition-all border border-white/5">
          <Plus size={16} strokeWidth={3} />
          + ADD MONEY
        </button>
      </div>
    </div>
  );
}