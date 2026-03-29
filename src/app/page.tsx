import React from 'react';
import WelcomeBanner from '@/components/WelcomeBanner';
import DashboardData from '@/components/DashboardData';
import DashboardButtons from '@/components/DashboardButtons';
import StatusBadge from '@/components/StatusBadge';
import BalanceCard from '@/components/BalanceCard'; // 1. Import the new card
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
    <main className="max-w-7xl mx-auto p-4 md:p-10 space-y-6 pb-32 bg-slate-50/50">
      
      {/* 1. WELCOME SECTION */}
      <WelcomeBanner />

      {/* 2. THE NEW OPAY-STYLE BALANCE CARD */}
      {/* We pass the real fetched stake as a prop if you want it to be dynamic */}
    <BalanceCard amount={stats.treasuryBalance} />
      
      {/* 3. VISUAL DATA SECTION (Keep this for the graphs/extra stats) */}
      <section className="relative">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
        <DashboardData stake={stats.stake} />
      </section>

      {/* 4. INTERACTION SECTION */}
      <section className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white">
        <div className="flex items-center gap-2 mb-6 ml-2">
          <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
          <h2 className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
            Vault Quick Actions
          </h2>
        </div>
        <DashboardButtons />
      </section>
      
      <div className="text-center pt-4">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">
          Powered by Bigview Protocol & Base L2
        </p>
      </div>
    </main>
  );
}