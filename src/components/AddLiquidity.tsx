"use client";
import React, { useState } from 'react';
import { BitflowSDK } from '@bitflowlabs/core-sdk';
import { useWallets } from '@privy-io/react-auth';
import { StacksMainnet } from '@stacks/network';

const bitflow = new BitflowSDK();

export default function AddLiquidity() {
  const { wallets } = useWallets();
  const [amountX, setAmountX] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    const stacksWallet = wallets.find(w => w.chainType === 'stacks');
    if (!stacksWallet) return alert("Please login with Privy first");
    if (!amountInNumber || amountInNumber <= 0) return alert("Enter a valid amount");

    setLoading(true);
    try {
      const amountInNumber = Number(amountX);
      
      // Note: In a real pool, you usually need to provide Token Y too.
      // For this "Ready" component, we assume a 1:1 test or use 
      // bitflow.getAddLiquidityParams with a calculated amountY.
      const amountY = amountInNumber * 0.25; // Simple example ratio

      const lpParams = await bitflow.getAddLiquidityParams(
        'token-stx', 
        'token-ae-usdc', 
        amountInNumber, 
        amountY, 
        stacksWallet.address,
        0.04 // 4% slippage
      );

      await stacksWallet.request({
        method: 'stx_signTransaction',
        params: {
          ...lpParams,
          network: new StacksMainnet(),
        },
      });

      alert("Transaction Sent!");
    } catch (err) {
      console.error(err);
      alert("Transaction Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-50">
      <h2 className="text-xl font-black text-slate-800 mb-6">Deposit Assets</h2>
      
      <div className="space-y-4 mb-8">
        {/* Input for STX */}
        <div className="bg-slate-50 p-5 rounded-3xl border border-transparent focus-within:border-orange-200 transition-all">
          <label className="text-[10px] font-bold text-slate-400 uppercase">Amount to Stake</label>
          <div className="flex items-center justify-between mt-1">
            <input 
              type="number"
              placeholder="0.00"
              className="bg-transparent text-2xl font-bold outline-none w-full text-slate-800"
              value={amountX}
              onChange={(e) => setAmountX(e.target.value)}
            />
            <span className="font-black text-orange-500 ml-2">STX</span>
          </div>
        </div>

        <div className="text-center text-slate-300 text-xl font-light">+</div>

        {/* Display for Token Y (Calculated) */}
        <div className="bg-slate-50 p-5 rounded-3xl opacity-60">
          <label className="text-[10px] font-bold text-slate-400 uppercase">Required USDC</label>
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
        className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg hover:bg-orange-500 transition-all shadow-xl shadow-slate-200 disabled:opacity-30"
      >
        {loading ? "PREPARING..." : "ADD LIQUIDITY"}
      </button>

      <p className="text-[10px] text-slate-400 text-center mt-6 leading-relaxed">
        By adding liquidity, you earn <b>0.3%</b> of all trades in this pool proportional to your share.
      </p>
    </div>
  );
}