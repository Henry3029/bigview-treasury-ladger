'use client';
import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth'; 
import DefiOpportunities from '@/components/DefiOpportunities';
import TVLDisplay from '@/components/TVLDisplay'; 
import { fetchLiveProtocolStats } from '@/services/bigviewStats'; 
import LoadingSpinner from '@/components/LoadingSpinner'; 

export default function DeFiPage() {
	const { user } = usePrivy();
	const userAddress = user?.wallet?.address as `0x${string}`;
  // Real-time protocol metrics (No placeholders, updates live)
  const [deployedBvw, setDeployedBvw] = useState<number>(0);
  const [holderCount, setHolderCount] = useState<number>(0);
  const [sharePercentage, setSharePercentage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    async function loadRealMetrics() {
      const data = await fetchLiveProtocolStats(userAddress);
      
      // Update your variables with real data on a clean new line!
      setDeployedBvw(data.deployedBvw);
      setSharePercentage(data.sharePercentage);
      setHolderCount(data.holderCount);
      setLoading(false);
    }
    
    loadRealMetrics();

    // If you want it to check for updates on new Base blocks, 
    // you can poll every 12 seconds safely without risking memory leaks!
    const interval = setInterval(loadRealMetrics, 12000);
    return () => clearInterval(interval); // Cleaned up cleanly using the rule you mastered!
  }, [userAddress]);
  
  if (loading) return <LoadingSpinner />
  

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 text-gray-800 dark:text-white">
    
      <TVLDisplay />
      
      {/* Header Section */}
      <header className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Use your cbETH in DeFi</h1>
        <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
          Earn more yield and points on your assets by deploying into DeFi. Find a list of official Bigview Ledger partners below.
        </p>
      </header>

      {/* Clickable Action Box Link */}
      <a 
        href="/staking" 
        className="block w-full p-5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#B8860B]/50 rounded-2xl text-center transition-all group shadow-sm"
      >
        <h3 className="text-xl font-bold text-[#B8860B] group-hover:text-amber-500 transition-colors inline-flex items-center gap-2">
          Stake cbETH to get Started 
          <span className="transform group-hover:translate-x-1 transition-transform">→</span>
        </h3>
      </a>

      {/* 2-Col-Grid, 2 Rows Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 bg-[#B8860B]/20 border border-[#B8860B]/30 rounded-3xl p-6">
        
        {/* Item 1: BVW Deployed */}
        <div className="bg-black/20 p-5 rounded-2xl border border-white/5 space-y-1">
          <p className="text-sm font-medium text-gray-400/70 dark:text-gray-300/60 uppercase tracking-wider">
            BVW deployed in DeFi
          </p>
          <p className="text-3xl font-extrabold font-mono tracking-tight text-white">
            {Math.floor(deployedBvw).toLocaleString()}
          </p>
        </div>

        {/* Item 2: Share Percentage */}
        <div className="bg-black/20 p-5 rounded-2xl border border-white/5 space-y-1">
          <p className="text-sm font-medium text-gray-400/70 dark:text-gray-300/60 uppercase tracking-wider">
            Share of BVW deployed in DeFi
          </p>
          <p className="text-3xl font-extrabold font-mono tracking-tight text-white">
            {sharePercentage}%
          </p>
        </div>

        {/* Item 3: Total Active DeFi Holders */}
        <div className="bg-black/20 p-5 rounded-2xl border border-white/5 space-y-1 md:col-span-2">
          <p className="text-sm font-medium text-gray-400/70 dark:text-gray-300/60 uppercase tracking-wider">
            BVW holders using DeFi
          </p>
          <p className="text-3xl font-extrabold font-mono tracking-tight text-white">
            {holderCount.toLocaleString()}
          </p>
        </div>

      </div>
      
      <DefiOpportunities />
      
<div className="relative mt-12 p-6 bg-[#B8860B]/10 border border-[#B8860B]/20 rounded-3xl overflow-hidden">
  
  {/* 1st Item: + Sign inside a brighter gold circle at top-left */}
  <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-[#FFD700] flex items-center justify-center shadow-lg shadow-[#FFD700]/20">
    <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  </div>

  {/* Content Wrapper pushing items right/down to clear the absolute icon */}
  <div className="pl-12 space-y-3">
    
    {/* 2nd Item: Heading */}
    <h2 className="text-2xl font-bold tracking-tight text-white">
      Build with us
    </h2>

    {/* 3rd Item: Description Paragraph */}
    <p className="text-sm text-gray-400 max-w-xl leading-relaxed">
      Bigview Ledger's mission is to unlock cbETH liquidity for DeFi. Want to integrate BVW in your protocol? Contact us.
    </p>

    {/* 4th Item: Contact Us Button */}
    <div className="pt-2">
      <a 
        href="mailto:contact@bigview.com" // Or your contact form link
        className="inline-flex items-center justify-center py-2.5 px-5 rounded-xl bg-[#B8860B]/20 hover:bg-[#B8860B]/30 border border-[#B8860B]/40 text-white text-sm font-semibold tracking-wide transition-all"
      >
        Contact Us
      </a>
    </div>

  </div>
</div>

    </div>
  );
}