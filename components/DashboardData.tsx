// src/components/DashboardData.tsx
"use client";
import { useEffect, useState } from 'react';
import { DashboardSummary } from '@/types/contract'
import { callReadOnlyFunction, cvToJSON } from '@stacks/transactions';
import { STACKS_TESTNET } from '@stacks/network'; // or StacksMainnet()
import { usePrivy } from '@privy-io/react-auth';

export default function DashboardData() {
  const [summary, setSummary] = useState<any>(null);
  const { user } = usePrivy();

  useEffect(() => {
    async function fetchSummary() {
      if (!user) return;

      const network = STACKS_TESTNET;
      // Ensure these are in your .env.local
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
      const contractName = process.env.NEXT_PUBLIC_CONTRACT_NAME!;

      try {
        const response = await callReadOnlyFunction({
          network,
          contractAddress,
          contractName,
          functionName: 'dashboard-summary',
          functionArgs: [], // No arguments needed
          senderAddress: user.wallet?.address!,
        });
        
        // Convert Clarity Value to JSON
        setSummary(cvToJSON(response));
        console.log("Contract Data:", cvToJSON(response));
      } catch (error) {
        console.error("Error fetching summary:", error);
      }
    }

    fetchSummary();
  }, [user]);

  if (!summary) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-2 gap-4 p-6 bg-white rounded-xl shadow-sm border">
      <div>Total Members: <span className="font-bold">{summary.value['total-members'].value}</span></div>
      <div>Total Staked: <span className="font-bold">{summary.value['total-stakes'].value} STX</span></div>
      {/* ... add more fields ... */}
    </div>
  );
}