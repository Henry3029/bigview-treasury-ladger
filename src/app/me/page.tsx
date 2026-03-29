'use client';

import React, { useEffect, useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useBalance } from 'wagmi';
import { 
  ShieldCheck, 
  ChevronRight, 
  History, 
  User, 
  Settings, 
  Headphones, 
  Lock, 
  Info,
  ExternalLink,
  EyeOff,
  LogOut,
  Copy,
  Check
} from 'lucide-react';

export default function MePage() {
  const { login, logout, authenticated, ready, user } = usePrivy();
  const { wallets } = useWallets();
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  const address = wallets[0]?.address as `0x${string}`;
  const { data: balanceData } = useBalance({ address });

  useEffect(() => { setMounted(true); }, []);

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!mounted || !ready) return null;

  // Unauthenticated State (Login Screen)
  if (!authenticated) {
    return (
      <main className="min-h-screen bg-[#060606] flex flex-col items-center justify-center p-8">
        <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(245,158,11,0.3)]">
          <Lock size={32} className="text-black" />
        </div>
        <button 
          onClick={login}
          className="w-full max-w-xs py-4 bg-amber-500 text-black font-black rounded-2xl uppercase tracking-widest active:scale-95 transition-all"
        >
          Sign In to Bigview
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#060606] text-white pb-32 font-inter">
      
      {/* 1. THE TOP GOLD BOX (Replacing the OPay Green) */}
      <div className="w-full bg-gradient-to-b from-[#B8860B] via-[#8B6508] to-[#060606] px-6 pt-12 pb-12">
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
              <h1 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-white">Hi, Henry</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-white/20 backdrop-blur-sm text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase border border-white/10">Upgrade to Tier 3</span>
              </div>
            </div>
          </div>
          <button className="p-3 bg-black/20 rounded-2xl border border-white/10 text-white shadow-lg">
            <Settings size={20} />
          </button>
        </div>

        {/* 2. THE BALANCE CARD WITH ACTIVE SHIELD */}
        <div className="bg-neutral-900/80 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-xl flex items-center justify-between shadow-2xl">
          <div>
            <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
              Total Balance <EyeOff size={12} className="inline ml-1 opacity-50" />
            </p>
            <h2 className="text-4xl font-black italic tracking-tighter uppercase tabular-nums">
              {balanceData ? parseFloat(balanceData.formatted).toFixed(4) : "0.0000"} 
              <span className="text-xs ml-1 text-amber-500 uppercase">ETH</span>
            </h2>
            <p className="text-amber-500 text-[9px] font-black mt-2 uppercase italic tracking-widest">
              Interest Credited Today ****
            </p>
          </div>

          {/* SPREADING SHIELD ANIMATION */}
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
            <div className="w-16 h-16 bg-[#00D094] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,208,148,0.4)] relative z-10">
              <ShieldCheck size={32} className="text-[#004D3C]" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-4 -mt-4">
        {/* 3. SAFETY TIPS BANNER */}
        <div className="bg-[#00D094] p-4 rounded-2xl flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <div>
              <p className="text-[#004D3C] text-[10px] font-black uppercase">3 Safety Tips</p>
              <p className="text-[#004D3C]/70 text-[9px] font-bold">Make your account more secure.</p>
            </div>
          </div>
          <button className="px-4 py-1.5 bg-[#004D3C] text-white text-[9px] font-black rounded-full uppercase">View</button>
        </div>

        {/* 4. LINKS SECTION */}
        <div className="bg-neutral-900/60 rounded-[2.5rem] border border-white/5 p-2 shadow-xl">
          <ProfileItem icon={<History className="text-blue-500" />} title="Transaction History" href="/history" />
          <ProfileItem icon={<Lock className="text-emerald-500" />} title="Account Limits" href="/limits" />
          <ProfileItem icon={<Info className="text-amber-500" />} title="About Bigview" href="/about" />
          <ProfileItem icon={<Headphones className="text-pink-500" />} title="Customer Service" href="/contact" />
        </div>

        {/* 5. LOGOUT BUTTON */}
        <button 
          onClick={() => logout()}
          className="w-full flex items-center gap-4 p-5 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-[2rem] transition-all group"
        >
          <div className="w-10 h-10 bg-red-500/20 rounded-2xl flex items-center justify-center text-red-500">
            <LogOut size={20} />
          </div>
          <span className="font-black text-sm italic uppercase tracking-tight text-red-500">End Session</span>
        </button>
      </div>
    </main>
  );
}

function ProfileItem({ icon, title, href }: { icon: React.ReactNode, title: string, href: string }) {
  return (
    <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-all rounded-[1.8rem] group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-neutral-800 rounded-2xl flex items-center justify-center border border-white/5">
          {icon}
        </div>
        <h4 className="text-sm font-black italic uppercase tracking-tight text-neutral-200">{title}</h4>
      </div>
      <ChevronRight size={18} className="text-neutral-700 group-hover:text-white transition-colors" />
    </button>
  );
}