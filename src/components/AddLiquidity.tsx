"use client";

import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, parseUnits } from 'viem';
import { abi as treasuryAbi } from '@/constants/abis/BigViewTreasury.json';

export default function AddLiquidity() {
  const [amountX, setAmountX] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  const { login, authenticated, ready } = usePrivy();
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAction = async () => {
    if (!ready) return;

    if (!authenticated) {
      login();
      return;
    }

    const amountInNumber = Number(amountX);
    if (!amountInNumber || amountInNumber <= 0) {
      return alert("Enter a valid amount");
    }

    const treasuryAddress = process.env.NEXT_PUBLIC_TREASURY_ADDRESS;

    try {
      // In EVM, we use writeContract. 
      // If this is a simple ETH deposit to your Treasury:
      writeContract({
        address: treasuryAddress as `0x${string}`,
        abi: treasuryAbi,
        functionName: 'stakeAndDelegate', // Or your specific liquidity function
        args: [], 
        value: parseEther(amountX), 
      });

    } catch (err) {
      console.error("Transaction Error:", err);
    }
  };

  useEffect(() => {
    if (isConfirmed) {
      alert("Success! Assets added to Bigview Treasury.");
      setAmountX("");
    }
  }, [isConfirmed]);

  if (!mounted) return null;

  const loading = isPending || isConfirming;

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-50">
      <h2 className="text-xl font-black text-slate-800 mb-6 italic tracking-tight">Deposit Assets</h2>
      
      <div className="space-y-4 mb-8">
        {/* Input for ETH */}
        <div className="bg-slate-50 p-5 rounded-3xl border border-transparent focus-within:border-blue-200 transition-all">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount to Stake</label>
          <div className="flex items-center justify-between mt-1">
            <input 
              type="number"
              placeholder="0.00"
              className="bg-transparent text-2xl font-bold outline-none w-full text-slate-800 placeholder:text-slate-200"
              value={amountX}
              onChange={(e) => setAmountX(e.target.value)}
            />
            <span className="font-black text-blue-600 ml-2">ETH</span>
          </div>
        </div>

        <div className="text-center text-slate-300 text-xl font-light">+</div>

        {/* Display for USDC (Calculated/Mocked for UI) */}
        <div className="bg-slate-50 p-5 rounded-3xl opacity-60">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estimated Value</label>
          <div className="flex items-center justify-between mt-1">
            <div className="text-2xl font-bold text-slate-400">
              {amountX ? (Number(amountX) * 3500).toFixed(2) : "0.00"}
            </div>
            <span className="font-black text-green-500 ml-2">USDC</span>
          </div>
        </div>
      </div>

      <button 
        disabled={loading || !amountX}
        onClick={handleAction}
        className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 disabled:opacity-30 uppercase tracking-widest"
      >
        {loading ? "PROCESSING..." : "ADD LIQUIDITY"}
      </button>

      <p className="text-[10px] text-slate-400 text-center mt-6 leading-relaxed px-4">
        By depositing into the Bigview Treasury on <b>Base Sepolia</b>, you earn rewards proportional to your share.
      </p>
    </div>
  );
}