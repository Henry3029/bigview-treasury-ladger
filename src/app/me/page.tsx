'use client';

import React, { useEffect, useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { createPublicClient, http, formatEther } from 'viem';
import { baseSepolia } from 'viem/chains';
import { 
  Info, 
  EyeOff, 
  LogOut, 
  Copy, 
  Lock,
  User,
  Settings,
  ShieldCheck 
} from 'lucide-react';

export default function MePage() {
  const { login, logout, authenticated, ready, user } = usePrivy();
  const { wallets } = useWallets();
  
  const [mounted, setMounted] = useState(false);
  const [balance, setBalance] = useState("0.0000");

  const address = user?.wallet?.address || wallets[0]?.address;
  const googlePicture = user?.linkedAccounts?.find((acc) => acc.type === 'google_oauth')?.picture;

  useEffect(() => {
    setMounted(true);
    
    const fetchBalance = async () => {
      if (address) {
        try {
          const publicClient = createPublicClient({
            chain: baseSepolia,
            transport: http(),
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

  // 1. LOGIN SCREEN (If not logged in)
  if (!authenticated) {
    return (
      <main className="min-h-screen bg-color-ash flex flex-col items-center justify-center pt-8 pb-8">
        <div className="w-20 h-20 bg-gold-buttons rounded-bigview flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(255,215,0,0.2)] border border-white/20">
          <Lock size={32} className="text-black" />
        </div>
        <h2 className="text-white font-black tracking-tighter text-2xl mb-2">Secure Access</h2>
        <p className="text-white/30 text-[10px] font-black tracking-[0.2em] mb-8 text-center">Authentication Required for Bigview Ledger</p>
        <button 
          onClick={login}
          className="w-full max-w-xs py-4 bg-gold-buttons text-black font-black rounded-bigview tracking-[0.2em] active:scale-95 transition-all shadow-xl hover:opacity-90"
        >
          Sign In
        </button>
      </main>
    );
  }

  // 2. PROFILE VIEW (Only shows if authenticated)
  return (
    <main className="min-h-screen text-white pb-16 font-inter bg-color-ash">
      
      {/* THE TOP BRAND BOX */}
      <div className="w-full bg-gradient-to-b from-gold-buttons via-[#B8860B] to-transparent px-6 pt-16 pb-12">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-bigview bg-black/20 backdrop-blur-md border border-white/20 overflow-hidden flex items-center justify-center shadow-2xl">
  {googlePicture ? (
    <img src={googlePicture} alt="Avatar" className="w-full h-full object-cover" />
  ) : (
    <User size={32} className="text-color-white" />
  )}
</div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter leading-none text-white">Hi, Henry</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-color-ash/20 backdrop-blur-sm text-white text-[8px] font-black px-2 py-0.5 rounded-bigview border border-white/10 tracking-tight">Tier 3 Verified</span>
              </div>
            </div>
          </div>
          <button className="p-3 bg-black/20 rounded-bigview border border-white/10 text-white hover:bg-black/40 transition-colors">
            <Settings size={20} />
          </button>
        </div>

        {/* BALANCE CARD */}
        <div className="bg-color-ash/60 p-6 rounded-bigview border border-white/10 backdrop-blur-xl flex items-center justify-between shadow-2xl">
          <div>
            <p className="text-color-white/40 text-[10px] font-black tracking-tight mb-1 flex items-center gap-2">
              Total Balance <EyeOff size={12} className="opacity-50" />
            </p>
            <h2 className="text-4xl font-black tracking-tighter tabular-nums">
              {balance} 
              <span className="text-xs ml-2 text-gold-buttons">ETH</span>
            </h2>
            <p className="text-blue text-[9px] font-black mt-2 tracking-tight">
              Secured by Bigview Protocol
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(16,185,129,0.3)] border-4 border-black">
              <ShieldCheck size={32} className="text-black" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-4">
        {/* TERMINATE SESSION */}
        <button 
          onClick={() => logout()}
          className="w-full flex items-center gap-4 p-5 bg-red-500/5 border border-red-500/10 rounded-bigview group active:scale-[0.98] transition-all hover:bg-red-500/10"
        >
          <div className="w-10 h-10 bg-red-500/20 rounded-bigview flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
            <LogOut size={20} />
          </div>
          <span className="font-black text-sm tracking-tight text-red-500">Terminate Session</span>
        </button>
      </div>
    </main>
  );
}