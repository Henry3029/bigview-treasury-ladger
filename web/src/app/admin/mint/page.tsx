"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { createWalletClient, createPublicClient, custom, http, parseUnits, formatUnits } from 'viem';
import { baseSepolia } from 'viem/chains';
import { DEPLOYER_ADDRESS, TOKEN_ADDRESS } from '@/config/env';
import { Coins, Flame, ShieldAlert, Activity, Loader2 } from 'lucide-react';

import { TOKEN_ABI } from '@/utils/constants'; 

export default function AdminTokenPage() {
  const [amount, setAmount] = useState('');
  const [totalSupply, setTotalSupply] = useState('0');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { user, authenticated, login } = usePrivy();
  const { wallets } = useWallets();
  const wallet = wallets[0]; 

  const isOwner = user?.wallet?.address?.toLowerCase() === DEPLOYER_ADDRESS;

  // 1. SETUP PUBLIC CLIENT (For Reading Data)
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC)
  });

  const fetchSupply = useCallback(async () => {
    if (!TOKEN_ADDRESS) return;
    try {
      const data = await publicClient.readContract({
        address: TOKEN_ADDRESS,
        abi: TOKEN_ABI,
        functionName: 'totalSupply',
      });
      setTotalSupply(formatUnits(data as bigint, 18));
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  }, [TOKEN_ADDRESS, publicClient]);

  useEffect(() => { 
    fetchSupply(); 
  }, [fetchSupply]);

  // 2. THE ACTION HANDLER (Mint/Burn)
  const handleAction = async (action: 'mint' | 'burn') => {
    if (!authenticated) return login();
    if (!amount || isProcessing || !wallet) return;

    // Safety guard step for supply adjustments
    const confirmProceed = window.confirm(`Confirm execution: ${action.toUpperCase()} ${amount} BVW?`);
    if (!confirmProceed) return;

    try {
      setIsProcessing(true);

      const ethereumProvider = await wallet.getEthereumProvider();
      const walletClient = createWalletClient({
        account: wallet.address as `0x${string}`,
        chain: baseSepolia,
        transport: custom(ethereumProvider)
      });

      const units = parseUnits(amount, 18);
      
      const dynamicArgs = action === 'mint' 
        ? [wallet.address as `0x${string}`, units]  // Mint needs: address, amount
        : [units];                                  // Burn only needs: amount

      // Execute Contract Write
      const hash = await walletClient.writeContract({
        address: TOKEN_ADDRESS,
        abi: TOKEN_ABI,
        functionName: action,
        args: dynamicArgs,
      });

      // Wait for Transaction
      await publicClient.waitForTransactionReceipt({ hash });

      alert(`${action.toUpperCase()} Successful!`);
      setAmount('');
      fetchSupply();
    } catch (err: any) {
      console.error(err);
      alert("Transaction failed. Check console for details.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- UI Layout Protections ---
  if (!isOwner && authenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-color-ash py-6">
        <div className="bg-[#1E293B] p-10 rounded-bigview shadow-2xl border border-red-500/20 text-center max-w-sm">
           <ShieldAlert size={32} className="text-red-500 mx-auto mb-4" />
           <h2 className="text-xl font-black text-color-white">Access Denied</h2>
           <p className="text-[10px] text-white/40 mt-2 tracking-tight">DEPLOYER ONLY TERMINAL</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-6 pb-16 bg-color-ash flex flex-col items-center gap-8 font-inter text-white">
      <div className="text-center mt-10">
        <h1 className="text-4xl font-black tracking-tighter">Supply Controller</h1>
        <p className="text-[10px] font-black text-color-white tracking-tight">BigView Protocol V2.0</p>
      </div>

      {/* Supply Card */}
      <div className="w-full max-w-md bg-gradient-to-br from-gold-buttons to-[#B8860B] p-8 rounded-bigview shadow-2xl relative">
        <Activity size={60} className="absolute right-4 top-4 opacity-10 text-black" />
        <p className="text-[10px] font-black text-black/40 mb-1">Total BVW in Circulation</p>
        <h3 className="text-4xl font-black tracking-tighter text-black leading-none">
          {Number(totalSupply).toLocaleString()} <span className="text-sm">BVW</span>
        </h3>
      </div>

      {/* Input Section */}
      <div className="w-full max-w-md bg-color-ash rounded-bigview p-8 border border-white/5 shadow-xl">
        <label className="text-[10px] font-black text-white/20 ml-2 tracking-tight">Adjustment Quantity</label>
        <input 
          type="number" 
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-6 bg-color-ash border-2 border-white/5 rounded-bigview text-white font-black text-3xl outline-none focus:border-gold-buttons transition-all mt-2 mb-8"
        />

        <div className="flex flex-col gap-4">
          <button 
            onClick={() => handleAction('mint')}
            disabled={isProcessing}
            className="w-full py-5 bg-gold-buttons text-black rounded-bigview font-black text-xs tracking-tight flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30"
          >
            {isProcessing ? <Loader2 className="animate-spin" /> : <Coins size={18} />}
            Execute Mint
          </button>

          <button 
            onClick={() => handleAction('burn')}
            disabled={isProcessing}
            className="w-full py-5 bg-transparent border border-red-500/30 text-red-500 rounded-bigview font-black text-xs tracking-tight flex items-center justify-center gap-2 hover:bg-red-500/5 active:scale-95 transition-all disabled:opacity-30"
          >
            {isProcessing ? <Loader2 className="animate-spin" /> : <Flame size={18} />}
            Execute Burn
          </button>
        </div>
      </div>

      <footer className="opacity-10 text-[8px] font-black tracking-tight mt-auto">
        Secure Terminal • BigView Treasury Ledger
      </footer>
    </main>
  );
}