'use client';

import React, { useEffect, useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { createPublicClient, http, formatEther } from 'viem';
import { baseSepolia } from 'viem/chains';
import { 
  Info,
  EyeOff,
  LogOut,
  Copy
} from 'lucide-react';

export default function MePage() {
  const { login, logout, authenticated, ready, user } = usePrivy();
  const { wallets } = useWallets();
  
  const [mounted, setMounted] = useState(false);
  const [balance, setBalance] = useState("0.0000");

  // Get the address directly from the authenticated user or the first wallet
  const address = user?.wallet?.address || wallets[0]?.address;

  useEffect(() => {
    setMounted(true);
    
    // Fetch balance using only Viem + Public RPC (No Wagmi needed)
    const fetchBalance = async () => {
      if (address) {
        try {
          const publicClient = createPublicClient({
            chain: baseSepolia,
            transport: http(), // Uses default public RPC
          });
          const rawBalance = await publicClient.getBalance({ address: address as `0x${string}` });
          setBalance(parseFloat(formatEther(rawBalance)).toFixed(4));
        } catch (error) {
          console.error("Balance fetch failed:", error);
        }
      }
    };

    if (authenticated) fetchBalance();
  }, [address, authenticated]);

  if (!mounted || !ready) return null;

  // 1. LOGIN SCREEN (Matches your Black/Gold theme)
  if (!authenticated) {
    return (
      <main className="min-h-screen bg-[#060606] flex flex-col items-center justify-center p-8">
        <div className="w-20 h-20 bg-amber-500 rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(245,158,11,0.2)]">
          <Lock size={32} className="text-black" />
        </div>
        <h2 className="text-white font-black italic uppercase tracking-tighter text-2xl mb-2">Secure Access</h2>
        <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 text-center">Authentication required for Bigview Ledger</p>
        <button 
          onClick={login}
          className="w-full max-w-xs py-4 bg-amber-500 text-black font-black rounded-2xl uppercase tracking-[0.2em] active:scale-95 transition-all shadow-xl"
        >
          Sign In
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#060606] text-white pb-32">
      
      {/* 2. THE TOP GOLD BOX */}
      <div className="w-full bg-gradient-to-b from-[#B8860B] via-[#8B6508] to-[#060606] px-6 pt-16 pb-12">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-[1.8rem] bg-black/20 backdrop-blur-md border border-white/20 overflow-hidden flex items-center justify-center shadow-2xl">
              {user?.google?.picture ? (
                <img src={user.google.picture} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={32} className="text-white" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-white">Hi, dear</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-white/20 backdrop-blur-sm text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase border border-white/10">Tier 3 Verified</span>
              </div>
            </div>
          </div>
          <button className="p-3 bg-black/20 rounded-2xl border border-white/10 text-white">
            <Settings size={20} />
          </button>
        </div>

        {/* 3. THE BALANCE CARD */}
        <div className="bg-neutral-900/80 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-xl flex items-center justify-between shadow-2xl">
          <div>
            <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
              Total Balance <EyeOff size={12} className="opacity-50" />
            </p>
            <h2 className="text-4xl font-black italic tracking-tighter uppercase tabular-nums">
              {balance} 
              <span className="text-xs ml-1 text-amber-500">ETH</span>
            </h2>
            <p className="text-amber-500 text-[9px] font-black mt-2 uppercase italic tracking-widest">
              Secured by Bigview Protocol
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
            <div className="w-16 h-16 bg-[#00D094] rounded-full flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(0,208,148,0.3)]">
              <ShieldCheck size={32} className="text-[#004D3C]" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>


        <button 
          onClick={() => logout()}
          className="w-full flex items-center gap-4 p-5 bg-red-500/5 border border-red-500/10 rounded-[2rem] group active:scale-[0.98] transition-all"
        >
          <div className="w-10 h-10 bg-red-500/20 rounded-2xl flex items-center justify-center text-red-500">
            <LogOut size={20} />
          </div>
          <span className="font-black text-sm italic uppercase tracking-tight text-red-500">Terminate Session</span>
        </button>
      </div>
    </main>
  );
}
