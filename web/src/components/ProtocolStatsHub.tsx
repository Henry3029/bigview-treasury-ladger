'use client';
import { useState, useEffect } from 'react';
import { fetchLiveHubStats } from '@/services/bigviewStatsHub'; // Import your clean service

interface StatItem {
  id: string;
  title: string;
  description: string;
  cryptoAmount: number;
  cryptoSymbol: string;
  fiatRate: number;
  icon: string;
}

export default function ProtocolStatsHub() {
  // Initialize state with UI presentation rules, setting initial tracking metrics to 0
  const [stats, setStats] = useState<StatItem[]>([
    { id: 'rewards', title: 'Total Rewards', description: 'The total amount of rewards paid out', cryptoAmount: 0, cryptoSymbol: 'ETH', fiatRate: 3450, icon: '🎁' },
    { id: 'cbeth-tvl', title: 'cbETH TVL', description: 'Current amount of ETH deployed in cbETH', cryptoAmount: 0, cryptoSymbol: 'cbETH', fiatRate: 3890, icon: '🛡️' },
    { id: 'bvw-tvl', title: 'Bigview Vault TVL', description: 'Current amount of liquidity in yield pools', cryptoAmount: 0, cryptoSymbol: 'BVW', fiatRate: 0.45, icon: '🦅' },
    { id: 'native-tvl', title: 'Native Staking TVL', description: 'Current amount of ETH natively staked', cryptoAmount: 0, cryptoSymbol: 'ETH', fiatRate: 3450, icon: '⛓️' }
  ]);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function syncStatsWithBlockchain() {
      const updates = await fetchLiveHubStats();
      
      // Map over previous items and update their data fields from the service output
      setStats(prevStats =>
        prevStats.map(item => {
          const match = updates.find(u => u.id === item.id);
          return match 
            ? { ...item, cryptoAmount: match.cryptoAmount, fiatRate: match.fiatRate }
            : item;
        })
      );
      setLoading(false);
    }

    // Initial sync on layout mount
    syncStatsWithBlockchain();

    // Poll for genuine data tracking every 12 seconds (typical Base block time consistency)
    const interval = setInterval(syncStatsWithBlockchain, 12000);
    return () => clearInterval(interval); // Cleaned up cleanly!
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] w-full text-gray-400 font-mono">
        Loading Bigview ledger analytics...
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      
      {/* THE MAGIC LOOP: Mapping over the 4 data blocks dynamically */}
      {stats.map((card) => {
        // Real-time calculation of fiat value based on the token price rate
        const totalFiatValue = card.cryptoAmount * card.fiatRate;

        return (
          <div
            key={card.id}
            className={`flex items-center justify-between p-5 border rounded-2xl transition-all ${
              card.id === 'rewards'
                ? 'bg-[#142e26] border-emerald-900/30 text-white' // Accent color style for top card
                : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white'
            }`}
          >
            {/* Left Side: Icon + Descriptions */}
            <div className="flex items-center gap-4">
              {/* Flexible Circle Badge */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-sm ${
                card.id === 'rewards' ? 'bg-emerald-800/50' : 'bg-gray-100 dark:bg-white/10'
              }`}>
                {card.icon}
              </div>
              
              {/* Meta Texts */}
              <div>
                <h3 className="text-lg font-bold tracking-tight">{card.title}</h3>
                <p className={`text-sm ${card.id === 'rewards' ? 'text-emerald-200/70' : 'text-gray-400/80'} max-w-xs md:max-w-md`}>
                  {card.description}
                </p>
              </div>
            </div>

            {/* Right Side: Balances & Calculations */}
            <div className="text-right space-y-0.5">
              <p className="text-2xl font-extrabold font-mono tracking-tight">
                {card.cryptoAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                <span className={`text-sm font-bold ml-1.5 ${card.id === 'rewards' ? 'text-emerald-400' : 'text-[#B8860B]'}`}>
                  {card.cryptoSymbol}
                </span>
              </p>
              <p className={`text-sm font-medium font-mono ${card.id === 'rewards' ? 'text-emerald-300/60' : 'text-gray-400/70'}`}>
                ${Math.floor(totalFiatValue).toLocaleString()}
              </p>
            </div>

          </div>
        );
      })}

    </div>
  );
}