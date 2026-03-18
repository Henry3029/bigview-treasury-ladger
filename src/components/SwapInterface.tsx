"use client";
import React, { useState, useEffect } from 'react';
import { BitflowSDK } from '@bitflowlabs/core-sdk';
import { useWallets } from '@privy-io/react-auth';
import { StacksMainnet } from '@stacks/network';

const bitflow = new BitflowSDK();

export default function SwapInterface() {
  const { wallets } = useWallets();
  const [amountIn, setAmountIn] = useState("");
  const [amountOut, setAmountOut] = useState("0");
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<any>(null);

  useEffect(() => {
    const getPrice = async () => {
      if (!amountIn || isNaN(Number(amountIn)) || Number(amountIn) <= 0) {
        setAmountOut("0");
        return;
      }
      setLoading(true);
      try {
        const result = await bitflow.getQuoteForRoute('token-stx', 'token-ae-usdc', Number(amountIn));
        setQuote(result);
        setAmountOut(result.amountOut.toFixed(4));
      } catch (err) {
        console.error("Quote error:", err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(getPrice, 400);
    return () => clearTimeout(timeoutId);
  }, [amountIn]);

  const handleSwap = async () => {
    const stacksWallet = wallets.find(w => w.chainType === 'stacks');
    if (!stacksWallet) return alert("Please login first");
    if (!quote) return;

    try {
      const params = await bitflow.getSwapParams(
        { 
          route: quote.bestRoute, 
          amount: Number(amountIn), 
          tokenXDecimals: 6, 
          tokenYDecimals: 6 
        },
        stacksWallet.address,
        0.04 
      );

      await stacksWallet.request({
        method: 'stx_signTransaction',
        params: { ...params, network: new StacksMainnet() }
      });
    } catch (err) {
      alert("Swap failed or was cancelled");
    }
  };

  return (
    <div className="w-full bg-white rounded-[2.5rem] p-8 shadow-2xl border border-white/50 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-black text-slate-800 tracking-tight">Swap</h2>
        <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
          ⚙️
        </button>
      </div>

      {/* INPUT BOX */}
      <div className="group bg-slate-50 p-6 rounded-[2rem] mb-2 border-2 border-transparent focus-within:border-orange-100 transition-all">
        <div className="flex justify-between items-center mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <span>From</span>
          <span>Balance: 142.5 STX</span>
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
            <span className="text-slate-400 uppercase">Price Impact</span>
            <span className="text-green-500">{"< 0.01%"}</span>
          </div>
          <div className="flex justify-between text-[11px] font-bold">
            <span className="text-slate-400 uppercase">Minimum Received</span>
            <span className="text-slate-600">{(Number(amountOut) * 0.96).toFixed(4)} USDC</span>
          </div>
        </div>
      )}

      <button 
        disabled={!amountIn || loading}
        onClick={handleSwap}
        className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-slate-200 hover:bg-orange-500 transition-all disabled:opacity-20 disabled:grayscale uppercase tracking-widest"
      >
        {loading ? "Finding Route..." : "Review Swap"}
      </button>
    </div>
  );
}