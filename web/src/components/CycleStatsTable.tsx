'use client';
import { useState, useEffect } from 'react';

type AssetType = 'BVW' | 'cbETH' | 'ETH';

interface CycleRow {
  cycle: number;
  dates: string;
  netInflow: number; // Native token amount
  totalStaked: number; // Native token amount
  rewards: number; // Always paid in ETH
}

export default function CycleStatsTable() {
  // 1. Manage Active Selected Asset State
  const [activeAsset, setActiveAsset] = useState<AssetType>('BVW');
  
  // 2. Manage Table Expand / Collapse State
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // 3. Dynamic Live Token Price Tracking for Real-Time Math Calculations
  const [ethPrice, setEthPrice] = useState<number>(3450);
  const cbEthExchangeRate = 1.1294; // 1 cbETH = 1.1294 ETH
  const bvwExchangeRate = 0.45; // 1 BVW = $0.45 USD

  // Simulate subtle real-time pricing updates
  useEffect(() => {
    const priceInterval = setInterval(() => {
      setEthPrice(prev => prev + (Math.random() - 0.5) * 4);
    }, 5000);
    return () => clearInterval(priceInterval);
  }, []);

  // 4. Raw Base Data (Static Cycle history that recalculates math live depending on asset selection)
  const baseCycleHistory: CycleRow[] = [
    { cycle: 52, dates: "May 10 - May 13", netInflow: 450210, totalStaked: 20245282, rewards: 14.25 },
    { cycle: 51, dates: "May 06 - May 09", netInflow: 389100, totalStaked: 19795072, rewards: 13.90 },
    { cycle: 50, dates: "May 02 - May 05", netInflow: 512400, totalStaked: 19405972, rewards: 14.10 },
    { cycle: 49, dates: "Apr 28 - May 01", netInflow: -120500, totalStaked: 18893572, rewards: 13.45 },
    { cycle: 48, dates: "Apr 24 - Apr 27", netInflow: 642150, totalStaked: 19014072, rewards: 13.88 },
    { cycle: 47, dates: "Apr 20 - Apr 23", netInflow: 298400, totalStaked: 18371922, rewards: 12.95 },
    { cycle: 46, dates: "Apr 16 - Apr 19", netInflow: 411200, totalStaked: 18073522, rewards: 12.80 },
    { cycle: 45, dates: "Apr 12 - Apr 15", netInflow: 185000, totalStaked: 17662322, rewards: 12.15 },
  ];

  // Slice the list depending on whether the user has toggled Expand or Collapse
  const visibleRows = isExpanded ? baseCycleHistory : baseCycleHistory.slice(0, 6);

  // Helper calculation function to convert baseline tokens depending on the active selection tab
  const getConvertedValue = (amountInBvw: number, targetAsset: AssetType) => {
    if (targetAsset === 'BVW') return amountInBvw;
    
    // Calculate raw dollar value first to maintain strict structural financial accounting parity
    const totalUsdValue = amountInBvw * bvwExchangeRate;
    
    if (targetAsset === 'ETH') {
      return totalUsdValue / ethPrice;
    }
    if (targetAsset === 'cbETH') {
      const cbEthPriceUsd = ethPrice * cbEthExchangeRate;
      return totalUsdValue / cbEthPriceUsd;
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
          
          {/* Table Heads */}
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-xs font-bold uppercase tracking-wider text-gray-400">
              <th className="py-4 px-6 text-left">Cycle</th>
              <th className="py-4 px-6 text-left">Dates</th>
              <th className="py-4 px-6 text-right">Net Inflow</th>
              <th className="py-4 px-6 text-right">Total Staked</th>
              <th className="py-4 px-6 text-right text-emerald-400">Rewards</th>
            </tr>
          </thead>

          {/* Table Bodies with Live Conversion Calculus */}
          <tbody className="divide-y divide-gray-200 dark:divide-white/5 font-mono text-sm">
            {visibleRows.map((row) => {
              // Dynamically adjust math totals natively depending on asset filter states selected above
              const activeInflow = getConvertedValue(row.netInflow, activeAsset);
              const activeTotalStaked = getConvertedValue(row.totalStaked, activeAsset);

              return (
                <tr key={row.cycle} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6 font-bold text-gray-400">#{row.cycle}</td>
                  <td className="py-4 px-6 font-sans text-gray-500 dark:text-gray-300">{row.dates}</td>
                  
                  {/* Net Inflow (handles negative red withdrawals cleanly) */}
                  <td className={`py-4 px-6 text-right font-bold ${activeInflow < 0 ? 'text-rose-500' : ''}`}>
                    {activeInflow.toLocaleString(undefined, { maximumFractionDigits: activeAsset === 'BVW' ? 0 : 2 })}
                  </td>

                  {/* Total Staked Balance */}
                  <td className="py-4 px-6 text-right font-extrabold">
                    {Math.floor(activeTotalStaked).toLocaleString()}
                  </td>

                  {/* Rewards Row - Always hard locked strictly to raw Ethereum yield performance */}
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