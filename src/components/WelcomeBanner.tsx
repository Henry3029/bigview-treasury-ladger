'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useState, useEffect } from 'react';
import { PartyPopper, X } from 'lucide-react';

export default function WelcomeBanner() {
  const { user, authenticated } = usePrivy();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Check if the user signed up in the last 60 seconds
    if (authenticated && user?.createdAt) {
      const now = new Date().getTime();
      const signupTime = new Date(user.createdAt).getTime();
      
      if (now - signupTime < 60000) {
        setShowWelcome(true);
      }
    }
  }, [authenticated, user]);

  if (!showWelcome) return null;

  return (
    <div className="bg-blue-600 text-white p-6 rounded-3xl mb-8 relative overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start justify-between relative z-10">
        <div className="flex gap-4">
          <div className="bg-white/20 p-3 rounded-2xl">
            <PartyPopper size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Welcome to the Treasury!</h2>
            <p className="text-blue-100 text-sm mt-1 max-w-md">
              Your Stacks account has been created. You're now ready to stake STX and earn sBTC rewards.
            </p>
          </div>
        </div>
        <button onClick={() => setShowWelcome(false)} className="text-white/60 hover:text-white">
          <X size={20} />
        </button>
      </div>
      {/* Decorative background circle */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
    </div>
  );
}