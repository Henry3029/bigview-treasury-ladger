"use client";

import React from 'react';
import { usePrivy } from "@privy-io/react-auth";
import TreasuryTable from "@/components/TreasuryTable";

export default function HistoryPage() {
  // 1. Swap for Privy
  const { user, authenticated, ready } = usePrivy();
  
  // 2. Safely extract the Stacks address
  const stxAccount = user?.linkedAccounts.find(
    (acc) => acc.type === 'wallet' && acc.connectorType === 'stacks'
  );
  
  const userAddress = authenticated ? stxAccount?.address : null;

  // 3. Show a loading state while Privy initializes
  if (!ready) return <div className="p-8 text-center text-gray-400 animate-pulse">Loading history...</div>;

  return (
    <div className="p-8 pb-24 min-h-screen bg-gray-50">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Transaction History</h1>
        <p className="text-gray-500 text-sm mt-1">View your recent interactions with the Treasury.</p>
      </div>
      
      {/* 4. Pass the stable address to the table */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <TreasuryTable address={userAddress} />
      </div>
    </div>
  );
}