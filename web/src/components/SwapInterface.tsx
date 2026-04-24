'use client';

import React, { useState, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { createWalletClient, custom, parseEther } from 'viem';
import { baseSepolia } from 'viem/chains';
import { ArrowUpDown, RefreshCw } from 'lucide-react';

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
  <div className="mx-3 p-4 font-inter">
    <div className="relative flex justify-center items-center mb-6">
      <h1 className="text-lg font-bold text-white">Swap</h1>
      <button className="absolute right-0 hover:opacity-70 transition-opacity text-color-white text-xl">
        X
      </button>
    </div>
    
    <div className="relative space-y-2">{/*the wrapper for both inputs*/}

    {/* INPUT BOX (ETH) */}
    <div className="relative flex justify-between items-center">
    
        <input 
          type="number"
          placeholder="0"
          className="bg-transparent text-6xl font-light w-full outline-none text-white placeholder:text-gray-500 font-inter"
          value={amountIn}
          onChange={(e) => setAmountIn(e.target.value)}
        />
        <div className="flex items-center justify-center px-3 py-1.5 rounded-bigview shrink-0 bg-blue">
          <span className="font-medium text-xs text-black">ETH</span>
        </div>
        </div>

    {/* the stretching line and the upDown arrow*/}
    <div className="relative h-2 flex items-center justify-center">
    {/*the streching line*/}
    <div className="absolute w-full h-[1px] bg-white/10">
    </div>
    {/*the arrow button*/}
    <div className="z-10">
          <button className="bg-white/20 border-4 border-white/5 p-2 rounded-full hover:bg-white/10 transition-colors">
          <ArrowUpDown size={16}
          className="text-gray-400"/>
          </button>
          </div>
          </div>
          
          {/*Bottom input (to) */}
          <div className="flex justify-between items-center">
        <div className="text-6xl font-light text-color-white placeholder:text-gray-500 font-inter">
          {isCalculating ? <RefreshCw className="animate-spin text-white/20" size={20} /> : amountOut}
        </div>
        <div className="flex items-center bg-blue px-3 py-1.5 rounded-bigview shrink-0">
          <span className="font-medium text-xs text-black">USDC</span>
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
          <span className="text-white">Provider</span>
          <span className="text-muted-yellow">0x Aggregator</span>
        </div>
      </div>
    )}

    {/* Primary Action Button: Bigview Gold */}
    <button 
      disabled={!amountIn || isCalculating}
      onClick={handleSwap}
      className="w-full py-2 bg-gradient-to-br from-bigview-gold to-bigview-gold-dim text-black rounded-full font-bold text-base shadow-md shadow-bigview-gold/20 hover:opacity-90 transition-all disabled:opacity-20 tracking-tight"
    >
      {isCalculating ? "Fetching Price..." : "Execute Swap"}
    </button>

    <p className="text-[10px] text-gold-buttons bg-solid-green/60 text-center mt-4 font-bold tracking-tighter">
      BigView Protocol, The Future Of Decentralized Finance!
    </p>
  </div>
  </>
);
}