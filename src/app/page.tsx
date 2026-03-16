import React from 'react';
import WisdomCarousel from '@/components/WisdomCarousel';
import WelcomeBanner from '@/components/WelcomeBanner';
import DashboardData from '@/components/DashboardData';
import DashboardButtons from '@/components/DashboardButtons';
import StatusBadge from '@/components/StatusBadge';
import { fetchCallReadOnlyFunction, cvToJSON } from '@stacks/transactions';
import { STACKS_TESTNET } from '@stacks/network';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
const CONTRACT_NAME = process.env.NEXT_PUBLIC_CONTRACT_NAME || '';

async function getDashboardData() {
  try {
    // --- PART A: Fetch STX Balance (Direct from API) ---
    const balanceRes = await fetch(
      `https://api.testnet.hiro.so/extended/v1/address/${CONTRACT_ADDRESS}/balances`,
      { cache: 'no-store' }
    );
    const balanceData = await balanceRes.json();
    const stxBalance = (balanceData?.stx?.balance || 0) / 1_000_000;

    // --- PART B: Read Treasury Data from Contract ---
    const response = await fetchCallReadOnlyFunction({
      network: STACKS_TESTNET,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'dashboard-summary', 
      functionArgs: [],
      senderAddress: CONTRACT_ADDRESS,
    });

    const parsedData = cvToJSON(response);
    const data = parsedData.value;

    // Convert microStacks to STX for the UI
    const totalStakedSTX = Number(data['total-stakes'].value) / 1_000_000;

    return {
      stake: `${totalStakedSTX.toLocaleString()} STX`,
      treasuryBalance: `${stxBalance.toLocaleString()} STX`,
    };
  } catch (error) {
    console.error("Dashboard Fetch Error:", error);
    return {
      stake: "0 STX",
      treasuryBalance: "0 STX",
    };
  }
}

export default async function Dashboard() {
  const stats = await getDashboardData();

  return (
    <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
    {/* 🚀 THE WELCOME BANNER GOES HERE */}
      <WelcomeBanner />
    
      <WisdomCarousel />
      
      {/* Header Section */}
      <div className="flex justify-between items-end border-b pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            BigView Treasury
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Monitoring PoX Staking & sBTC Rewards</p>
        </div>
        <StatusBadge status="online" label="Testnet" />
      </div>

      {/* Visual Data Section - Now passing only what DashboardData expects */}
      <section>
        <DashboardData stake={stats.stake} />
      </section>

      {/* Interaction Section */}
      <section className="bg-white p-2 rounded-3xl">
        <h2 className="text-xs uppercase tracking-[0.2em] font-black text-slate-400 mb-4 ml-4">Quick Actions</h2>
        <DashboardButtons />
      </section>
    </main>
  );
}