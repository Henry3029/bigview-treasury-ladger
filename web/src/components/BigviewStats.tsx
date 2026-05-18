'use client';
import { useState, useEffect } from 'react';
import { fetchLiveTelemetry, TelemetryData } from '@/services/bigviewTelemetry'; 
import { getLiveEthPrice } from '@/utils/cryptoPrice'; 

export default function BigviewStats() {
  // 1. Maintain ONE single, predictable source of truth for your metrics
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    currentBaseBlock: 0,
    bvwInDefi: 0,
    totalBvwSupply: 0,
    uniqueHolders: 0,
    ethPrice: 3450.00, 
    cbEthExchangeRate: 0
  });
  const [loading, setLoading] = useState<boolean>(true);

  // 2. Clean, managed synchronizer loop
  useEffect(() => {
    async function syncTelemetry() {
      try {
        // Fetch both network stats and spot price data concurrently
        const [liveData, liveEthPrice] = await Promise.all([
          fetchLiveTelemetry(),
          getLiveEthPrice()
        ]);

        // Combine them into a single, unified state payload
        setTelemetry({
          ...liveData,
          ethPrice: liveEthPrice // Overwrite the baseline price with the real-time utility feed
        });
      } catch (error) {
        console.error("Telemetry sync cycle failed:", error);
      } finally {
        setLoading(false);
      }
    }

    syncTelemetry();

    // Query your infrastructure service every 4 seconds for sub-second block confirmations
    const interval = setInterval(syncTelemetry, 4000);
    return () => clearInterval(interval); 
  }, []);

  // 3. Unpack your clean telemetry properties cleanly with zero variable naming collisions
  const { currentBaseBlock, bvwInDefi, totalBvwSupply, uniqueHolders, ethPrice, cbEthExchangeRate } = telemetry;

  // --- AUTOMATED ON-CHAIN CALCULATION GRID INTERPOLATIONS ---
  const idleBvwVaults = totalBvwSupply - bvwInDefi;
  const cbEthPriceInUsd = ethPrice * cbEthExchangeRate;
  
  const tvlInUsd = totalBvwSupply * cbEthPriceInUsd;
  const defiTvlInUsd = bvwInDefi * cbEthPriceInUsd;
  const idleTvlInUsd = idleBvwVaults * cbEthPriceInUsd;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] w-full text-emerald-400 font-mono">
        Connecting to Base Rollup Sequence...
      </div>
    );
  }

  // Your return block remains down here completely untouched and operational!
  return (
    <div className="w-full max-w-4xl mx-auto bg-[#142e26] border border-emerald-900/30 rounded-3xl p-6 text-white space-y-8 shadow-xl">
      
      {/* SECTION 1: CORE PROTOCOL METRICS */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight border-b border-white/10 pb-2 text-emerald-400">
          Bigview Ledger Stats
        </h2>
        
        {/* 2x2 Clean Data Display Grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
          
          {/* Stat 1: Total Value Locked */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-emerald-300/60 uppercase tracking-wider">
              TVL
            </p>
            <p className="text-2xl font-extrabold font-mono tracking-tight flex items-center gap-1.5">
              {Math.floor(totalBvwSupply).toLocaleString()}
              <span className="text-xs font-bold text-[#B8860B]">cbETH</span>
            </p>
            <p className="text-sm font-medium font-mono text-white/50">
              ${Math.floor(tvlInUsd).toLocaleString()}
            </p>
          </div>

          {/* Stat 2: Active Yield Flow */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-emerald-300/60 uppercase tracking-wider">
              Deployed TVL
            </p>
            <p className="text-2xl font-extrabold font-mono tracking-tight flex items-center gap-1.5">
              {Math.floor(bvwInDefi).toLocaleString()}
              <span className="text-xs font-bold text-[#B8860B]">cbETH</span>
            </p>
            <p className="text-sm font-medium font-mono text-white/50">
              ${Math.floor(defiTvlInUsd).toLocaleString()}
            </p>
          </div>

          {/* Stat 3: Buffers Waiting Allocation */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-emerald-300/60 uppercase tracking-wider">
              Idle TVL
            </p>
            <p className="text-2xl font-extrabold font-mono tracking-tight flex items-center gap-1.5">
              {Math.floor(idleBvwVaults).toLocaleString()}
              <span className="text-xs font-bold text-[#B8860B]">cbETH</span>
            </p>
            <p className="text-sm font-medium font-mono text-white/50">
              ${Math.floor(idleTvlInUsd).toLocaleString()}
            </p>
          </div>

          {/* Stat 4: Total Ecosystem Users */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-emerald-300/60 uppercase tracking-wider">
              BVW Holders
            </p>
            <p className="text-2xl font-extrabold font-mono tracking-tight">
              {uniqueHolders.toLocaleString()}
            </p>
            <p className="text-sm font-medium font-mono text-white/50">
              Unique Wallets
            </p>
          </div>

        </div>
      </div>

      {/* SECTION 2: PHYSICAL INFRASTRUCTURE DATA */}
      <div className="space-y-4 pt-2">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
            Base Network Infrastructure Stats
          </h2>
          <a 
            href={`https://basescan.org/block/${currentBaseBlock}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs font-medium text-emerald-300/50 hover:text-[#B8860B] transition-colors gap-1 group bg-black/30 px-3 py-1.5 rounded-xl border border-white/5"
          >
            Verify Base Rollup Sequence
            <span className="transform group-hover:translate-x-0.5 transition-transform">↗</span>
          </a>
        </div>

        {/* 2x2 Network Diagnostics Grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-6 pt-2">
          
          {/* Tracker 1: Current Live Block Head */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-emerald-300/60 uppercase tracking-wider">
              Current Block Head
            </p>
            <p className="text-xl font-extrabold font-mono tracking-tight">
              #{currentBaseBlock.toLocaleString()}
            </p>
          </div>

          {/* Tracker 2: Real-time asset value */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-emerald-300/60 uppercase tracking-wider">
              cbETH Market Price
            </p>
            <p className="text-xl font-extrabold font-mono tracking-tight text-[#B8860B]">
              ${cbEthPriceInUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          {/* Tracker 3: Node Validation Layer parameters */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-emerald-300/60 uppercase tracking-wider">
              LST Premium Rate
            </p>
            <p className="text-xl font-extrabold font-mono tracking-tight">
              +{((cbEthExchangeRate - 1) * 100).toFixed(2)}%
            </p>
          </div>

          {/* Tracker 4: Finality latency metrics */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-emerald-300/60 uppercase tracking-wider">
              Sequencer Status
            </p>
            <p className="text-xl font-extrabold tracking-tight text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Active
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}