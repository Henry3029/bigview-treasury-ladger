'use client';

import React, { useEffect, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { StatisticsGrid } from '@/components/StatisticsGrid';
import WisdomCarousel from '@/components/WisdomCarousel';
import { RewardHeader } from '@/components/RewardHeader';
import { RewardHistory } from '@/components/RewardHistory';
import { RefreshCcw, AlertCircle, Loader2 } from 'lucide-react';

// Import your Treasury ABI
import { abi as treasuryAbi } from '@/constants/abis/BigViewTreasury.json';

export default function RewardsPage() {
  const { address, isConnected } = useAccount();
  
  // --- 1. Storage Containers (State) ---
  const [liveApy] = useState("12.5"); 
  const [liveStaked, setLiveStaked] = useState("0.00");
  const [totalEarned, setTotalEarned] = useState("0.00");
  const [pending, setPending] = useState("0.00");

  const contractAddress = process.env.NEXT_PUBLIC_TREASURY_CONTRACT_ADDRESS as `0x${string}`;

  // 2. The Correct "Brain": Read from the 'members' mapping in your ABI
  const { data, isError, isLoading, refetch } = useReadContract({
    address: contractAddress,
    abi: treasuryAbi,
    functionName: 'members', // Matching the name in your BigViewTreasury.json
    args: [address],
    query: {
      enabled: !!address && isConnected,
    }
  });

  // 3. Process the Blockchain Data from the 'members' mapping
  useEffect(() => {
    if (data && Array.isArray(data)) {
      // The ABI says 'members' returns: [isMember (bool), amount (uint256), unclaimedBVW (uint256)]
      const [isMember, amount, unclaimedBVW] = data;

      if (isMember) {
        // Amount is the ETH/Staked value
        setLiveStaked(formatUnits(amount, 18));
        
        // unclaimedBVW is the pending reward (BVW Token)
        const formattedPending = Number(formatUnits(unclaimedBVW, 18)).toLocaleString(undefined, { 
          minimumFractionDigits: 2,
          maximumFractionDigits: 2 
        });
        
        setPending(formattedPending);
        setTotalEarned(formattedPending); // Setting total as pending for now since it's the live value
      }
    }
  }, [data]);

  return (
    <main className="min-h-screen bg-slate-50 p-6 pb-24 flex flex-col gap-8 max-w-6xl mx-auto">
      {/* 4. Carousel at the very top */}
      <WisdomCarousel />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">Rewards Hub</h1>
          <p className="text-slate-500 text-sm font-medium">Monitor your staking performance on Base.</p>
        </div>
        
        <button 
          onClick={() => refetch()}
          disabled={isLoading}
          className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm active:scale-90"
        >
          {isLoading ? <Loader2 size={20} className="animate-spin" /> : <RefreshCcw size={20} />}
        </button>
      </div>

      {!isConnected && (
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-3 text-blue-700 text-sm font-bold">
          <AlertCircle size={18} />
          Connect your wallet to see your personalized reward stats.
        </div>
      )}

      {isError && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
          <AlertCircle size={18} />
          Error syncing with Base Sepolia. Please try again.
        </div>
      )}

      {/* 5. Header: Total Earned & Pending */}
      <RewardHeader 
        totalEarned={totalEarned} 
        pending={pending} 
      />

      {/* 6. Statistics Grid: APY & Global Staked */}
      <StatisticsGrid 
        apy={liveApy} 
        totalStaked={liveStaked} 
      />

      <div className="mt-4">
        <h3 className="text-lg font-black text-slate-900 mb-6 italic tracking-tight">Recent Yield Events</h3>
        <RewardHistory />
      </div>
    </main>
  );
}