import React from 'react';
import DashboardData from '@/components/DashboardData';
import BigViewLoGo from '@/components/BigViewLoGo'; 
import { formatUnits } from 'viem';
import BalanceCard from '@/components/BalanceCard'; 

// Fallback to Base Sepolia defaults if env variables are missing
const RPC_URL = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || 'https://sepolia.base.org';
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TREASURY_ADDRESS || '';

async function getDashboardData() {
  if (!CONTRACT_ADDRESS) {
    console.warn("Treasury Address is missing in ENV.");
    return { stake: "0.00", treasuryBalance: "0.00" };
  }

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
      next: { revalidate: 30 } // Cache for 30 seconds
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
    <main className="min-h-screen w-full pb-16 font-inter">
      
      <div className="w-full max-w-2xl mx-auto pt-28 space-y-6">
      
      <BalanceCard />
      
         <BigViewLoGo />
      
          <DashboardData stake={stats.stake} />
          
        
        
        <div className="text-center pt-4 opacity-20">
          <p className="text-[8px] font-black text-white tracking-tight">Bigview Treasury Ledger • v2.0</p>
        </div>

      </div>
    </main>
  );
}