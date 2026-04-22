'use client';

import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { X, Sparkles, Zap } from 'lucide-react';

export default function WelcomeBanner() {
  const { authenticated, ready } = usePrivy();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (ready && authenticated) {
      // 1. CHANGE: Added '_v2' to the key to reset it so you can see it now
      const hasSeenWelcome = sessionStorage.getItem('bigview_welcome_seen_v2');
      if (!hasSeenWelcome) {
        setShowWelcome(true);
      }
    }
  }, [ready, authenticated]);

  const closeBanner = () => {
    setShowWelcome(false);
    sessionStorage.setItem('bigview_welcome_seen_v2', 'true');
  };

  if (!showWelcome) return null;

  return (
  <>
 { /* THE OVERLAY: Dims the rest of the app using Bigview Violet-Background */}
  <div className="fixed inset-0 z-[100] flex items-center justify-center px-2 py-4 bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-500">
    
    <div className="relative w-full max-w-sm flex flex-col items-center">
      
      {/* MAIN CARD: Swapped rounded-3xl for your official rounded-bigview */}
      <div className="w-full bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white px-4 py-6 rounded-bigview relative overflow-hidden shadow-2xl border border-white/10 animate-in slide-in-from-bottom-4 duration-500">
        
        {/* Decorative Brand Glows (Bigview Aesthetic) */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-background/20 rounded-full blur-[60px] -mr-10 -mt-10" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gold-buttons/10 rounded-full blur-[40px] -ml-10 -mb-10" />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Bigview Icon Branding */}
          <div className="mb-6 relative">
            <div className="w-20 h-20 bg-gold-buttons rounded-bigview rotate-12 flex items-center justify-center shadow-2xl shadow-gold-buttons/40 border border-white/20">
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-2xl font-black tracking-tighter leading-none">
                Welcome Home
              </h2>
              <Sparkles size={18} className="text-gold-buttons" />
            </div>
            
            <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.2em]">
              Account Secured
            </p>

            <div className="h-px w-12 bg-charcaol/20 mx-auto my-4" />

            <p className="text-white/70 text-sm font-medium leading-relaxed opacity-90 tracking-tight">
              You're now live on <span className="text-white font-black">Base Sepolia</span>. Start staking to accumulate <span className="text-color-white font-black">BVW</span> governance rewards automatically.
            </p>

            <div className="pt-6 w-full flex flex-col gap-2">
              <button 
                onClick={closeBanner}
                className="w-full py-4 bg-gold-buttons text-color-white rounded-bigview font-black text-sm tracking-tight hover:opacity-90 transition-all shadow-lg shadow-gold-buttons/10 active:scale-95 flex items-center justify-center gap-2"
              >
                <Zap size={16} fill="currentColor" />
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* THE DISMISS BUTTON: Floating below the card */}
      <button 
        onClick={closeBanner} 
        className="mt-8 p-4 bg-gold-background/5 hover:bg-white/10 rounded-full border border-white/10 transition-all group backdrop-blur-md"
      >
        <X size={24} className="text-color-white/40 group-hover:text-white transition-colors" />
      </button>
    </div>
  </div>
  </>
);
}