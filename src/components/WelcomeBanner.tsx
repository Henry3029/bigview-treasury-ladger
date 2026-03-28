'use client';

import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { PartyPopper, X, Sparkles } from 'lucide-react';

export default function WelcomeBanner() {
  const { authenticated, ready } = usePrivy();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // 1. PRIVY AUTH CHECK
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
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 rounded-[2.5rem] mb-10 relative overflow-hidden shadow-2xl shadow-blue-200/50 animate-in fade-in slide-in-from-top-4 duration-700">
      
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/20 rounded-full blur-[40px] -ml-10 -mb-10" />

      <div className="flex items-start justify-between relative z-10">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="bg-white/20 backdrop-blur-md p-4 rounded-[1.5rem] border border-white/20 self-start">
            <PartyPopper size={32} className="text-white animate-bounce" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black italic tracking-tighter uppercase">
                Welcome to Bigview
              </h2>
              <Sparkles size={18} className="text-blue-200" />
            </div>
            
            <p className="text-blue-50 text-sm font-medium max-w-lg leading-relaxed opacity-90">
              Your account is successfully secured with **Privy**. You're now live on **Base Sepolia** and ready to accumulate **BVW** governance rewards by participating in the treasury.
            </p>

            <div className="pt-2 flex gap-3">
              <span className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/10">
                Network: Base
              </span>
              <span className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/10">
                Status: Ready
              </span>
            </div>
          </div>
        </div>

        <button 
          onClick={closeBanner} 
          className="p-2 bg-black/10 hover:bg-black/20 rounded-xl transition-all group"
        >
          <X size={20} className="text-white/60 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
        </button>
      </div>
    </div>
  );
}