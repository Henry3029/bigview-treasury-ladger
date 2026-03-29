import React from 'react';
import DashboardData from '@/components/DashboardData';
import DashboardButtons from '@/components/DashboardButtons';
import BalanceCard from '@/components/BalanceCard';
import { formatUnits } from 'viem';
import { Bell, User, Info, Plus } from 'lucide-react';

const RPC_URL = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || 'https://sepolia.base.org';
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TREASURY_CONTRACT_ADDRESS || '';

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
    return {
      stake: "0.00",
      treasuryBalance: "0.00",
    };
  }
}

export default async function Dashboard() {
  const stats = await getDashboardData();

  return (
    // 1. BACKGROUND: Using the Near-Black OPay theme from your CSS
    <main className="min-h-screen w-full bg-[#060606] text-white pb-32 font-inter">
      
      <div className="w-full max-w-2xl mx-auto px-4 py-6 space-y-6">
        
        {/* 2. TOP HEADER: Hi Henry / Profile / Notification */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-neutral-800 rounded-2xl flex items-center justify-center border border-white/5">
                <User size={20} className="text-neutral-500" />
             </div>
             <div>
                <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Welcome back</p>
                <h1 className="text-lg font-black italic uppercase tracking-tighter leading-none">Hi, Henry</h1>
             </div>
          </div>
          <button className="p-2.5 bg-neutral-900 rounded-2xl text-neutral-400 border border-white/5">
            <Bell size={20} />
          </button>
        </div>

        {/* 3. THE GOLDEN BALANCE CARD: Styled exactly like the OPay UI */}
        <div className="opay-gold-card relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 opacity-80">
              <Info size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Available Balance</span>
            </div>
            <p className="text-[10px] font-black italic uppercase tracking-tighter bg-black/20 px-2 py-1 rounded-lg">Base Sepolia</p>
          </div>

          <div className="flex items-baseline gap-2 mb-6">
            <h2 className="text-5xl font-black italic tracking-tighter uppercase leading-none tabular-nums">
              {stats.treasuryBalance}
            </h2>
            <span className="text-xl font-black italic opacity-80 uppercase tracking-tighter">ETH</span>
          </div>

          <div className="flex justify-end">
            <button className="flex items-center gap-2 px-6 py-3 bg-neutral-900 text-amber-400 rounded-full font-black text-[10px] uppercase tracking-[0.15em] shadow-2xl active:scale-95 transition-all">
              <Plus size={16} strokeWidth={3} />
              Add Money
            </button>
          </div>
        </div>
        
        {/* 4. ACTION TILES: The 3-column grid for Core Actions */}
        <section className="grid grid-cols-3 gap-4">
           <div className="opay-action-tile">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mb-1">
                <Plus size={24} />
              </div>
              <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Stake</p>
           </div>
           <div className="opay-action-tile">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mb-1">
                <Info size={24} />
              </div>
              <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Swap</p>
           </div>
           <div className="opay-action-tile">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mb-1">
                <Bell size={24} />
              </div>
              <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Rewards</p>
           </div>
        </section>

        {/* 5. DATA SECTION */}
        <section className="glass-card">
          <div className="flex items-center gap-2 mb-6">
             <div className="w-1.5 h-4 bg-amber-500 rounded-full" />
             <h2 className="text-[10px] uppercase tracking-[0.2em] font-black text-neutral-500">
               Protocol Analytics
             </h2>
          </div>
          <DashboardData stake={stats.stake} />
        </section>
        
        {/* POWERED BY TEXT */}
        <div className="text-center pt-4 opacity-30">
          <p className="text-[8px] font-black text-neutral-500 uppercase tracking-[0.4em]">
            Bigview Treasury-Ledger Protocol v2.0
          </p>
        </div>

      </div>
    </main>
  );
}