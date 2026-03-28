import React from 'react';
import WisdomCarousel from '@/components/WisdomCarousel';
import WelcomeBanner from '@/components/WelcomeBanner';
import DashboardData from '@/components/DashboardData';
import DashboardButtons from '@/components/DashboardButtons';
import StatusBadge from '@/components/StatusBadge';
import { formatUnits } from 'viem';

// We use a simple fetch to the RPC for Server Components or a Public Client
const RPC_URL = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || 'https://sepolia.base.org';
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TREASURY_CONTRACT_ADDRESS || '';

async function getDashboardData() {
  try {
    // 1. Fetch ETH Balance of the Treasury Contract
    const balanceRes = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [CONTRACT_ADDRESS, 'latest'],
        id: 1,
      }),
      next: { revalidate: 30 } // Refresh every 30 seconds
    });
    
    const balanceJson = await balanceRes.json();
    const rawBalance = balanceJson.result || "0x0";
    const ethBalance = formatUnits(BigInt(rawBalance), 18);

    // 2. Mock or Fetch Global Staked (Example RPC call for a View function)
    // For simplicity in this server component, we'll format the ETH balance
    // In a full setup, you'd use 'eth_call' here to hit your 'totalStaked()' function.

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
    <main className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 pb-32 bg-slate-50/50">
      {/*  THE WELCOME BANNER */}
      <WelcomeBanner />
    
      <WisdomCarousel />
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-200 pb-8 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">
              Bigview Treasury
            </h1>
            <StatusBadge status="online" label="Base Sepolia" />
          </div>
          <p className="text-slate-500 mt-2 text-sm font-medium">
            Real-time Monitoring of <span className="text-blue-600 font-bold">ETH Staking</span> & Yield Rewards
          </p>
        </div>
      </div>

      {/* Visual Data Section */}
      <section className="relative">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
        <DashboardData stake={stats.stake} />
      </section>

      {/* Interaction Section */}
      <section className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white">
        <div className="flex items-center gap-2 mb-6 ml-2">
          <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
          <h2 className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
            Vault Quick Actions
          </h2>
        </div>
        <DashboardButtons />
      </section>
      
      {/* Branding Footer for Dashboard */}
      <div className="text-center pt-4">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">
          Powered by Bigview Protocol & Base L2
        </p>
      </div>
    </main>
  );
}