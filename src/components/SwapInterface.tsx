'use client';

import React, { useState, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { createWalletClient, custom, parseEther } from 'viem';
import { baseSepolia } from 'viem/chains';
import { ArrowDown, RefreshCw } from 'lucide-react';

export default function SwapInterface() {
  const [amountIn, setAmountIn] = useState("");
  const [amountOut, setAmountOut] = useState("0.00");
  const [mounted, setMounted] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [quoteData, setQuoteData] = useState<any>(null);

  const { login, authenticated, ready } = usePrivy();
  const { wallets } = useWallets();

  useEffect(() => { setMounted(true); }, []);

  // --- REAL 0X PRICE FETCHING ---
  useEffect(() => {
    const getPrice = async () => {
      if (!amountIn || isNaN(Number(amountIn)) || Number(amountIn) <= 0) {
        setAmountOut("0.00");
        return;
      }
      setIsCalculating(true);
      
      try {
        // Convert ETH to Wei (10^18)
        const sellAmountWei = parseEther(amountIn).toString();
        
        // Calling the API route we created earlier
        const res = await fetch(`/api/swap?sellToken=ETH&buyToken=USDC&sellAmount=${sellAmountWei}`);
        const data = await res.json();

        if (data.buyAmount) {
          // USDC is 6 decimals on Base
          const formattedOut = (Number(data.buyAmount) / 10 ** 6).toFixed(2);
          setAmountOut(formattedOut);
          setQuoteData(data); // Store the full transaction data
        }
      } catch (err) {
        console.error("0x Fetch Error:", err);
      } finally {
        setIsCalculating(false);
      }
    };

    const timeoutId = setTimeout(getPrice, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [amountIn]);

  const handleSwap = async () => {
    if (!ready || !authenticated) return login();
    if (!quoteData) return;

    const wallet = wallets[0];
    if (!wallet) return alert("Please connect your wallet");

    setIsCalculating(true);
    try {
      const provider = await wallet.getEthereumProvider();
      const walletClient = createWalletClient({
        account: wallet.address as `0x${string}`,
        chain: baseSepolia,
        transport: custom(provider)
      });

      // Execute the swap using the data returned by 0x
      const hash = await walletClient.sendTransaction({
        to: quoteData.to as `0x${string}`,
        data: quoteData.data as `0x${string}`,
        value: BigInt(quoteData.value),
      });

      console.log("Transaction Hash:", hash);
      alert("Swap successful! Your fee was sent to the Bigview wallet.");
      setAmountIn("");
    } catch (err) {
      console.error("Swap Error:", err);
    } finally {
      setIsCalculating(false);
    }
  };

  if (!mounted) return null;

  return (
  <>
{ /* 1. Main Container: Using Bigview Violet and rounded-bigview */}
  <div className="mx-2 bg-charcaol  p-4 shadow-2xl border-t border-b border-gold-buttons/40 max-w-md mx-auto font-inter">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-lg font-black text-white tracking-tight">Swap Tokens</h2>
      <div className="px-2 py-1 bg-light-black text-color-white text-[8px] font-black rounded-bigview border border-blue tracking-tight">
        Base Sepolia
      </div>
    </div>

    {/* INPUT BOX (ETH) */}
    <div className="group bg-charcaol p-5 rounded-bigview mb-1.5 border border-gold-background/70 focus-within:border-light-green/70 transition-all">
      <div className="flex justify-between items-center mb-2 text-[10px] font-semibold text-white/80 tracking-tight">
        <span>You Pay</span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <input 
          type="number"
          placeholder="0.00"
          className="bg-transparent text-2xl font-semibold outline-none w-full text-white placeholder:text-white/60 font-inter"
          value={amountIn}
          onChange={(e) => setAmountIn(e.target.value)}
        />
        <div className="flex items-center px-3 py-1.5 rounded-bigview gap-2 shrink-0">
          <span className="font-medium text-xs text-solid-green/60">ETH</span>
        </div>
      </div>
    </div>

    {/* REVERSE ICON - Bigview Gold Style */}
    <div className="flex justify-center -my-4 relative z-10">
      <div className="bg-gold-background text-solid-green p-2 rounded-bigview border-[2px] border-light-green shadow-xl transition-transform hover:scale-110">
        <ArrowDown size={14} strokeWidth={4} />
      </div>
    </div>

    {/* OUTPUT BOX (USDC) */}
    <div className="bg-charcaol p-5 rounded-bigview mb-6">
      <div className="flex justify-between items-center mb-2 text-[10px] font-semibold text-solid-green/80 tracking-tight">
        <span>You Receive</span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="text-2xl font-bold text-color-white/50 font-inter">
          {isCalculating ? <RefreshCw className="animate-spin text-white/20" size={20} /> : amountOut}
        </div>
        <div className="flex items-center border border-white/10 px-3 py-1.5 rounded-bigview gap-2 shrink-0">
          <span className="font-medium text-xs text-solid-green/60">USDC</span>
        </div>
      </div>
    </div>

    {/* PRICE INFO TABLE */}
    {amountIn && (
      <div className="px-2 mb-6 space-y-1">
        <div className="flex justify-between text-[9px] font-black">
          <span className="text-white/20">Slippage Protection</span>
          <span className="text-white/40">Auto (0.5%)</span>
        </div>
        <div className="flex justify-between text-[9px] font-black">
          <span className="text-white/20">Provider</span>
          <span className="text-muted-yellow/80">0x Aggregator</span>
        </div>
      </div>
    )}

    {/* Primary Action Button: Bigview Gold */}
    <button 
      disabled={!amountIn || isCalculating}
      onClick={handleSwap}
      className="w-full py-2 bg-gold-buttons text-text-color rounded-full font-bold text-base shadow-xl shadow-gold-buttons hover:opacity-90 transition-all disabled:opacity-20 tracking-tight"
    >
      {isCalculating ? "Fetching Price..." : "Execute Swap"}
    </button>

    <p className="text-[10px] text-gold-buttons bg-vibrant-green-60 text-center mt-4 font-bold tracking-tighter">
      BigView Protocol, The Future Of Decentralized Finance!
    </p>
  </div>
  </>
);
}