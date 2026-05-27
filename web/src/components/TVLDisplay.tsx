'use client';

import { useState, useEffect } from 'react';
import { formatEther, erc20Abi } from 'viem'; // FIXED: Imported standard ERC-20 ABI
import { publicClient } from '@/utils/viemClient'; 
import LoadingSpinner from './LoadingSpinner';
import { TREASURY_ADDRESS, CBETH_TOKEN_ADDRESS } from '@/config/env';

const CONTRACT_ADDRESS = TREASURY_ADDRESS;

export default function TVLDisplay() {
  const [tvl, setTvl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getTVL() {
      try {
        // 1. FIXED: Query the exact cbETH token holdings inside your Treasury, NOT native ETH balance
        const balance = await publicClient.readContract({
          address: CBETH_TOKEN_ADDRESS,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [CONTRACT_ADDRESS],
        });

        // 2. Fetch price from CoinGecko
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        
        // FIXED: Guard clause to catch API rate-limits safely before trying to read JSON data
        if (!response.ok) {
          throw new Error("CoinGecko API failure or rate limit hit");
        }

        const data = await response.json();
        
        // FIXED: Optional chaining protection fallback
        const ethPrice = data?.ethereum?.usd || 3450.00;

        // 3. Calculate USD Value safely
        const totalEth = parseFloat(formatEther(balance));
        const totalUsd = totalEth * ethPrice;

        setTvl(totalUsd.toLocaleString('en-US', { style: 'currency', currency: 'USD' }));
      } catch (error) {
        console.error("TVL Fetch Error:", error);
        setTvl("$0.00"); // Safe fallback UI if API limits hit or RPC hiccups occur
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