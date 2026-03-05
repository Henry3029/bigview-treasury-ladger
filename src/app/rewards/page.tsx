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
  
  // ADD THESE TWO: These fix the "cannot find name" errors
  const [totalEarned, setTotalEarned] = useState("0.00");
  const [pending, setPending] = useState("0.00");

// 2. The Real "Brain" Function
async function getBlockchainData() {
  try {
    const response = await fetchCallReadOnlyFunction({
      network: STACKS_TESTNET,
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'bigview-treasury',
      functionName: 'dashboard-summary', // Updated name
      functionArgs: [],
      senderAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    });

    const result = cvToJSON(response).value;

    // The names here MUST match your .clar file exactly
    // We divide by 1_000_000 to convert micro-STX to real STX
    const rewards = result['total-rewards'].value / 1_000_000;
    const stakes = result['total-stakes'].value / 1_000_000;

    // Update your screen
    setTotalEarned(rewards.toLocaleString());
    setLiveStaked(stakes.toLocaleString());
    
  } catch (error) {
    console.error("Error fetching Dashboard Summary:", error);
  }
}
  // Run the brain function on load
  useEffect(() => {
    getBlockchainData();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-4 pb-24 flex flex-col gap-6">
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