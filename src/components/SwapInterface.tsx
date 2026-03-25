'use client';
import React, { useState, useEffect } from 'react';
import { openContractCall, UserSession, AppConfig } from '@stacks/connect';
import { STACKS_TESTNET } from '@stacks/network';

// 1. INITIALIZE NATIVE STACKS SESSION
const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export default function SwapInterface() {
  const [amountIn, setAmountIn] = useState("");
  const [amountOut, setAmountOut] = useState("0");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // --- MOCK PRICE CALCULATION ---
  useEffect(() => {
    const getPrice = async () => {
      if (!amountIn || isNaN(Number(amountIn)) || Number(amountIn) <= 0) {
        setAmountOut("0");
        return;
      }
      setLoading(true);
      
      // Simulate network delay for "Finding Route"
      setTimeout(() => {
        // Mock Rate: 1 STX = 0.25 aeUSDC
        const mockRate = 0.25;
        const result = Number(amountIn) * mockRate;
        setAmountOut(result.toFixed(4));
        setLoading(false);
      }, 600);
    };

    const timeoutId = setTimeout(getPrice, 400);
    return () => clearTimeout(timeoutId);
  }, [amountIn]);

  const handleSwap = async () => {
    // 2. NATIVE AUTH CHECK
    if (!userSession.isUserSignedIn()) {
      return alert("Please connect your wallet first");
    }

    setLoading(true);

    try {
      // --- MOCK SWAP EXECUTION ---
      // We simulate the transaction signing process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockTxId = "0x" + Math.random().toString(16).slice(2, 66);
      
      console.log("Mock Swap Sent:", mockTxId);
      alert(`Bigview Swap Success! 
      You swapped ${amountIn} STX for ${amountOut} aeUSDC.
      TxID: ${mockTxId.slice(0, 10)}...`);
      
      setAmountIn("");
      setAmountOut("0");

    } catch (err) {
      console.error("Swap Error:", err);
      alert("Swap failed or was cancelled");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="w-full bg-white rounded-[2.5rem] p-8 shadow-2xl border border-white/50 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-black text-slate-800 tracking-tight italic">Bigview Swap</h2>
        <div className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full border border-blue-100 uppercase tracking-tighter">
          Testnet Mode
        </div>
      </div>

      {/* INPUT BOX */}
      <div className="group bg-slate-50 p-6 rounded-[2rem] mb-2 border-2 border-transparent focus-within:border-orange-100 transition-all">
        <div className="flex justify-between items-center mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <span>From</span>
          <span className="text-orange-500/50">STX Wallet Connected</span>
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
            <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">STX</div>
            <span className="font-black text-sm text-slate-700 uppercase">STX</span>
          </div>
        </div>
      </div>

      {/* REVERSE ICON */}
      <div className="flex justify-center -my-5 relative z-10">
        <div className="bg-white border-[6px] border-slate-50 p-2.5 rounded-2xl shadow-xl text-xs hover:scale-110 transition-transform cursor-pointer">
          ⬇️
        </div>
      </div>

      {/* OUTPUT BOX */}
      <div className="bg-slate-50 p-6 rounded-[2rem] mb-8 border-2 border-transparent">
        <div className="flex justify-between items-center mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <span>To (Estimated)</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="text-3xl font-black text-slate-800 overflow-hidden truncate">
            {loading ? <span className="animate-pulse text-slate-300">...</span> : amountOut}
          </div>
          <div className="flex items-center bg-white shadow-sm border border-slate-100 pl-2 pr-4 py-2 rounded-2xl gap-2 shrink-0">
            <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold tracking-tighter italic">USDC</div>
            <span className="font-black text-sm text-slate-700 uppercase">aeUSDC</span>
          </div>
        </div>
      </div>

      {/* PRICE INFO TABLE */}
      {amountIn && (
        <div className="px-4 mb-6 space-y-2">
          <div className="flex justify-between text-[11px] font-bold">
            <span className="text-slate-400 uppercase tracking-tighter">Slippage Tolerance</span>
            <span className="text-slate-600">4.0%</span>
          </div>
          <div className="flex justify-between text-[11px] font-bold">
            <span className="text-slate-400 uppercase tracking-tighter">Route</span>
            <span className="text-blue-500">STX → aeUSDC (Bigview Optimized)</span>
          </div>
        </div>
      )}

      <button 
        disabled={!amountIn || loading}
        onClick={handleSwap}
        className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-slate-200 hover:bg-orange-500 transition-all disabled:opacity-20 disabled:grayscale uppercase tracking-widest"
      >
        {loading ? "Calculating..." : "Review Swap"}
      </button>
    </div>
  );
}