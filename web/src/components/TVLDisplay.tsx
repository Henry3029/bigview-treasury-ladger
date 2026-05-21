'use client';

import { useState, useEffect } from 'react';
import { formatEther } from 'viem';
import { publicClient } from '@/utils/viemClient'; 
import LoadingSpinner from './LoadingSpinner';
import { TREASURY_ADDRESS } from '@/config/env';

const CONTRACT_ADDRESS = TREASURY_ADDRESS;

export default function TVLDisplay() {
  const [tvl, setTvl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getTVL() {
      try {
        // 1. Get the balance of the contract in Wei
        const balance = await publicClient.getBalance({ 
          address: CONTRACT_ADDRESS
        });

        // 2. Fetch price from CoinGecko
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const data = await response.json();
        const ethPrice = data.ethereum.usd;

        // 3. Calculate USD Value safely
        const totalEth = parseFloat(formatEther(balance));
        const totalUsd = totalEth * ethPrice;

        setTvl(totalUsd.toLocaleString('en-US', { style: 'currency', currency: 'USD' }));
      } catch (error) {
        console.error("TVL Fetch Error:", error);
        setTvl("$0.00"); // Safe fallback UI if API limits hit
      } finally {
        setIsLoading(false);
      }
    }

    getTVL();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[100px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    //  FIXED: Switched to flex-col and text-left for professional app dashboard cards
    <div className="bg-white dark:bg-white/5 p-6 flex flex-col items-start justify-center rounded-3xl border border-gray-100 dark:border-gray-800 w-full">
      <p className="text-gray-400 dark:text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
        Total Value Locked
      </p>
      <h2 className="text-3xl font-bold dark:text-white tracking-tight">
        {tvl || "$0.00"}
      </h2>
    </div>
  );
}