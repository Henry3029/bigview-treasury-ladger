import React from 'react';
import WisdomCarousel from '@/components/WisdomCarousel';
import DashboardData from '@/components/DashboardData';
import DashboardButtons from '@/components/DashboardButtons';
import StatusBadge from '@/components/StatusBadge';
import { fetchCallReadOnlyFunction, cvToJSON } from '@stacks/transactions';
import { STACKS_TESTNET } from '@stacks/network';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
const CONTRACT_NAME = process.env.NEXT_PUBLIC_CONTRACT_NAME || '';
const NETWORK = process.env.NEXT_PUBLIC_NETWORK;

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
      functionName: 'dashboard-summary', 
      functionArgs: [],
      senderAddress: CONTRACT_ADDRESS,
    });

    // Use a safer way to parse the JSON
    const parsedData = cvToJSON(proposalResponse);
    
       // Clarity returns nested 'value' objects for each field in the tuple
    const data = parsedData.value;

    // Convert microStacks to STX for the UI
    const totalStakedSTX = Number(data['total-stakes'].value) / 1000000;
    const totalRewardsSTX = Number(data['total-rewards'].value) / 1000000;

    return {
      stake: `${totalStakedSTX.toLocaleString()} STX`,
      reward: `${totalRewardsSTX.toFixed(3)} STX`, // Dynamic from contract!
      proposal: `Total Proposals: ${data['proposals-count'].value}`, // Dynamic!
      votesFor: Number(data['total-members'].value), // Using member count as a placeholder
      votesAgainst: 0, 
      treasuryBalance: `${stxBalance.toLocaleString()} STX`,
    };
  } catch (error) {
    console.error("Dashboard Fetch Error:", error);
    return {
      stake: "0 STX",
      reward: "0.000",
      proposal: "Connection Error",
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