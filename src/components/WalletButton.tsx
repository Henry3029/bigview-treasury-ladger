"use client";

import { showConnect, authenticate } from '@stacks/connect';
import { STACKS_TESTNET } from '@stacks/network';
import { useState, useEffect } from 'react';

export default function WalletButton() {
  const [address, setAddress] = useState<string | null>(null);

  const handleConnect = () => {
    showConnect({
      appDetails: {
        name: 'Bigview Treasury',
        icon: window.location.origin + '/bigview-image.png', // Put your logo in the public folder
      },
      onFinish: (data) => {
        // This is where you get the real ST... address
        const userData = data.userSession.loadUserData();
        setAddress(userData.profile.stxAddress.testnet); 
      },
      userSession: undefined, // The library handles the session for you
    });
  };

  return (
    <button 
      onClick={handleConnect} 
      className="btn-grain flex flex-col items-center justify-center disabled:opacity-50"
    >
      {address ? `STX: ${address.slice(0, 5)}...` : "Connect Wallet"}
    </button>
  );
}