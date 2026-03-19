"use client";
import React, { useState, useEffect } from 'react';
import { BitflowSDK } from '@bitflowlabs/core-sdk';
import { UserSession, AppConfig } from '@stacks/connect';

// 1. INITIALIZE NATIVE STACKS SESSION
const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });
const bitflow = new BitflowSDK();

export default function AddLiquidity() {
  const [amountX, setAmountX] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAction = async () => {
    // 1. NATIVE AUTH CHECK
    if (!userSession.isUserSignedIn()) {
      return alert("Please connect your wallet first");
    }

    const amountInNumber = Number(amountX);
    if (!amountInNumber || amountInNumber <= 0) {
      return alert("Enter a valid amount");
    }

    setLoading(true);

    try {
      // --- MOCK BITFLOW LOGIC ---
      // We simulate the 1.5 second delay of fetching a quote/params
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulated transaction ID
      const mockTxId = "0x" + Math.random().toString(16).slice(2, 66);
      
      console.log("Mock Liquidity Transaction Sent:", mockTxId);
      
      // Update the UI as if it worked
      alert(`Success! [MOCK MODE] 
      Liquidity added to Bigview Pool. 
      Transaction ID: ${mockTxId.slice(0, 10)}...`);
      
      setAmountX("");

    } catch (err) {
      console.error("Mock Error:", err);
      alert("Something went wrong with the simulation.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-50">
      <h2 className="text-xl font-black text-slate-800 mb-6 italic tracking-tight">Deposit Assets</h2>
      
      <div className="space-y-4 mb-8">
        {/* Input for STX */}
        <div className="bg-slate-50 p-5 rounded-3xl border border-transparent focus-within:border-orange-200 transition-all">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount to Stake</label>
          <div className="flex items-center justify-between mt-1">
            <input 
              type="number"
              placeholder="0.00"
              className="bg-transparent text-2xl font-bold outline-none w-full text-slate-800 placeholder:text-slate-200"
              value={amountX}
              onChange={(e) => setAmountX(e.target.value)}
            />
            <span className="font-black text-orange-500 ml-2">STX</span>
          </div>
        </div>

        <div className="text-center text-slate-300 text-xl font-light">+</div>

        {/* Display for Token Y (Calculated) */}
        <div className="bg-slate-50 p-5 rounded-3xl opacity-60">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Required USDC</label>
          <div className="flex items-center justify-between mt-1">
            <div className="text-2xl font-bold text-slate-400">
              {amountX ? (Number(amountX) * 0.25).toFixed(2) : "0.00"}
            </div>
            <span className="font-black text-blue-500 ml-2">USDC</span>
          </div>
        </div>
      </div>

      <button 
        disabled={loading || !amountX}
        onClick={handleAction}
        className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg hover:bg-orange-600 transition-all shadow-xl shadow-slate-200 disabled:opacity-30 uppercase tracking-widest"
      >
        {loading ? "PREPARING..." : "ADD LIQUIDITY"}
      </button>

      <p className="text-[10px] text-slate-400 text-center mt-6 leading-relaxed px-4">
        By adding liquidity to the Bigview pool, you earn <b>0.3%</b> of all trades proportional to your share.
      </p>
    </div>
  );
}