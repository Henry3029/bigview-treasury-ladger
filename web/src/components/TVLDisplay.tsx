'use client';

import { useState, useEffect } from 'react';
import { formatEther } from 'viem';
import { publicClient } from '@/utils/viemClient'; // Your existing viem setup
import LoadingSpinner from './LoadingSpinner';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TREASURY_ADDRESS;

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

        // 2. Fetch price (Simple example using a public API)
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const data = await response.json();
        const ethPrice = data.ethereum.usd;

        // 3. Calculate USD Value
        const totalEth = parseFloat(formatEther(balance));
        const totalUsd = totalEth * ethPrice;

        setTvl(totalUsd.toLocaleString('en-US', { style: 'currency', currency: 'USD' }));
      } catch (error) {
        console.error("TVL Fetch Error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    getTVL();
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="bg-white dark:bg-white/5 p-4 flex items-center justify-center gap-3 rounded-3xl border border-gray-100 dark:border-gray-800">
      <p className="text-gray-500 text-sm font-medium mb-1">Total Value Locked</p>
      <h2 className="text-3xl font-bold dark:text-white">{tvl || "$0.00"}</h2>
    </div>
  );
}