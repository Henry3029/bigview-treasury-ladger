'use client';
import { useState } from 'react';
import { Eye, EyeOff, ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';

export default function BalanceCard({ amount = "0.00 ETH" }: { amount?: string }) {
  const [showBalance, setShowBalance] = useState(true);

  /* 1. Bigview Gold Gradient using your custom branding */
return (
  /* 1. Changed p-6 p4 to px-6 py-4 to make it a sleek rectangle */
  <div className="w-full px-6 py-4 bg-light-green rounded-bigview relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16" />
    
    <div className="relative z-10">
      /* 2. Changed mb-6 to mb-2 to close the gap between the rows */
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-medium text-text-color">
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
          className="flex items-center gap-1 text-[10px] font-bold tracking-tight text-text-color/80 hover:opacity-70 transition-opacity"
        >
          History
          <ChevronRight size={14} />
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold  tracking-tighter tabular-nums text-text-color">
          {showBalance ? amount : "••••••"}
        </h2>

        <button className="flex items-center gap-1.5 px-4 py-2 bg-gold-buttons text-text-color rounded-bigview text-[10px] font-bold shadow-2xl active:scale-95 transition-all border border-white/5">
          <Plus size={16} strokeWidth={3} />
          <span className="text-text-color">Add</span>
          <span className="text-solid-green">Money</span>
        </button>
      </div>
    </div>
  </div>
);
}