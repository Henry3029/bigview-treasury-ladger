"use client";

import React from 'react';
import { useRouter } from 'next/navigation'; // 1. Import the router
import { usePrivy } from '@privy-io/react-auth';
import { Bell, Menu, User, Copy } from 'lucide-react';

export default function MobileHeader({ 
  onMenuClick, 
  onNotificationClick 
}: { 
  onMenuClick: () => void;
  onNotificationClick: () => void;
}) {
  const { user, authenticated, login } = usePrivy(); // Removed configureWallet here
  const router = useRouter(); // 2. Initialize the router
  const address = user?.wallet?.address;
  
  // 3. ADD THIS FUNCTION HERE
  const handleProfileClick = () => {
    if (authenticated) {
      router.push('/me'); // Navigate to your beautiful Gold Me page
    } else {
      login(); // If not logged in, show the login modal
    }
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#B8860B] via-[#916a06] to-[#060606] z-[100] flex items-center px-4 justify-between font-inter shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-b border-white/5">
      
      {/* 1. LEFT SIDE: Profile (Styled with glass effect for Gold BG) */}
      <div className="flex items-center">
        <button 
          onClick={handleProfileClick}
          className="w-12 h-12 bg-black/20 backdrop-blur-md rounded-[1.4rem] flex items-center justify-center text-white border border-white/20 shadow-xl overflow-hidden active:scale-95 transition-all"
        >
          {user?.google?.picture ? (
             <img src={user.google.picture} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User size={24} strokeWidth={2.5} />
          )}
        </button>
      </div>

      {/* 2. CENTER: Wallet Address (Transparent pill to show Gold through) */}
      <div className="flex-1 flex justify-center">
        {authenticated && address ? (
          <button 
            onClick={copyAddress}
            className="flex items-center gap-1.5 px-3 py-2 bg-black/20 backdrop-blur-md rounded-full border border-white/10 active:scale-95 transition-all shadow-inner"
          >
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="text-[10px] font-black text-white tracking-tighter uppercase italic">
              {address.slice(0, 4)}...{address.slice(-4)}
            </span>
            <Copy size={10} className="text-white/40" />
          </button>
        ) : (
          <button 
            onClick={login}
            className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]"
          >
            Connect Wallet
          </button>
        )}
      </div>

      {/* 3. RIGHT SIDE: Notification & Menu (Darker buttons for contrast) */}
      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <button 
          onClick={onNotificationClick}
          className="p-3 bg-black/20 backdrop-blur-md rounded-2xl text-white hover:text-amber-200 border border-white/10 transition-all active:scale-90 shadow-lg"
        >
          <Bell size={20} strokeWidth={2.5} />
        </button>

        {/* Hamburger Menu */}
        <button 
          onClick={onMenuClick}
          className="p-3 text-white/80 hover:bg-white/10 rounded-xl transition-all active:scale-90"
        >
          <Menu size={26} strokeWidth={2.5} />
        </button>
      </div>
</header>
  );
}