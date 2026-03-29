'use client';

import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { PartyPopper, X, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export default function WelcomeBanner() {
  const { authenticated, ready } = usePrivy();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (ready && authenticated) {
      // Logic: Only show once per browser session
      const hasSeenWelcome = sessionStorage.getItem('bigview_welcome_seen');
      if (!hasSeenWelcome) {
        setShowWelcome(true);
      }
    }
  }, [ready, authenticated]);

  const closeBanner = () => {
    setShowWelcome(false);
    sessionStorage.setItem('bigview_welcome_seen', 'true');
  };

  if (!showWelcome) return null;

  return (
    // 1. THE OVERLAY: Dims the rest of the app like OPay
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-500">
      
      <div className="relative w-full max-w-sm flex flex-col items-center">
        
        {/* 2. THE MODAL CARD: High-end Fintech aesthetic */}
        <div className="w-full bg-gradient-to-b from-slate-900 via-slate-900 to-black text-white p-8 rounded-[2.5rem] relative overflow-hidden shadow-[0_0_50px_rgba(37,99,235,0.2)] border border-white/10 animate-in zoom-in-95 duration-300">
          
          {/* Decorative Glows */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-[60px] -mr-10 -mt-10" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-[40px] -ml-10 -mb-10" />

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* OPay-style Icon Branding */}
            <div className="mb-6 relative">
              <div className="w-20 h-20 bg-blue-600 rounded-3xl rotate-12 flex items-center justify-center shadow-2xl shadow-blue-500/40 border border-white/20">
                <PartyPopper size={40} className="text-white -rotate-12 animate-bounce" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2 rounded-xl border-4 border-slate-900 shadow-lg">
                <ShieldCheck size={18} className="text-white" />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none">
                  Welcome Home
                </h2>
                <Sparkles size={18} className="text-blue-400" />
              </div>
              
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em]">
                Account Secured via <span className="text-blue-500">Privy</span>
              </p>

              <div className="h-px w-12 bg-white/10 mx-auto my-4" />

              <p className="text-slate-300 text-sm font-medium leading-relaxed opacity-90">
                You're now live on <span className="text-white font-bold">Base Sepolia</span>. Start staking to accumulate <span className="text-blue-400 font-bold">BVW</span> governance rewards automatically.
              </p>

              <div className="pt-6 w-full flex flex-col gap-2">
                <button 
                  onClick={closeBanner}
                  className="w-full py-4 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-50 transition-colors shadow-lg shadow-white/5 active:scale-95 flex items-center justify-center gap-2"
                >
                  <Zap size={16} fill="currentColor" />
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. THE DISMISS BUTTON: Floating below the card like OPay */}
        <button 
          onClick={closeBanner} 
          className="mt-8 p-4 bg-white/10 hover:bg-white/20 rounded-full border border-white/10 transition-all group backdrop-blur-md"
        >
          <X size={24} className="text-white/60 group-hover:text-white transition-colors" />
        </button>
      </div>
    </div>
  );
}