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
    // Added pt-24 to ensure content starts safely below the fixed header
    <main className="min-h-screen w-full bg-slate-50 pt-24 pb-32 font-inter">
      
      {/* THE WRAPPER: Consistent width across all pages */}
      <div className="w-full max-w-2xl mx-auto px-6 space-y-6">
        
        {/* Wisdom Carousel with smooth fade-in */}
        <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-700">
          <WisdomCarousel />
        </div>
        
        {/* Header Section: Minimalist and Bold */}
        <div className="flex items-center justify-between px-1 mt-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Rewards Hub</h1>
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] opacity-80">Syncing with Base Sepolia</p>
          </div>
          
          <button 
            onClick={() => refetch()}
            disabled={isLoading}
            // Updated to rounded-2xl to match Header icons
            className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm active:scale-90"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <RefreshCcw size={18} />}
          </button>
        </div>

        {/* Dynamic Alerts: Updated to rounded-2xl */}
        {!isConnected && (
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-3 text-blue-700 text-[10px] font-black uppercase tracking-tight italic">
            <AlertCircle size={16} className="text-blue-400" />
            Connect wallet for personalized stats
          </div>
        )}

        {isError && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-[10px] font-black uppercase tracking-tight italic">
            <AlertCircle size={16} className="text-red-400" />
            Error syncing with Base Sepolia
          </div>
        )}

        {/* Main Stats Section: Ensure sub-components (RewardHeader/StatisticsGrid) use rounded-3xl internaly */}
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

        {/* History Section: Sleek Labeling */}
        <div className="pt-6">
          <div className="flex items-center gap-2 mb-6 ml-1">
            <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Recent Yield Events</h3>
          </div>
          <RewardHistory />
        </div>

        {/* Branding Footer */}
        <div className="text-center pt-10 opacity-20">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.5em]">
            Bigview Protocol • Base L2
          </p>
        </div>
      </div>
    </main>
  );
 }