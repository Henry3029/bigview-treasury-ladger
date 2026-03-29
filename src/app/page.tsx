import React from 'react';
import WelcomeBanner from '@/components/WelcomeBanner';
import DashboardData from '@/components/DashboardData';
import DashboardButtons from '@/components/DashboardButtons';
import StatusBadge from '@/components/StatusBadge';
import BalanceCard from '@/components/BalanceCard';
import { formatUnits } from 'viem';

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
      treasuryBalance: `${Number(ethBalance).toLocaleString()} ETH`,
    };
    
  } catch (error) {
    console.error("Dashboard Fetch Error:", error);
    return {
      stake: "Updating...",
      treasuryBalance: "Fetching...",
    };
  }
}

export default async function Dashboard() {
  const stats = await getDashboardData();

  return (
    // min-h-screen and w-full ensures the background covers everything
    <main className="min-h-screen w-full bg-slate-50 pb-32">
      
      {/* THE WRAPPER: 
         - max-w-2xl keeps it from getting too wide on tablets
         - px-4 provides the professional gap from the phone edges
         - space-y-5 handles the vertical gaps between cards
      */}
      <div className="w-full max-w-2xl mx-auto px-4 py-6 space-y-5">
        
        {/* 1. WELCOME SECTION */}
        <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
          <WelcomeBanner />
        </div>

        {/* 2. THE NEW OPAY-STYLE BALANCE CARD */}
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
          <BalanceCard amount={stats.treasuryBalance} />
        </div>
        
        {/* 3. VISUAL DATA SECTION */}
        <section className="relative w-full">
          {/* Soft glow effect behind the data card */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
          <DashboardData stake={stats.stake} />
        </section>

        {/* 4. INTERACTION SECTION */}
        <section className="w-full bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6 ml-1">
            <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
            <h2 className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
              Vault Quick Actions
            </h2>
          </div>
          <DashboardButtons />
        </section>
        
        {/* FOOTER TEXT */}
        <div className="text-center pt-8 opacity-40">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
            Powered by Bigview Protocol & Base L2
          </p>
        </div>
      </div>
    </main>
  );
}