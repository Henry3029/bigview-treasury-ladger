"use client";

import { authenticate, UserSession, AppConfig } from '@stacks/connect';
import { useState, useEffect } from 'react';

// 1. Setup the session configuration
const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export default function WalletButton() {
  const [address, setAddress] = useState<string | null>(null);

  // 2. Check if user is already signed in when the page loads
  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      setAddress(userData.profile.stxAddress.testnet);
    }
  }, []);

  const handleConnect = () => {
    // 3. Use authenticate instead of showConnect
    authenticate({
      appDetails: {
        name: 'Bigview Treasury',
        icon: window.location.origin + '/bigview-image.png',
      },
      userSession, // This is required so the app remembers the login
      onFinish: () => {
        const userData = userSession.loadUserData();
        setAddress(userData.profile.stxAddress.testnet);
        // Optional: reload to sync the rest of the app
        // window.location.reload(); 
      },
      onCancel: () => {
        console.log('User cancelled login');
      },
    });
  };

  const handleLogout = () => {
    userSession.signUserOut();
    setAddress(null);
    window.location.reload();
  };

  return (
    <button 
      onClick={address ? handleLogout : handleConnect} 
      className="btn-grain flex flex-col items-center justify-center transition-all active:scale-95"
    >
      {address 
        ? `STX: ${address.slice(0, 5)}...${address.slice(-4)}` 
        : "Connect Wallet"
      }
    </button>
  );
}