'use client';

import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { abi as treasuryAbi } from '@/constants/abis/BigViewTreasury.json';
import { ArrowDown, RefreshCw } from 'lucide-react';

export default function SwapInterface() {
  const [amountIn, setAmountIn] = useState("");
  const [amountOut, setAmountOut] = useState("0");
  const [mounted, setMounted] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const { login, authenticated, ready } = usePrivy();
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // --- MOCK PRICE CALCULATION (ETH to USDC) ---
  useEffect(() => {
    const getPrice = async () => {
      if (!amountIn || isNaN(Number(amountIn)) || Number(amountIn) <= 0) {
        setAmountOut("0");
        return;
      }
      setIsCalculating(true);
      
      // Simulate Base Sepolia RPC delay
      setTimeout(() => {
        // Mock Rate: 1 ETH = 3500 USDC
        const mockRate = 3500;
        const result = Number(amountIn) * mockRate;
        setAmountOut(result.toLocaleString(undefined, { minimumFractionDigits: 2 }));
        setIsCalculating(false);
      }, 600);
    };

    const timeoutId = setTimeout(getPrice, 400);
    return () => clearTimeout(timeoutId);
  }, [amountIn]);

  const handleSwap = async () => {
    if (!ready) return;

    if (!authenticated) {
      login();
      return;
    }

    const treasuryAddress = process.env.NEXT_PUBLIC_TREASURY_ADDRESS;

    try {
      writeContract({
        address: treasuryAddress as `0x${string}`,
        abi: treasuryAbi,
        functionName: 'stakeAndDelegate', // Or your specific swap/deposit function
        args: [],
        value: parseEther(amountIn),
      });
    } catch (err) {
      console.error("Swap Error:", err);
    }
  };

  useEffect(() => {
    if (isConfirmed) {
      alert("Swap successful on Base Sepolia!");
      setAmountIn("");
    }
  }, [isConfirmed]);

  if (!mounted) return null;

  const loading = isPending || isConfirming;

  return (
    <div className="w-full bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-50">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-black text-slate-800 tracking-tight italic">Bigview Swap</h2>
        <div className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full border border-blue-100 uppercase tracking-widest">
          Base Sepolia
        </div>
      </div>

      {/* INPUT BOX (ETH) */}
      <div className="group bg-slate-50 p-6 rounded-[2rem] mb-2 border-2 border-transparent focus-within:border-blue-100 transition-all">
        <div className="flex justify-between items-center mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <span>Pay</span>
          <span className="text-blue-500/50">Wallet Connected</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <input 
            type="number"
            placeholder="0.00"
            className="bg-transparent text-3xl font-black outline-none w-full text-slate-800 placeholder:text-slate-200"
            value={amountIn}
            onChange={(e) => setAmountIn(e.target.value)}
          />
          <div className="flex items-center bg-white shadow-sm border border-slate-100 pl-2 pr-4 py-2 rounded-2xl gap-2 shrink-0">
            <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold">ETH</div>
            <span className="font-black text-sm text-slate-700 uppercase">ETH</span>
          </div>
        </div>
      </div>

      {/* REVERSE ICON */}
      <div className="flex justify-center -my-5 relative z-10">
        <div className="bg-white border-[6px] border-slate-50 p-3 rounded-2xl shadow-xl text-blue-600 hover:rotate-180 transition-transform duration-500 cursor-pointer">
          <ArrowDown size={18} strokeWidth={3} />
        </div>
      </div>

      {/* OUTPUT BOX (USDC) */}
      <div className="bg-slate-50 p-6 rounded-[2rem] mb-8 border-2 border-transparent">
        <div className="flex justify-between items-center mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <span>Receive (Estimated)</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="text-3xl font-black text-slate-800 overflow-hidden truncate">
            {isCalculating ? <RefreshCw className="animate-spin text-slate-300" size={24} /> : amountOut}
          </div>
          <div className="flex items-center bg-white shadow-sm border border-slate-100 pl-2 pr-4 py-2 rounded-2xl gap-2 shrink-0">
            <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold tracking-tighter italic">USDC</div>
            <span className="font-black text-sm text-slate-700 uppercase">USDC</span>
          </div>
        </div>
      </div>

      {/* PRICE INFO TABLE */}
      {amountIn && (
        <div className="px-4 mb-6 space-y-2">
          <div className="flex justify-between text-[11px] font-bold">
            <span className="text-slate-400 uppercase tracking-tighter">Slippage Tolerance</span>
            <span className="text-slate-600">0.5%</span>
          </div>
          <div className="flex justify-between text-[11px] font-bold">
            <span className="text-slate-400 uppercase tracking-tighter">Route</span>
            <span className="text-blue-500 underline decoration-dotted">Base → Bigview Liquidity</span>
          </div>
        </div>
      )}

      <button 
        disabled={!amountIn || loading || isCalculating}
        onClick={handleSwap}
        className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-slate-200 hover:bg-blue-600 transition-all disabled:opacity-20 disabled:grayscale uppercase tracking-widest"
      >
        {loading ? "Signing Transaction..." : isCalculating ? "Fetching Quote..." : "Swap Assets"}
      </button>
    </div>
  );
}