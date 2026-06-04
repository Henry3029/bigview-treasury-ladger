'use client';
import { useState, useEffect } from 'react';
import TVLDisplay from '@/components/TVLDisplay';
import { getLiveTokenPrice } from '@/utils/cryptoPrice'; 
import { calculateRealYieldRates } from '@/utils/protocolCalculations';
export const dynamic = 'force-dynamic';

type AssetType = 'BVW' | 'cbETH' | 'ETH';

export default function StakingPage() {
  const [stakeAmount, setStakeAmount] = useState<string>(''); // CHANGED: Clear empty string for better placeholder behavior
  const [selectedOption, setSelectedOption] = useState<number>(1); // 1, 2, or 3
  const [yieldRates, setYieldRates] = useState<number[]>([0.0352, 0.0291, 0.0310]); // FIXED: Use realistic decimal rates as initial/fallback values
  const [ethPrice, setEthPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    async function loadAllNetworkData() {
      try {
        const [realPrice, realRates] = await Promise.all([
          getLiveTokenPrice(),
          calculateRealYieldRates()
        ]);
        setEthPrice(realPrice);
        setYieldRates(realRates);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading live data, using fallbacks.", error);
        setIsLoading(false); 
      }
    }

    loadAllNetworkData();
  }, []);
        
  // Dynamic calculation engines 
  const parsedAmount = parseFloat(stakeAmount) || 0;
  const usdValue = parsedAmount * ethPrice;
  const potentialYield = parsedAmount * (yieldRates[selectedOption - 1] || 0);

  // Dynamic Array mapping to inject your live data responses!
  const stakingOptions = [
    { id: 1, title: 'Liquid Staking with cbETH Yield', desc: 'Get yield immediately. Stay liquid with BVW token. Earn points.', rate: yieldRates[0] },
    { id: 2, title: 'Liquid Staking with cbETH Yield', desc: 'Earn points and cbETH claimable daily.', rate: yieldRates[1] },
    { id: 3, title: 'Native Staking with ETH Yield', desc: 'Start earning yield next cycle. No liquidity between 2-week cycles.', rate: yieldRates[2] }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 text-gray-800 dark:text-white">
      <TVLDisplay />
      
      {/* Header Section */}
      <header>
        <h1 className="text-4xl font-bold mb-2">Staking ETH</h1>
        <h3 className="text-lg text-gray-500">Start staking ETH, earn yield and unstake at any time, for the best price</h3>
      </header>

      {/* 2-Col-Grid: Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 p-6 rounded-t-2xl border border-white/10">
          <p className="text-sm text-gray-400">Available to stake</p>
          <p className="text-2xl font-mono">0.00</p>
          <p className="text-sm text-gray-500">$0.00</p>
        </div>
        <div className="bg-white/5 p-6 rounded-t-2xl border border-white/10">
          <p className="text-sm text-gray-400">Staked (ETH)</p>
          <p className="text-2xl font-mono">0.00</p>
          <p className="text-sm text-gray-500">$0.00</p>
        </div>
        <div className="bg-white/5 p-6 rounded-t-2xl border border-white/10 col-span-2 sm:col-span-1">
          <p className="text-sm text-gray-400">ETH Price</p>
          <p className="text-2xl font-mono">${ethPrice.toLocaleString()}</p>
          <p className="text-sm text-green-500">+1.2% (24h)</p>
        </div>
      </div>

      {/* Main Interaction Card */}
      <div className="bg-white rounded-3xl p-8 text-black shadow-xl">
        <h2 className="text-2xl font-bold mb-6">Stake Amount</h2>
        
        {/* Input Box */}
        <div className="flex justify-between items-center bg-gray-100 p-4 rounded-2xl mb-8">
          <input 
            type="number" 
            placeholder="0.00"
            value={stakeAmount} // 🚀 FIXED: Controlled input link
            className="bg-transparent text-3xl font-bold outline-none w-full"
            onChange={(e) => setStakeAmount(e.target.value)}
          />
          <div className="text-right min-w-[100px]">
            <p className="font-bold text-xl">ETH</p>
            <p className="text-gray-400">~${usdValue.toFixed(2)}</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-4">Select Staking Option</h3>
        
        {/* Option Cards */}
        <div className="space-y-4">
          {stakingOptions.map((opt) => {
            const isSelected = selectedOption === opt.id;
            const displayApy = `${(opt.rate * 100).toFixed(2)}%`; // Converts e.g. 0.0352 to "3.52%"

            return (
              <div 
                key={opt.id}
                onClick={() => setSelectedOption(opt.id)}
                className={`relative p-6 rounded-2xl border cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-[#B8860B]/20 border-[#B8860B]' 
                    : 'bg-white/50 border-gray-200 hover:border-gray-300'
                }`}
              >
                {isSelected && <div className="absolute top-4 right-4 text-[#B8860B] font-bold">✔</div>}
                <h3 className="font-bold text-lg pr-6">{opt.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{opt.desc}</p>
                <div className="flex justify-between font-mono text-sm">
                  <span className="text-green-600 font-bold">APR {displayApy}</span>
                  <span className="font-bold text-gray-500">BVW</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Calculation Summary */}
        <div className="mt-8 p-6 bg-gray-50 rounded-2xl space-y-2 text-sm font-medium">
          <div className="flex justify-between">
            <span>1. Conversion rate</span>
            <span>1 ETH = 1.00 {selectedOption === 1 ? 'cbETH' : 'ETH'}</span>
          </div>
          <div className="flex justify-between">
            <span>2. Potential Annual Yield</span>
            <span className="font-mono">~{potentialYield.toFixed(4)} ETH</span>
          </div>
          <div className="flex justify-between">
            <span>3. Receive</span>
            <span className="font-mono">~{parsedAmount > 0 ? parsedAmount.toFixed(2) : '0.00'} BVW</span>
          </div>
          <div className="flex justify-between text-blue-600">
            <span>4. Points Multiplier</span>
            <span>1 ETH = 1 point per day</span>
          </div>
        </div>
      </div>
       
    </div>
  );
}