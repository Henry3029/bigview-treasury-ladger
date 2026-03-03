'use client';
import React, { useEffect, useState } from 'react';
import { StatisticsGrid } from '@/components/StatisticsGrid';
import { RewardHeader } from '@/components/RewardHeader';
import { RewardHistory } from '@/components/RewardHistory';

export default function RewardsPage() {
  // These are the "Storage Containers"
  const [liveApy, setLiveApy] = useState("0.0");
  const [liveStaked, setLiveStaked] = useState("0");

  // This is the "Brain" function you need to add
  async function getBlockchainData() {
    try {
      console.log("Fetching from blockchain...");
      // For now, we simulate the fetch. Later, we put the Stacks code here.
      setLiveApy("12.5"); 
      setLiveStaked("50,000");
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }

  // This tells the app to run the "Brain" as soon as the user opens the page
  useEffect(() => {
    getBlockchainData();
  }, []);

  return (
  <main className="min-h-screen bg-gray-50 p-4 pb-24">
    {/* 1. Header is at the top (The OPay "Wallet" look) */}
    <RewardHeader 
      totalEarned={totalEarned} 
      pending={pending} 
    />

    {/* 2. Grid comes next (The details) */}
    <StatisticsGrid 
      apy={liveApy} 
      totalStaked={liveStaked} 
    />

    {/* 3. History is at the bottom (The list) */}
    <RewardHistory />
  </main>
);