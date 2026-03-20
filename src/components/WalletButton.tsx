"use client";

import { authenticate, UserSession, AppConfig } from '@stacks/connect';
import { useState, useEffect } from 'react';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export default function WalletButton() {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      setAddress(userData.profile.stxAddress.testnet);
    }
  }, []);

  const handleConnect = () => {
    authenticate({
      appDetails: {
        name: 'Bigview Treasury',
        icon: window.location.origin + '/bigview-image.png',
      },
      userSession,
      onFinish: () => {
        window.location.reload(); 
      },
    });
  };

  return (
    <div className="flex items-center gap-2">
      {address ? (
        // LOGGED IN: This is now a non-clickable Status Badge
        <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm border border-slate-800 flex items-center gap-2 shadow-inner">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          {`${address.slice(0, 5)}...${address.slice(-4)}`}
        </div>
      ) : (
        // LOGGED OUT: This is the clickable button
        <button 
          onClick={handleConnect} 
          className="btn-grain px-8 py-3 bg-orange-500 text-white rounded-2xl font-black hover:bg-orange-600 transition-all active:scale-95 shadow-lg"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}