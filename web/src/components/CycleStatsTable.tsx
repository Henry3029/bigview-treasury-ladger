'use client';
import { useState, useEffect } from 'react';
import { fetchCycleHistory, CycleRow } from '@/services/bigviewCycles'; 
import { getLiveEthPrice } from '@/utils/cryptoPrice';
import { fetchBvwMarketPrice } from '@/services/fetchBvwMarketPrice';
import { fetchLiveExchangeRate } from '@/services/fetchLiveExchangeRate';

type AssetType = 'BVW' | 'cbETH' | 'ETH';

export default function CycleStatsTable() {
  const [activeAsset, setActiveAsset] = useState<AssetType>('BVW');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  
  const [cycleHistory, setCycleHistory] = useState<CycleRow[]>([]);
  const [ethPrice, setEthPrice] = useState<number>(0);
  const [cbEthExchangeRate, setCbEthExchangeRate] = useState<number>(0); // 🚀 FIXED: Cleaned up spacing
  const [bvwExchangeRate, setBvwExchangeRate] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function syncTableData() {
      try {
        const [historyLogs, liveEthPrice, liveCbEthRate, liveBvwPrice] = await Promise.all([
          fetchCycleHistory(),
          getLiveEthPrice(),
          fetchLiveExchangeRate(),
          fetchBvwMarketPrice()
        ]);
        
        setCycleHistory(historyLogs);
        setEthPrice(liveEthPrice);
        setCbEthExchangeRate(liveCbEthRate);     
        setBvwExchangeRate(liveBvwPrice);
      } catch (error) {
        console.error("Failed to sync structural table rows:", error);
      } finally {
        setLoading(false);
      }
    }

    syncTableData();
    
    const interval = setInterval(syncTableData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8 font-mono text-gray-400">
        Syncing historical cycle logs with Base network...
      </div>
    );
  }

  // 🚀 FIXED: Swapped 'CycleHistory' for 'cycleHistory' to match state name
  const visibleRows: cycleRow[] = isExpanded ? cycleHistory : cycleHistory.slice(0, 6);

  // Helper calculation function
  const getConvertedValue = (amountInBvw: number, targetAsset: AssetType) => {
    if (targetAsset === 'BVW') return amountInBvw;
    
    const totalUsdValue = amountInBvw * bvwExchangeRate;
    
    // 🚀 FIXED: Added safety fallback guards to prevent division by zero (Infinity/NaN)
    if (targetAsset === 'ETH') {
      return ethPrice > 0 ? totalUsdValue / ethPrice : 0;
    }
    if (targetAsset === 'cbETH') {
      const cbEthPriceUsd = ethPrice * cbEthExchangeRate;
      return cbEthPriceUsd > 0 ? totalUsdValue / cbEthPriceUsd : 0;
    }
    return amountInBvw;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 text-gray-900 dark:text-white">
      
      {/* DIV 1: Active Asset Selection Tab Bar Layout */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 px-2">
        {(['BVW', 'cbETH', 'ETH'] as AssetType[]).map((asset) => {
          const isActive = activeAsset === asset;
          return (
            <button
              key={asset}
              onClick={() => setActiveAsset(asset)}
              className={`flex-1 text-center py-4 text-base font-bold tracking-wider transition-all uppercase ${
                isActive
                  ? 'border-t-4 border-x-4 border-b-0 border-[#B8860B] text-[#B8860B] bg-[#B8860B]/5 rounded-t-2xl font-extrabold'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              {asset}
            </button>
          );
        })}
      </div>

      {/* DIV 2: Explanatory Copy Headers */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Bigview Ledger Stats per cycle</h1>
        <p className="text-sm text-gray-400 leading-relaxed">
          Native cbETH stacking pool stats from the Bigview Ledger signer. Rewards are paid in ETH.
        </p>
      </div>

      {/* DIV 3: Horizontal Scrolling Data Grid Table Assembly */}
      <div className="w-full overflow-x-auto border border-gray-200 dark:border-white/10 rounded-2xl bg-white dark:bg-black/10">
        <table className="w-full text-left border-collapse min-w-[700px]">
          
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-xs font-bold uppercase tracking-wider text-gray-400">
              <th className="py-4 px-6 text-left">Cycle</th>
              <th className="py-4 px-6 text-left">Dates</th>
              <th className="py-4 px-6 text-right">Net Inflow</th>
              <th className="py-4 px-6 text-right">Total Staked</th>
              <th className="py-4 px-6 text-right text-emerald-400">Rewards</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-white/5 font-mono text-sm">
            {visibleRows.map((row) => {
              const activeInflow = getConvertedValue(row.netInflow, activeAsset);
              const activeTotalStaked = getConvertedValue(row.totalStaked, activeAsset);

              return (
                <tr key={row.cycle} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6 font-bold text-gray-400">#{row.cycle}</td>
                  <td className="py-4 px-6 font-sans text-gray-500 dark:text-gray-300">{row.dates}</td>
                  
                  {/* Net Inflow */}
                  <td className={`py-4 px-6 text-right font-bold ${activeInflow < 0 ? 'text-rose-500' : ''}`}>
                    {activeInflow.toLocaleString(undefined, { maximumFractionDigits: activeAsset === 'BVW' ? 0 : 2 })}
                  </td>

                  {/* Total Staked Balance */}
                  <td className="py-4 px-6 text-right font-extrabold">
                    {Math.floor(activeTotalStaked).toLocaleString()}
                  </td>

                  {/* Rewards Row */}
                  <td className="py-4 px-6 text-right font-bold text-emerald-400">
                    {row.rewards.toFixed(2)} ETH
                  </td>
                </tr>
              );
            })}
          </tbody>

        </table>
      </div>

      {/* DIV 4: Bottom-Right Expand/Collapse Action Panel Toggle */}
      <div className="flex justify-end pt-1">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-300 dark:border-white/10 text-xs font-bold tracking-wide transition-all shadow-sm uppercase text-gray-700 dark:text-gray-300"
        >
          {isExpanded ? (
            <>
              Collapse View
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            </>
          ) : (
            <>
              Expand All Cycles
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </button>
      </div>

    </div>
  );
}