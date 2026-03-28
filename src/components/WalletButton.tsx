"use client";

import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useState, useEffect } from 'react';

export default function WalletButton() {
  const { login, logout, authenticated, user, ready } = usePrivy();
  const { wallets } = useWallets();
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    // Priority: If an external wallet is connected, show that. 
    // Otherwise, show the address of the Privy embedded wallet.
    const activeWallet = wallets[0]?.address || user?.wallet?.address;
    if (authenticated && activeWallet) {
      setAddress(activeWallet);
    } else {
      setAddress(null);
    }
  }, [authenticated, wallets, user]);

  const handleConnect = () => {
    if (!authenticated) {
      login();
    }
  };

  // Wait for Privy to initialize to avoid "flicker"
  if (!ready) return <div className="px-8 py-3 opacity-0">Loading...</div>;

  return (
    <div className="flex items-center gap-2">
      {authenticated && address ? (
        // LOGGED IN: Displays shortened address
        // Added onClick={logout} just in case you want them to be able to disconnect
        <button 
          onClick={logout}
          className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm border border-slate-800 flex items-center gap-2 shadow-inner hover:bg-slate-800 transition-colors"
        >
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          {`${address.slice(0, 6)}...${address.slice(-4)}`}
        </button>
      ) : (
        // LOGGED OUT: Triggers Privy Login Modal
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