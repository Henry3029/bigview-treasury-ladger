import React from 'react';
import DashboardData from '@/components/DashboardData';
import DashboardButtons from '@/components/DashboardButtons';
import StatusBadge from '@/components/StatusBadge';

// 1. Fetch the data directly in the page (Server Component)
async function getStats() {
  const TREASURY_ADDR = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
  const res = await fetch(
    `https://api.testnet.hiro.so/extended/v1/address/${TREASURY_ADDR}/balances`,
    { cache: 'no-store' }
  );
  const data = await res.json();
  
  return {
    stake: (data.stx.balance / 1_000_000).toLocaleString(),
    reward: "0.00", // Placeholder or calculate from data
    proposal: "Active: Improve UI",
    votesFor: 100,
    votesAgainst: 10
  };
}

export default async function HomePage() {
  const stats = await getStats();

  return (
    <main className="max-w-7xl mx-auto p-8 space-y-10">
      {/* Header Section */}
      <div className="flex justify-between items-center border-b pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            BigView Treasury
          </h1>
          <p className="text-gray-500 mt-2 text-lg">Manage your PoX assets and voting power.</p>
        </div>
        <StatusBadge status="online" label="Testnet" />
      </div>

      {/* 2. Visual Data Section */}
      <section>
        <DashboardData 
          stake={stats.stake}
          reward={stats.reward}
          proposal={stats.proposal}
          votesFor={stats.votesFor}
          votesAgainst={stats.votesAgainst}
        />
      </section>

      {/* 3. Interaction Section */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
        <DashboardButtons />
      </section>
    </main>
  );
}