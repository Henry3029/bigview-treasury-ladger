"use client";

import React, { useState, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth'; // 1. Added useWallets
import { createWalletClient, custom, parseEther } from 'viem'; // 2. Pure Viem
import { baseSepolia } from 'viem/chains';
import treasuryAbi from '@/constants/abis/BigViewTreasuryV2.json';

export default function AddLiquidity() {
  const [amountX, setAmountX] = useState<string>("");
  const [loading, setLoading] = useState(false); // 3. Local loading state
  const [mounted, setMounted] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<'success' | 'error' | 'info' | null>(null);
  const notify = (text: string, type: 'success' | 'error' | 'info') => {
  setMessage(text);
  setStatus(type);
  
  // This removes the message after 4 seconds
  setTimeout(() => {
    setMessage(null);
    setStatus(null);
  }, 4000);
};

  const { login, authenticated, ready } = usePrivy();
  const { wallets } = useWallets(); // 4. Get the active wallet

  useEffect(() => { setMounted(true); }, []);

  const handleAction = async () => {
    if (!ready || !authenticated) return login();
    if (!amountX || Number(amountX) <= 0) return alert("Enter a valid amount");

    const wallet = wallets[0]; // Get the user's connected wallet
    if (!wallet) return notify("No wallet connected", "info");

    setLoading(true);
    try {
      // 5. Create a Viem Wallet Client using Privy's provider
      const provider = await wallet.getEthereumProvider();
      const walletClient = createWalletClient({
        account: wallet.address as `0x${string}`,
        chain: baseSepolia,
        transport: custom(provider)
      });

      const treasuryAddress = process.env.NEXT_PUBLIC_TREASURY_ADDRESS as `0x${string}`;

      // 6. Send Transaction
      const hash = await walletClient.writeContract({
        address: treasuryAddress,
        abi: treasuryAbi,
        functionName: 'stakeAndDelegate',
        args: [],
        value: parseEther(amountX),
      });

      console.log("Transaction Hash:", hash);
      notify("Success! Assets added to Bigview Treasury.", "success");
      setAmountX("");
      
    } catch (err) {
      console.error("Transaction Error:", err);
      notify("Transaction failed. Check console for details.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
  <div className="bg-gold-background rounded-bigview p-6 shadow-2xl border border-white/5 max-w-md mx-auto relative overflow-hidden">
    
    {/* 1. HEADER */}
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-lg font-black text-text-color italic tracking-tight uppercase leading-none">
          Deposit Assets
        </h2>
        <p className="text-[9px] font-bold text-text-color uppercase tracking-widest mt-1">
          Bigview Treasury
        </p>
      </div>
      <div className="flex items-center gap-2 bg-black/40 px-2.5 py-1 rounded-bigview border border-white/5">
        <div className="w-1.5 h-1.5 rounded-bigview bg-emerald-500 animate-pulse" />
        <span className="text-[8px] font-black text-text-color uppercase italic tracking-tighter">Base Sepolia</span>
      </div>
    </div>

    {/* 2. DYNAMIC FEEDBACK (MESSAGE BOX) - RE-ADDED & STYLED SHARP */}
    {message && (
      <div className={`mb-4 p-4 rounded-bigview text-[11px] font-black uppercase italic tracking-tighter border animate-in fade-in slide-in-from-top-2 ${
        status === 'success' 
          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
          : status === 'error' 
          ? 'bg-red-500/10 border-red-500/20 text-red-500' 
          : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
      }`}>
        <div className="flex items-center gap-2">
          {status === 'success' && "✓"}
          {status === 'error' && "⚠"}
          {message}
        </div>
      </div>
    )}

    {/* 3. THE ACTION GRID */}
    <div className="grid grid-cols-1 gap-2 mb-6">
      
      {/* Top Input Card */}
      <div className="group bg-black/40 p-5 rounded-xl border border-white/5 focus-within:border-amber-500/40 transition-all duration-300">
        <div className="flex justify-between items-center mb-1.5">
          <label className="text-[9px] font-black text-neutral-500 uppercase tracking-[0.2em]">
            You Send
          </label>
        </div>
        <div className="flex items-center justify-between">
          <input 
            type="number"
            placeholder="0.00"
            className="bg-transparent text-2xl font-black outline-none w-full text-text-color placeholder:text-text-color font-inter"
            value={amountX}
            onChange={(e) => setAmountX(e.target.value)}
          />
          <div className="flex items-center gap-2 bg-neutral-800 px-3 py-1.5 rounded-lg border border-white/10">
            <span className="font-black text-text-color italic text-sm">ETH</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="flex justify-center -my-4 z-10">
        <div className="bg-amber-500 text-black p-2 rounded-bigview border-[4px] border-neutral-900 shadow-xl">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
        </div>
      </div>

      {/* Bottom Output Card */}
      <div className="bg-white/[0.02] p-5 rounded-xl border border-white/5">
        <label className="text-[9px] font-black text-neutral-500 uppercase tracking-[0.2em] block mb-1.5">
          Estimated Value
        </label>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-black text-neutral-400 font-inter opacity-60">
            {amountX ? (Number(amountX) * 3500).toLocaleString(undefined, {minimumFractionDigits: 2}) : "0.00"}
          </div>
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
            <span className="font-black text-emerald-500 italic text-xs">USDC</span>
          </div>
        </div>
      </div>
    </div>

    {/* 4. MAIN ACTION BUTTON */}
    <button 
      disabled={loading || !amountX}
      onClick={handleAction}
      className="w-full py-4 bg-amber-500 text-black rounded-xl font-black text-base hover:bg-amber-400 transition-all shadow-lg shadow-amber-900/10 disabled:opacity-30 uppercase tracking-widest italic active:scale-[0.98] flex items-center justify-center gap-2"
    >
      {loading ? (
        <div className="w-5 h-5 border-[3px] border-black/20 border-t-black rounded-bigview animate-spin" />
      ) : (
        "START EARNING"
      )}
    </button>
  </div>
);
}