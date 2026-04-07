'use client';
import { useState } from 'react';
import { Eye, EyeOff, ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';

export default function BalanceCard({ amount = "0.00 ETH" }: { amount?: string }) {
  const [showBalance, setShowBalance] = useState(true);

  /* 1. Bigview Gold Gradient using your custom branding */
return (
  <div className="w-full p-6 bg-gold-buttons rounded-bigview shadow-2xl shadow-black/20 relative overflow-hidden">
    {/* Subtle decorative background element for that "Pro" feel */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16" />
    
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-color/60">
            Available Balance
          </span>
          <button 
            onClick={() => setShowBalance(!showBalance)}
            className="p-1 hover:bg-black/5 rounded-full transition-colors text-text-color"
          >
            {showBalance ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
        </div>
        
        <Link 
          href="/history" 
          className="flex items-center gap-1 text-[10px] font-black uppercase tracking-tight text-text-color/80 hover:opacity-70 transition-opacity"
        >
          Transaction History
          <ChevronRight size={14} />
        </Link>
      </div>

      <div className="flex items-center justify-between">
        {/* Tabular nums makes the balance look like a professional banking app */}
        <h2 className="text-4xl font-black italic tracking-tighter tabular-nums text-text-color">
          {showBalance ? amount : "••••••"}
        </h2>

        {/* Action Button: Swapped to Violet Background for high contrast against the Gold Card */}
        <button className="flex items-center gap-1.5 px-6 py-3 bg-violet-background text-white rounded-bigview text-[10px] font-black shadow-2xl active:scale-95 transition-all border border-white/5">
          <Plus size={16} strokeWidth={3} />
          ADD MONEY
        </button>
      </div>
    </div>
  </div>
);
}