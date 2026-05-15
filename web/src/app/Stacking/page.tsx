'use client';
import { useState } from 'react';
import TVLDefault from '../components /TVLDefault';

export default function StakingPage() {
  const [stakeAmount, setStakeAmount] = useState<string>('0.00');
  const [selectedOption, setSelectedOption] = useState<number>(1); // 1, 2, or 3

  // Dynamic calculations based on input
  const ethPrice = 2545.30; // Fetch this from your CoinGecko util
  const usdValue = (parseFloat(stakeAmount) || 0) * ethPrice;
  const yieldRates = [0.0352, 0.0291, 0.0310]; // APYs for 1, 2, 3
  const potentialYield = (parseFloat(stakeAmount) || 0) * yieldRates[selectedOption - 1];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 text-gray-800 dark:text-white">
    <TVLDefault />
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
        <div className="bg-white/5 p-6 rounded-t-2xl border border-white/10 col-span-1">
          <p className="text-sm text-gray-400">ETH Price</p>
          <p className="text-2xl font-mono">${ethPrice.toLocaleString()}</p>
          <p className="text-sm text-green-500">+1.2% (24h)</p>
        </div>
      </div>

      {/* Main Interaction Div */}
      <div className="bg-white rounded-t-3xl p-8 text-black shadow-xl">
        <h2 className="text-2xl font-bold mb-6">Stake Amount</h2>
        
        {/* Input Box */}
        <div className="flex justify-between items-center bg-gray-100 p-4 rounded-2xl mb-8">
          <input 
            type="number" 
            placeholder="0.00"
            className="bg-transparent text-3xl font-bold outline-none w-full"
            onChange={(e) => setStakeAmount(e.target.value)}
          />
          <div className="text-right">
            <p className="font-bold text-xl">ETH</p>
            <p className="text-gray-400">~${usdValue.toFixed(2)}</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-4">Select Staking Option</h3>
        
        {/* Option Cards */}
        <div className="space-y-4">
          {[
            { id: 1, title: 'Liquid Staking with stETH Yield', desc: 'Get yield immediately. Stay liquid with BVW token. Earn points.', apy: '3.52%' },
            { id: 2, title: 'Liquid Staking with cbBTC/cbETH Yield', desc: 'Earn points and cbBTC/cbETH claimable daily.', apy: '2.91%' },
            { id: 3, title: 'Native Staking with ETH Yield', desc: 'Start earning yield next cycle. No liquidity between 2-week cycles.', apy: '3.10%' }
          ].map((opt) => (
            <div 
              key={opt.id}
              onClick={() => setSelectedOption(opt.id)}
              className={`relative p-6 rounded-2xl border cursor-pointer transition-all ${
                selectedOption === opt.id 
                ? 'bg-[#B8860B]/20 border-[#B8860B]' 
                : 'bg-white/50 border-gray-200'
              }`}
            >
              {selectedOption === opt.id && <div className="absolute top-4 right-4 text-[#B8860B]">✔</div>}
              <h3 className="font-bold text-lg">{opt.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{opt.desc}</p>
              <div className="flex justify-between font-mono text-sm">
                <span className="text-green-600">APR {opt.apy}</span>
                <span className="font-bold">BVW</span>
              </div>
            </div>
          ))}
        </div>

        {/* Calculation Summary */}
        <div className="mt-8 p-6 bg-gray-50 rounded-2xl space-y-2 text-sm font-medium">
          <div className="flex justify-between"><span>1. Conversion rate</span><span>1 ETH = 1.00 {selectedOption === 1 ? 'stETH' : 'ETH'}</span></div>
          <div className="flex justify-between"><span>2. Potential Annual Yield</span><span>~{potentialYield.toFixed(4)} ETH</span></div>
          <div className="flex justify-between"><span>3. Receive</span><span>~{stakeAmount} BVW</span></div>
          <div className="flex justify-between text-blue-600"><span>4. Points</span><span>1 ETH = 1 point per day</span></div>
        </div>
        </div>
       
    </div>
  );
}