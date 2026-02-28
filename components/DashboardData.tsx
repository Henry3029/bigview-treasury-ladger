// src/components/DashboardData.tsx
import React from 'react';

// 1. Define the shape of your data
interface DashboardDataProps {
  stake: number | string;
  reward: number | string;
  proposal: string;
  votesFor: number;
  votesAgainst: number;
}

// 2. Apply the interface to the component
export default function DashboardData({ 
  stake, 
  reward, 
  proposal, 
  votesFor, 
  votesAgainst 
}: DashboardDataProps) {
  return (
    <div className="space-y-2 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <p className="flex justify-between">
        <span className="text-gray-500">Current Stake:</span> 
        <span className="font-bold text-orange-600">{stake} STX</span>
      </p>
      <p className="flex justify-between">
        <span className="text-gray-500">Available Reward:</span> 
        <span className="font-bold text-green-600">{reward} BTC</span>
      </p>
      
      <hr className="my-4 border-gray-100" />
      
      <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Governance</p>
      <p className="flex justify-between">
        <span className="text-gray-500">Latest Proposal:</span> 
        <span className="font-medium italic">"{proposal}"</span>
      </p>
      <div className="flex gap-4 mt-2">
        <p className="text-sm">
          <span className="text-green-500">✔ For:</span> {votesFor}
        </p>
        <p className="text-sm">
          <span className="text-red-500">✖ Against:</span> {votesAgainst}
        </p>
      </div>
    </div>
  );
}