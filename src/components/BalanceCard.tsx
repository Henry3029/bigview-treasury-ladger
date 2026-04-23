'use client';
import { useState } from 'react';
import { Eye, EyeOff, ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';

export default function BalanceCard({ amount = "0.00 ETH" }: { amount?: string }) {
  const [showBalance, setShowBalance] = useState(true);

  /* 1. Bigview Gold Gradient using your custom branding */
return (
<>
  {/* 1. Changed p-6 p4 to px-6 py-4 to make it a sleek rectangle */}
  <div className="px-6 py-4 mx-3 bg-gradient-to-br from-bigview-gold to-bigview-gold-dim rounded-bigview relative overflow-hidden">
    
    <div className="relative z-10">
     { /* 2. Changed mb-6 to mb-2 to close the gap between the rows */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-normal text-black">
            Available Balance
          </span>
          <button 
            onClick={() => setShowBalance(!showBalance)}
            className="p-1 hover:bg-black/5 rounded-full transition-colors text-black"
          >
            {showBalance ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
        </div>
        
        <Link 
          href="/history" 
          className="flex items-center gap-1 text-[22px] font-normal tracking-tight text-black hover:opacity-70 transition-opacity"
        >
          Transaction History
          <ChevronRight size={14} />
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-[22px] font-bold tracking-tighter tabular-nums text-black">
          {showBalance ? amount : "••••••"}
        </h2>

        <button className="flex items-center gap-1.5 p-1 bg-gold-buttons text-black rounded-bigview text-[15px] font-semibold shadow-2xl active:scale-95 transition-all border border-white/5">
          <Plus size={9} strokeWidth={3} />
          <span className="text-black">Add</span>
          <span className="text-solid-green">Money</span>
        </button>
      </div>
    </div>
  </div>
  </>
);
}