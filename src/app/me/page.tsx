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
      <main className="min-h-screen bg-charcoal flex flex-col items-center justify-center pt-8 pb-8">
        <div className="w-20 h-20 bg-gold-buttons rounded-bigview flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(255,215,0,0.2)] border border-white/20">
          <Lock size={32} className="text-black" />
        </div>
        <h2 className="text-white font-black tracking-tighter text-2xl mb-2">Secure Access</h2>
        <p className="text-white/30 text-[10px] font-black tracking-[0.2em] mb-8 text-center">Authentication Required for Bigview Ledger</p>
        <button 
          onClick={login}
          className="w-full max-w-xs py-4 bg-gold-buttons text-black font-black rounded-bigview tracking-tight active:scale-95 transition-all shadow-xl hover:opacity-90"
        >
          Sign In
        </button>
      </main>
    );
  }

  // 2. PROFILE VIEW (Only shows if authenticated)
<<<<<<< HEAD
  return (  
    <main className="min-h-screen text-white pb-16 font-inter bg-charcoal">
=======
  return (
  <main className="min-h-screen text-white pb-16 font-inter bg-charcoal">
    
    {/* THE TOP BRAND BOX */}
    <div className="w-full bg-gold-background px-6 pt-16 pb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-color-white/20 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
>>>>>>> b57fe25a72682584d50ba3317322f67781e8cf45
      
      <div className="flex justify-between items-end relative z-10">
        <div className="flex flex-col items-start justify-center gap-3">
          <div className="flex items-center gap-2"> {/* Fixed "items center" typo here too */}
            <div className="w-16 h-16 rounded-bigview bg-light-black/40 backdrop-blur-md border border-white/20 overflow-hidden flex items-center justify-center shadow-2xl">
              {googlePicture ? (
                <img src={googlePicture} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={30} className="text-color-white" />
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-black tracking-tighter leading-none text-gold-buttons">Hi</h1>
              <div>
                <span className="bg-vibrant-green/50 backdrop-blur-sm text-text-color text-[8px] font-black px-2 py-0.5 rounded-bigview border border-black/10 tracking-tight">Upgrade your account</span>
              </div>
            </div>
          </div> {/* Added closing div */}
        </div> {/* Added closing div */}

        <button className="p-3 bg-black/20 rounded-bigview border border-white/10 text-white hover:bg-black/40 transition-colors">
          <Settings size={20} />
        </button>
      </div>

      {/* BALANCE CARD */}
      <div className="mt-8 flex justify-between items-end">
        <div>
          <p className="text-color-white/40 text-[10px] font-black tracking-tight flex items-center gap-1">
            Total Balance <EyeOff size={12} className="opacity-50" />
          </p>
          <h2 className="text-4xl font-black tracking-tighter tabular-nums">
            {balance} 
            <span className="text-xs ml-2 text-color-white">ETH</span>
          </h2>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(16,185,129,0.3)] border-4 border-black">
            <ShieldCheck size={32} className="text-white" strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </div> {/* This closes THE TOP BRAND BOX */}

<<<<<<< HEAD
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
    </div>
  );
}   n yy
=======
    <div className="px-6 mt-8 space-y-4">
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
>>>>>>> b57fe25a72682584d50ba3317322f67781e8cf45
