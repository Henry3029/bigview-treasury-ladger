'use client';
import { useState } from 'react';
import { Eye, EyeOff, ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link'; // Import Link

export default function BalanceCard({ amount = "0.00 ETH" }: { amount?: string }) {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div className="w-full p-6 bg-[#00D094] rounded-[2rem] text-slate-900 shadow-lg shadow-emerald-100/30">
      
      {/* TOP ROW: Title & Linked Transaction History */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowBalance(!showBalance)}
            className="p-1.5 bg-black/5 rounded-full hover:bg-black/10 transition-colors"
          >
            {showBalance ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
          <span className="text-[10px] font-black uppercase tracking-widest text-black/60">
            Available Balance
          </span>
        </div>
        
        {/* LINKED TO YOUR HISTORY PAGE */}
        <Link 
          href="/history" 
          className="flex items-center gap-1 text-[11px] font-bold hover:opacity-70 transition-opacity active:scale-95"
        >
          Transaction History
          <ChevronRight size={14} />
        </Link>
      </div>

      {/* BOTTOM ROW: Amount & Action Button */}
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tight tabular-nums">
            {showBalance ? amount : "****"}
          </h2>
          <div className="flex items-center gap-1.5 opacity-40">
            <span className="text-[10px] font-black tracking-widest uppercase">Base Sepolia</span>
            <ChevronRight size={10} />
          </div>
        </div>

        <button className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 text-white rounded-full text-xs font-black shadow-xl active:scale-95 transition-all">
          <Plus size={16} strokeWidth={3} />
          Top Up
        </button>
      </div>
    </div>
  );
}