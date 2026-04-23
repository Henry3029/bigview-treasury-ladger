"use client";

import React, { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Bell, User, Copy } from 'lucide-react';
import ProfileDrawer from './ProfileDrawer';

export default function MobileHeader({ 
  onNotificationClick, 
}: { 
  onNotificationClick: () => void;
}) {
  const { user, authenticated, login } = usePrivy(); 
  const address = user?.wallet?.address;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const googleImage = user?.linkedAccounts?.find((acc): acc is any => acc.type === 'google_oauth')?.picture;
  
  // This is the "Lifted State" that ProfileDrawer will update
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

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

  // Helper to determine which image to show in the circle
  const displayImage = avatarUrl || googleImage

  return (
    <>
      {/* 1. TOAST NOTIFICATION */}
      {message && (
        <div className="fixed top-28 left-1/2 -translate-x-1/2 z-[400] animate-in fade-in slide-in-from-top-4">
          <div className="bg-gold-buttons text-text-color text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-bigview shadow-2xl italic border border-white/20">
            {message}
          </div>
        </div>
      )}

      {/* 2. HEADER */}
      <header className="fixed top-0 left-0 right-0 h-24 bg-violet-main-background z-[90] flex items-center px-4 py-2 justify-between font-inter shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-b border-white/5">
      
        <div className="flex items-center gap-4">
        {/* LEFT: Profile Trigger (Now using the Lifted State) */}
        <div className="flex items-center gap-2">
          <button 
            onClick={handleProfileClick}
            className="w-12 h-12 bg-solid-blue rounded-bigview flex items-center justify-center text-white shadow-xl overflow-hidden active:scale-95 transition-all"
          >
            {displayImage ? (
               <img src={displayImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={22} strokeWidth={2.5} />
            )}
          </button>
        </div>

        {/* CENTER: Wallet Pill */}
        <div>
          {authenticated && address ? (
            <button 
              onClick={copyAddress}
              className="flex items-center gap-1.5 px-3 py-2 bg-gold-background/60  rounded-bigview border border-white/30 active:scale-95 transition-all"
            >
              <div className="w-1.5 h-1.5 bg-light-green/60 rounded-full animate-pulse shadow-[0_0_8px_#ffd700]" />
              <span className="text-[10px] font-black text-text-color tracking-tighter uppercase">
                {address.slice(0, 4)}...{address.slice(-4)}
              </span>
              <Copy size={10} className="text-white/60" />
            </button>
          ) : (
            <button 
              onClick={login}
              className="bg-gradient-to-br from-bigview-gold to-bigview-gold-dim p-1 rounded-bigview text-[13px] font-black text-white tracking-tight hover:opacity-80 transition-opacity"
            >
              Connect
            </button>
          )}
        </div>
        </div>
        

        {/* RIGHT: Branding */}
        <div className="flex items-center gap-3">
          <button onClick={onNotificationClick} className="p-2 text-gold-buttons/70 hover:text-gold-buttons transition-colors">
            <Bell size={20} />
          </button>
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="w-9 h-9 bg-white rounded-bigview flex items-center justify-center shadow-lg">
              <img src="/images/bigview-image.png" alt="BigView Logo" className="w-6 h-6 object-contain" />
            </div>
           <span className="text-[9px] font-black tracking-tight text-white uppercase">
  Bi<span className="text-gold-buttons">g</span>Vi<span className="text-gold-buttons">ew</span>
</span>
          </div>
        </div>
      </header>

      {/* 3. MODAL LAYER (The Drawer now receives the state and the setter) */}
      <ProfileDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        avatarUrl={avatarUrl}
        setAvatarUrl={setAvatarUrl}
      />
    </>
  );
}