import React from 'react';
import DashboardData from '@/components/DashboardData';
import { formatUnits } from 'viem';
import { Bell, User, Info, Plus RefreshCw } from 'lucide-react';
import MobileHeader from '@/components/MobileHeader';

const RPC_URL = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || 'https://sepolia.base.org';
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TREASURY_ADDRESS || '';

async function getDashboardData() {
  try {
    const balanceRes = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [CONTRACT_ADDRESS, 'latest'],
        id: 1,
      }),
      next: { revalidate: 30 }
    });
    
    const balanceJson = await balanceRes.json();
    const rawBalance = balanceJson.result || "0x0";
    const ethBalance = formatUnits(BigInt(rawBalance), 18);

    return {
      stake: `${Number(ethBalance).toLocaleString()} ETH`,
      treasuryBalance: Number(ethBalance).toLocaleString(),
    };
  } catch (error) {
    console.error("Dashboard Fetch Error:", error);
    return { stake: "0.00", treasuryBalance: "0.00" };
  }
}

export default async function Dashboard() {
  const stats = await getDashboardData();

  return (
  /* 1. CLEAN SLATE: Removed hard-coded background to let layout.tsx handle it */
  <main className="min-h-screen w-full pb-32 font-inter">
    
    {/* MobileHeader now handles its own internal state for the ProfileDrawer */}
    <MobileHeader onNotificationClick={() => {}} />
    
    <div className="w-full max-w-2xl mx-auto px-4 pt-28 space-y-6">
      
      {/* Welcome Section - Bigview Styled */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-violet-glow/10 rounded-bigview flex items-center justify-center border border-white/5">
              <User size={20} className="text-gold-buttons" />
           </div>
           <div>
              <p className="text-[10px] text-white/30 font-black uppercase tracking-wider leading-tight">Welcome back</p>
              <h1 className="text-lg font-black italic uppercase tracking-tighter leading-none text-white">Hi, Henry</h1>
           </div>
        </div>
      </div>

      {/* GOLD CARD: Refined with Bigview Gold and rounded-bigview */}
      <div className="p-6 rounded-bigview bg-gradient-to-br from-gold-buttons to-[#B8860B] text-text-color shadow-2xl relative overflow-hidden">
        {/* Decorative inner glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16" />
        
        <div className="flex items-center justify-between mb-2 relative z-10">
          <div className="flex items-center gap-2 opacity-60">
            <Info size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Available Balance</span>
          </div>
          <p className="text-[10px] font-black italic uppercase tracking-tighter bg-black/10 px-2.5 py-1 rounded-bigview text-text-color/80 border border-black/5">Base Sepolia</p>
        </div>

        <div className="flex items-baseline gap-2 mb-6 relative z-10">
          <h2 className="text-5xl font-black italic tracking-tighter uppercase leading-none tabular-nums">
            {stats.treasuryBalance}
          </h2>
          <span className="text-xl font-black italic opacity-60 uppercase tracking-tighter">ETH</span>
        </div>

        <div className="flex justify-end relative z-10">
          <button className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-bigview font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-xl hover:bg-black/80">
            <Plus size={16} strokeWidth={3} />
            Add Money
          </button>
        </div>
      </div>

      {/* ACTION GRID: Swapped neutral icons for Bigview Brand colors */}
      <section className="grid grid-cols-3 gap-4">
         {['Stake', 'Swap', 'Rewards'].map((label, i) => (
           <div key={label} className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white/5 border border-white/5 rounded-bigview flex items-center justify-center mb-2 shadow-xl active:scale-90 transition-all hover:bg-white/10 group">
                {i === 0 && <Plus size={24} className="text-gold-buttons group-hover:scale-110 transition-transform" />}
                {i === 1 && <RefreshCw size={24} className="text-violet-glow group-hover:scale-110 transition-transform" />}
                {i === 2 && <Bell size={24} className="text-emerald-500 group-hover:scale-110 transition-transform" />}
              </div>
              <p className="text-[9px] font-black uppercase tracking-widest text-white/30">{label}</p>
           </div>
         ))}
      </section>

      {/* DATA SECTION: Glassmorphism look */}
      <section className="p-6 bg-white/[0.02] rounded-bigview border border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-6">
            <div className="w-1.5 h-4 bg-gold-buttons rounded-full" />
            <h2 className="text-[10px] uppercase tracking-[0.2em] font-black text-white/30 italic">Protocol Analytics</h2>
        </div>
        <DashboardData stake={stats.stake} />
      </section>
      
      <div className="text-center pt-4 opacity-20">
        <p className="text-[8px] font-black text-white uppercase tracking-[0.4em]">Bigview Treasury Ledger • v2.0</p>
      </div>

    </div>
  </main>
);
}