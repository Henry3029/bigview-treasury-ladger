'use client';
import { useState } from 'react';
import { Eye, EyeOff, ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';

export default function BalanceCard({ amount = "0.00 ETH" }: { amount?: string }) {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div className="w-full p-6 bg-[#00D094] rounded-[2.5rem] text-slate-900 shadow-lg shadow-emerald-100/30">
      
      {/* TOP ROW: Text first, then Eye Icon next to it */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/60">
            Available Balance
          </span>
          <button 
            onClick={() => setShowBalance(!showBalance)}
            className="p-1 hover:bg-black/5 rounded-full transition-colors"
          >
            {showBalance ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
        </div>
        
        <Link 
          href="/history" 
          className="flex items-center gap-1 text-[10px] font-black uppercase tracking-tight hover:opacity-70 transition-opacity"
        >
          History
          <ChevronRight size={14} />
        </Link>
      </div>

      {/* BOTTOM ROW: Clean balance and Top Up button */}
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-black italic tracking-tighter tabular-nums">
          {showBalance ? amount : "••••••"}
        </h2>

        <button className="flex items-center gap-1.5 px-6 py-3 bg-slate-900 text-white rounded-full text-xs font-black shadow-xl active:scale-95 transition-all">
          <Plus size={18} strokeWidth={3} />
          TOP UP
        </button>
      </div>

    </div>
  );
}