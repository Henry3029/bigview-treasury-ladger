'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, Info, RefreshCw, ShieldCheck } from 'lucide-react';
import { usePrivy } from '@privy-io/react-auth';

// Configuration
const DEV_FEE_PERCENT = 10;
const TREASURY_ADDRESS = process.env.BIGVIEW_PROFIT_WALLET;

export default function EarnCard() {
  const [amount, setAmount] = useState("");
  const [pool, setPool] = useState({ apy: "0", tvl: "0" });
  const [loading, setLoading] = useState(false);
  const { login, authenticated } = usePrivy();

  useEffect(() => {
    const fetchAeroData = async () => {
      const res = await fetch('/api/earn');
      const data = await res.json();
      setPool({ apy: data.apy, tvl: data.tvl });
    };
    fetchAeroData();
  }, []);

  const handleEarn = async () => {
    if (!authenticated) return login();
    setLoading(true);
    
    if (!TREASURY_ADDRESS) {
  throw new Error("CRITICAL: BIGVIEW_PROFIT_WALLET not found in .env file");
}
    
    console.log(`Processing deposit: ${amount} ETH`);
    console.log(`Fees: ${DEV_FEE_PERCENT}% directed to ${TREASURY_ADDRESS}`);
    
    // Logic: In your contract, you will call: 
    // bigviewVault.deposit{value: amount}(TREASURY_ADDRESS, DEV_FEE_PERCENT)
    
    setTimeout(() => setLoading(false), 2000);
  };

  return (
  <div className="bg-color-ash rounded-bigview p-4 border border-white/5 shadow-2xl max-w-md w-full relative">
    <div className="flex justify-between items-start mb-6">
      <div>
        <h2 className="text-xl font-black text-color-white tracking-tight"> Earnings </h2>
        <div className="flex items-center gap-1.5 mt-1">
          {/* Brand-aligned pulse using violet-glow */}
          <span className="w-1.5 h-1.5 bg-electric-yellow rounded-full animate-pulse" />
          <p className="text-[8px] font-bold text-muted-yellow/40  tracking-widest">Base Mainnet Live</p>
        </div>
      </div>
      
      {/* APR Badge using Bigview Gold */}
      <div className="bg-light-green text-color-white px-3 py-1 rounded-bigview">
        <span className="block text-[7px] font-black opacity-70">Net APR</span>
        <span className="text-sm font-black ">{pool.apy}%</span>
      </div>
    </div>

    {/* Fee Transparency Box - Transparent Violet style */}
    <div className="bg-color-ash border border-white/5 rounded-bigview p-3 mb-6 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <ShieldCheck size={12} className="text-light-blue" />
        <span className="text-[9px] font-black text-white/40 ">Fee</span>
      </div>
      <span className="text-[10px] font-black text-light-blue">{DEV_FEE_PERCENT}% of yield</span>
    </div>

    {/* Deposit Input Box */}
    <div className="bg-black/40 p-5 rounded-bigview border border-white/5 mb-6 focus-within:border-gold-buttons/40 transition-all">
      <label className="text-[9px] font-black text-color-white/30 block mb-2">Deposit ETH</label>
      <input 
        type="number"
        placeholder="0.00"
        className="bg-transparent text-3xl font-black outline-none w-full text-color-white placeholder:text-color-white/10"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
    </div>

    {/* Primary Action Button - Bigview Gold */}
    <button 
      onClick={handleEarn}
      disabled={loading || !amount}
      className={`w-full py-4 bg-gold-buttons text-text-color rounded-bigview font-black text-base transition-all tracking-widest flex items-center justify-center gap-2 ${
        loading ? 'opacity-50' : 'hover:scale-[1.02] active:scale-[0.98]'
      }`}
    >
      {loading ? <RefreshCw className="animate-spin" size={18} /> : <TrendingUp size={18} strokeWidth={3} />}
      {loading ? "Confirming..." : "Start Earning"}
    </button>

    <p className="mt-4 text-[8px] text-white/20 font-bold text-center leading-tight">
      Treasury: <span className="text-color-white/40 font-mono">{TREASURY_ADDRESS?.slice(0,6)}...{TREASURY_ADDRESS?.slice(-4)}</span>
    </p>
  </div>
);
}