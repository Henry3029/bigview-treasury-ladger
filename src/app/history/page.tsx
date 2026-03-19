'use client';

import React, { useEffect, useState } from 'react';
import { UserSession, AppConfig } from '@stacks/connect';
import TreasuryTable from "@/components/TreasuryTable";

// 1. INITIALIZE NATIVE STACKS SESSION
const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export default function HistoryPage() {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // 2. CHECK SIGN-IN STATUS NATIVELY
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      // Get the testnet address for your Bigview history
      const address = userData.profile.stxAddress.testnet;
      setUserAddress(address);
    }
  }, []);

  // 3. Simple mount check to avoid hydration mismatch
  if (!isMounted) {
    return <div className="p-8 text-center text-gray-400 animate-pulse">Initializing...</div>;
  }

  return (
    <div className="p-8 pb-24 min-h-screen bg-gray-50">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">
          Transaction History
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          View your recent interactions with the Bigview Treasury.
        </p>
      </div>
      
      {/* 4. Pass the stable address to the table */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        {userAddress ? (
          <TreasuryTable address={userAddress} />
        ) : (
          <div className="p-20 text-center">
            <p className="text-gray-400 font-medium">Please connect your wallet to view history.</p>
          </div>
        )}
      </div>
    </div>
  );
}