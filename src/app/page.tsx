import React from 'react';
import WisdomCarousel from '@/components/WisdomCarousel';
import DashboardData from '@/components/DashboardData';
import DashboardButtons from '@/components/DashboardButtons';
import StatusBadge from '@/components/StatusBadge';
import { fetchCallReadOnlyFunction, cvToJSON } from '@stacks/transactions';
import { STACKS_TESTNET } from '@stacks/network';

const CONTRACT_ADDRESS = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const CONTRACT_NAME = 'bigview-treasury'; 
const NETWORK = STACKS_TESTNET;

async function getDashboardData() {
  try {
    // --- PART A: Fetch STX Balance ---
    const balanceRes = await fetch(
      `https://api.testnet.hiro.so/extended/v1/address/${CONTRACT_ADDRESS}/balances`,
      { cache: 'no-store' }
    );
    const balanceData = await balanceRes.json();
    const stxBalance = (balanceData?.stx?.balance || 0) / 1_000_000;

    // --- PART B: Read Proposal Data ---
    const proposalResponse = await fetchCallReadOnlyFunction({
      network: NETWORK,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-active-proposal', // Updated to a standard name
      functionArgs: [],
      senderAddress: CONTRACT_ADDRESS,
    });

    // Use a safer way to parse the JSON
    const parsedData = cvToJSON(proposalResponse);
    // If the contract returns a { value: "Title" } or just "Title"
    const proposalTitle = parsedData?.value?.value || parsedData?.value || "No active proposal";

    return {
      stake: `${stxBalance.toLocaleString()} STX`,
      reward: "0.005", 
      proposal: proposalTitle, 
      votesFor: 540, 
      votesAgainst: 120,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      stake: "0 STX",
      reward: "0.000",
      proposal: "Connect Wallet to Load",
      votesFor: 0,
      votesAgainst: 0,
    };
  }
}

// Next.js 15 requires "await" components to be handled carefully
export default async function Dashboard() {
  const stats = await getDashboardData();

  return (
    <main className="max-w-7xl mx-auto p-8 space-y-10">
      <WisdomCarousel />
      
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

      {/* Visual Data Section */}
      <section>
        <DashboardData 
          stake={stats.stake}
          reward={stats.reward}
          proposal={stats.proposal}
          votesFor={stats.votesFor}
          votesAgainst={stats.votesAgainst}
        />
      </section>

      {/* Interaction Section */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
        <DashboardButtons />
      </section>
    </main>
  );
}