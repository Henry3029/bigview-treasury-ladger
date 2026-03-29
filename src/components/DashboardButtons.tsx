"use client";
import React from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Wallet, Gift, RefreshCcw } from 'lucide-react';

export default function DashboardButtons() {
  const { login, authenticated } = usePrivy();

  return (
    /* Matching the OPay 'To OPay / To Bank / Withdraw' grid */
    <div className="grid grid-cols-3 gap-4 w-full">
      
      {/* Action 1: Stake */}
      <button 
        onClick={() => window.location.href = '/stake'}
        className="opay-action-tile"
      >
        <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-3xl flex items-center justify-center border border-amber-500/10">
          <Wallet size={24} />
        </div>
        <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Stake</span>
      </button>

      {/* Action 2: Swap (Placeholder icon like OPay's 'Bank' icon) */}
      <button className="opay-action-tile">
        <div className="w-14 h-14 bg-blue-500/10 text-blue-500 rounded-3xl flex items-center justify-center border border-blue-500/10">
          <RefreshCcw size={24} />
        </div>
        <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Swap BVW</span>
      </button>

      {/* Action 3: Claim Rewards */}
      <button 
        onClick={authenticated ? () => {/* claim logic */} : login}
        className="opay-action-tile"
      >
        <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center border border-emerald-500/10">
          <Gift size={24} />
        </div>
        <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Claim</span>
      </button>

    </div>
  );
}