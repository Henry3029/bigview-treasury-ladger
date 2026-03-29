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
    // 1. Full-width background and standard padding
    <main className="min-h-screen w-full bg-slate-50 pb-32">
      
      {/* 2. THE WRAPPER: Matches Dashboard & Stake for total consistency */}
      <div className="w-full max-w-2xl mx-auto px-4 py-6 space-y-6">
        
        {/* 3. Carousel at the very top */}
        <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
          <WisdomCarousel />
        </div>
        
        {/* Header Section */}
        <div className="flex items-center justify-between px-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Rewards Hub</h1>
            <p className="text-slate-500 text-[10px] md:text-sm font-bold uppercase tracking-widest opacity-70">Monitor performance on Base</p>
          </div>
          
          <button 
            onClick={() => refetch()}
            disabled={isLoading}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm active:scale-90"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <RefreshCcw size={20} />}
          </button>
        </div>

        {/* Dynamic Alerts */}
        {!isConnected && (
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-[1.5rem] flex items-center gap-3 text-blue-700 text-[11px] font-black uppercase tracking-tight">
            <AlertCircle size={18} />
            Connect wallet for personalized stats
          </div>
        )}

        {isError && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-[1.5rem] flex items-center gap-3 text-red-600 text-[11px] font-black uppercase tracking-tight">
            <AlertCircle size={18} />
            Error syncing with Base Sepolia
          </div>
        )}

        {/* 4. Main Stats Section */}
        <div className="space-y-4">
          <RewardHeader 
            totalEarned={totalEarned} 
            pending={pending} 
          />
          
          <StatisticsGrid 
            apy={liveApy} 
            totalStaked={liveStaked} 
          />
        </div>

        {/* 5. History Section */}
        <div className="pt-4">
          <div className="flex items-center gap-2 mb-6 ml-1">
            <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Recent Yield Events</h3>
          </div>
          <RewardHistory />
        </div>

        {/* Branding Footer */}
        <div className="text-center pt-8 opacity-30">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
            Bigview Protocol • Base L2
          </p>
        </div>
      </div>
    </main>
  );
}