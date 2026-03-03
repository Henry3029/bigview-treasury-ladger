import React from 'react';
import DashboardData from '@/components/DashboardData';
import DashboardButtons from '@/components/DashboardButtons';
import StatusBadge from '@/components/StatusBadge';
// 1. Import necessary functions from Stacks.js
import { fetchCallReadOnlyFunction, cvToJSON, principalCV } from '@stacks/transactions';
import { STACKS_TESTNET } from '@stacks/network';

// 2. Define constants
const CONTRACT_ADDRESS = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const CONTRACT_NAME = 'bigview-treasury'; // <-- You must set this
const NETWORK = STACKS_TESTNET;

// 3. Updated function to fetch real-time data
async function getDashboardData() {
  try {
    // --- PART A: Fetch STX Balance (Hiro API) ---
    const balanceRes = await fetch(
      `https://api.testnet.hiro.so/extended/v1/address/${CONTRACT_ADDRESS}/balances`,
      { cache: 'no-store' }
    );
    const balanceData = await balanceRes.json();
    const stxBalance = balanceData.stx.balance / 1_000_000;

    // --- PART B: Read Proposal Data (Contract Call) ---
    // Example: Reading the active proposal title
    const proposalResponse = await fetchCallReadOnlyFunction({
      network: NETWORK,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'dashboard-summary',  // <-- REPLACE WITH YOUR FUNCTION NAME
      functionArgs: [],
      senderAddress: CONTRACT_ADDRESS,
    });

    const proposalTitle = cvToJSON(proposalResponse).value;

    return {
      stake: `${stxBalance.toLocaleString()} STX`,
      reward: "0.005", // Still placeholder until we read rewards
      proposal: proposalTitle || "No active proposal", // Real data!
      votesFor: 540, // Needs another contract call
      votesAgainst: 120, // Needs another contract call
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      stake: "Error",
      reward: "Error",
      proposal: "Error loading",
      votesFor: 0,
      votesAgainst: 0,
    };
  }
}

export default async function Dashboard() {
  const data = await getDashboardData();

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