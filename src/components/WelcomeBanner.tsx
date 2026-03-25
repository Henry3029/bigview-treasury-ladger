'use client';

import { UserSession, AppConfig } from '@stacks/connect';
import { useState, useEffect } from 'react';
import { PartyPopper, X } from 'lucide-react';

// 1. INITIALIZE NATIVE STACKS SESSION
const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export default function WelcomeBanner() {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // 2. NATIVE CHECK: If signed in, show welcome for this session
    if (userSession.isUserSignedIn()) {
      // Logic: Show if they just connected in this browser session
      // We use sessionStorage so it doesn't pop up every single page refresh
      const hasSeenWelcome = sessionStorage.getItem('bigview_welcome_seen');
      
      if (!hasSeenWelcome) {
        setShowWelcome(true);
      }
    }
  }, []);

  const closeBanner = () => {
    setShowWelcome(false);
    sessionStorage.setItem('bigview_welcome_seen', 'true');
  };

  if (!showWelcome) return null;

  return (
    <div className="bg-blue-600 text-white p-6 rounded-3xl mb-8 relative overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start justify-between relative z-10">
        <div className="flex gap-4">
          <div className="bg-white/20 p-3 rounded-2xl">
            <PartyPopper size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold italic tracking-tight">Welcome to Bigview Treasury!</h2>
            <p className="text-blue-100 text-sm mt-1 max-w-md">
              Your Stacks wallet is connected. You're now ready to stake STX and manage your rewards directly on-chain.
            </p>
          </div>
        </div>
        <button onClick={closeBanner} className="text-white/60 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>
      {/* Decorative background circle */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
    </div>
  );
}