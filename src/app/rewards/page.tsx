'use client';
import React, { useEffect, useState } from 'react';
import { StatisticsGrid } from '@/components/StatisticsGrid';
import { RewardHeader } from '@/components/RewardHeader';
import { RewardHistory } from '@/components/RewardHistory';
import { fetchCallReadOnlyFunction, cvToJSON } from '@stacks/transactions';
import { STACKS_TESTNET } from '@stacks/network';

export default function RewardsPage() {
  // --- 1. Storage Containers (State) ---
  const [liveApy, setLiveApy] = useState("0.0");
  const [liveStaked, setLiveStaked] = useState("0");
  const [message, setMessage] = useState<string | null>("Fetching live data...");
  const [status, setStatus] = useState<'info' | 'error' | 'success'>('info');
  
  // ADD THESE TWO: These fix the "cannot find name" errors
  const [totalEarned, setTotalEarned] = useState("0.00");
  const [pending, setPending] = useState("0.00");

// 2. The Real "Brain" Function
async function getBlockchainData() {
  // Use the network object you already imported at the top
  const network = STACKS_TESTNET; 

  try {
    const response = await fetchCallReadOnlyFunction({
      network, 
      contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '',
      contractName: process.env.NEXT_PUBLIC_CONTRACT_NAME || '',
      functionName: 'dashboard-summary',
      functionArgs: [],
      senderAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '', 
    });

    // 1. Convert Clarity to JSON
    const jsonResponse = cvToJSON(response);

    // 2. Check if the contract returned an (ok ...) or an (err ...)
    // Read-only functions often wrap results in a Response type
    if (jsonResponse.success) {
      const data = jsonResponse.value.value; // Drill down into the 'ok' value

      // 3. Divide by 1,000,000 for decimal STX
      const rewards = Number(data['total-rewards'].value) / 1000000;
      const stakes = Number(data['total-stakes'].value) / 1000000;

      setTotalEarned(rewards.toLocaleString(undefined, { minimumFractionDigits: 2 }));
      setLiveStaked(stakes.toLocaleString());
      setMessage(null); // Clear the "Fetching..." message
    }
  } catch (error) {
    console.error("Sync Error:", error);
    setMessage("Sync failed. Are you on the right network?");
    setStatus('error');
  }
}
  // Run the brain function on load
  useEffect(() => {
    getBlockchainData();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-4 pb-24 flex flex-col gap-6">
    {message && (
        <div className={`p-3 rounded-xl text-sm font-medium ${
          status === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {message}
        </div>
      )}
      {/* 1. Header (Fixed: totalEarned and pending are now defined) */}
      <RewardHeader 
        totalEarned={totalEarned} 
        pending={pending} 
      />

      {/* 2. Grid */}
      <StatisticsGrid 
        apy={liveApy} 
        totalStaked={liveStaked} 
      />

      {/* 3. History */}
      <RewardHistory />
    </main>
  ); // The closing bracket is now properly placed!
}