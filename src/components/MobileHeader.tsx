"use client";

import React, { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Bell, User, Copy } from 'lucide-react';
import ProfileDrawer from './ProfileDrawer'; // Ensure path is correct

export default function MobileHeader({ 
  onNotificationClick 
}: { 
  onNotificationClick: () => void;
}) {
  const { user, authenticated, login } = usePrivy(); 
  const address = user?.wallet?.address;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const notify = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      notify("Address Copied!");
    }
  };

  const handleProfileClick = () => {
    if (!authenticated) return login();
    setIsDrawerOpen(true);
  };

  return (
  <>
    {/* 1. TOAST NOTIFICATION: Using Bigview Gold and rounded-bigview */}
    {message && (
      <div className="fixed top-28 left-1/2 -translate-x-1/2 z-[400] animate-in fade-in slide-in-from-top-4">
        <div className="bg-gold-buttons text-text-color text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-bigview shadow-2xl italic border border-white/20">
          {message}
        </div>
      </div>
    )}

    {/* 2. HEADER: Swapped to Violet Background for brand consistency */}
    <header className="fixed top-0 left-0 right-0 h-24 bg-violet-background z-[90] flex items-center px-4 justify-between font-inter shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-b border-white/5">
      
      {/* LEFT: Profile Trigger */}
      <div className="flex items-center">
        <button 
          onClick={handleProfileClick}
          className="w-12 h-12 bg-violet-glow/20 backdrop-blur-md rounded-bigview flex items-center justify-center text-white border border-white/20 shadow-xl overflow-hidden active:scale-95 transition-all"
        >
          {user?.google?.picture ? (
             <img src={user.google.picture} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User size={24} strokeWidth={2.5} />
          )}
        </button>
      </div>

      {/* CENTER: Wallet Pill with Violet-Glow accents */}
      <div className="flex-1 flex justify-center px-2">
        {authenticated && address ? (
          <button 
            onClick={copyAddress}
            className="flex items-center gap-1.5 px-3 py-2 bg-violet-glow/10 backdrop-blur-md rounded-bigview border border-white/10 active:scale-95 transition-all"
          >
            <div className="w-1.5 h-1.5 bg-gold-buttons rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-white tracking-tighter uppercase italic">
              {address.slice(0, 4)}...{address.slice(-4)}
            </span>
            <Copy size={10} className="text-white/40" />
          </button>
        ) : (
          <button 
            onClick={login}
            className="text-[10px] font-black text-gold-buttons uppercase tracking-[0.2em] hover:opacity-80 transition-opacity"
          >
            Connect
          </button>
        )}
      </div>

      {/* RIGHT: Branding with rounded-bigview logo box */}
      <div className="flex items-center gap-3">
        <button onClick={onNotificationClick} className="p-2 text-white/60 hover:text-gold-buttons transition-colors">
          <Bell size={20} />
        </button>
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="w-9 h-9 bg-white rounded-bigview flex items-center justify-center shadow-lg">
            <img src="/bigview-image.png" alt="Logo" className="w-6 h-6 object-contain" />
          </div>
          <span className="text-[7px] font-black uppercase tracking-widest text-white italic">BigView</span>
        </div>
      </div>
    </header>

    {/* MODAL LAYER */}
    <ProfileDrawer 
      isOpen={isDrawerOpen} 
      onClose={() => setIsDrawerOpen(false)} 
    />
  </>
);
}