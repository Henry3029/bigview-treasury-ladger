"use client";

import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { Coins, Flame, ShieldAlert, Activity, Loader2 } from 'lucide-react';

// Import your BVW Token ABI
import { abi as tokenAbi } from '@/constants/abis/BigViewToken.json';

export default function AdminTokenPage() {
  const [amount, setAmount] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const { address, isConnected } = useAccount();

  const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS as `0x${string}`;
  const deployerAddr = process.env.NEXT_PUBLIC_DEPLOYER_ADDR?.toLowerCase();

  // 1. Fetch Total Supply (EVM/Solidity)
  const { data: totalSupplyRaw, refetch } = useReadContract({
    address: tokenAddress,
    abi: tokenAbi,
    functionName: 'totalSupply',
  });

  // 2. Setup Contract Actions
  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isConnected && address) {
      setIsOwner(address.toLowerCase() === deployerAddr);
    }
  }, [address, isConnected, deployerAddr]);

  useEffect(() => {
    if (isConfirmed) {
      alert("Transaction Successful!");
      setAmount('');
      refetch();
    }
  }, [isConfirmed, refetch]);

  const handleAction = async (action: 'mint' | 'burn') => {
    if (!isConnected) return alert("Connect Wallet First");
    if (!amount || Number(amount) <= 0) return alert("Enter a valid amount");

    // Convert to 18 decimals (Wei)
    const units = parseUnits(amount, 18);

    writeContract({
      address: tokenAddress,
      abi: tokenAbi,
      functionName: action,
      args: [units],
    });
  };

  const formattedSupply = totalSupplyRaw 
    ? Number(formatUnits(totalSupplyRaw as bigint, 18)).toLocaleString() 
    : "0";

  const isProcessing = isPending || isConfirming;

  // Access Denied UI
  if (!isOwner && isConnected) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-red-100 text-center max-w-sm">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldAlert size={32} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 italic tracking-tighter">Access Denied</h2>
          <p className="text-sm text-slate-500 mt-3 font-medium leading-relaxed">
            This terminal is locked. Only the Bigview deployer can access the supply controller.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 pb-24 bg-slate-50 flex flex-col items-center gap-8">
      <div className="w-full max-w-md mt-10 text-center">
        <h1 className="text-4xl font-black italic text-slate-900 tracking-tighter">Bigview Admin</h1>
        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mt-2">
          Base Sepolia Supply Controller
        </p>
      </div>

      {/* Live Supply Tracker Card */}
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
          <Activity size={80} />
        </div>
        <div className="relative z-10">
          <p className="text-[10px] uppercase font-black text-blue-400 tracking-widest mb-2">Total BVW Supply</p>
          <h3 className="text-3xl font-black tracking-tight">{formattedSupply}</h3>
        </div>
      </div>

      <div className="w-full max-w-md bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100">
        <div className="mb-8">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-[0.2em]">
            Quantity to Adjust
          </label>
          <div className="relative mt-3">
            <input 
              type="number" 
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-7 bg-slate-50 border-2 border-slate-50 rounded-[2rem] focus:border-blue-500 focus:bg-white outline-none font-black text-3xl transition-all placeholder:text-slate-200"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-slate-300 text-sm">BVW</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={() => handleAction('mint')}
            disabled={isProcessing || !amount}
            className="w-full py-6 bg-blue-600 text-white rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95 disabled:opacity-50"
          >
            {isProcessing ? <Loader2 className="animate-spin" /> : <Coins size={22} />}
            Mint New Tokens
          </button>

          <div className="flex items-center gap-4 my-4">
            <div className="h-[1px] bg-slate-100 flex-1" />
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Security Protocol</span>
            <div className="h-[1px] bg-slate-100 flex-1" />
          </div>

          <button 
            onClick={() => handleAction('burn')}
            disabled={isProcessing || !amount}
            className="w-full py-6 bg-white text-red-600 border-2 border-red-50 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-red-50 transition-all active:scale-95 disabled:opacity-50"
          >
            {isProcessing ? <Loader2 className="animate-spin" /> : <Flame size={22} />}
            Burn Supply
          </button>
        </div>
      </div>
    </main>
  );
}