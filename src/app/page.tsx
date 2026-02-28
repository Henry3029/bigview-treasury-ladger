// src/app/dashboard/page.tsx
import React from 'react';
// Import your components
import DashboardData from '@/components/DashboardData';
import DashboardButtons from '@/components/DashboardButtons';
import StatusBadge from '@/components/StatusBadge';

export default function Dashboard() {
  // --- This is where you would normally fetch data ---
  // const { data } = useBlockchainData(); 
  
  // Placeholder data for illustration
  const mockData = {
    stake: "1,500",
    reward: "0.005",
    proposal: "Increase max block size",
    votesFor: 540,
    votesAgainst: 120,
  };

  const handleAction = () => alert("Transaction initiated!");

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 1. Header Area with Badge */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">POX Dashboard</h1>
          <StatusBadge status="online" label="Mainnet" />
        </div>

        {/* 2. Data Display Card */}
        <DashboardData 
          stake={mockData.stake}
          reward={mockData.reward}
          proposal={mockData.proposal}
          votesFor={mockData.votesFor}
          votesAgainst={mockData.votesAgainst}
        />

        {/* 3. Action Buttons */}
        <DashboardButtons 
          onStake={handleAction}
          onUnstake={handleAction}
          onClaim={handleAction}
          onProposal={handleAction}
          onVote={handleAction}
        />
      </div>
    </main>
  );
}