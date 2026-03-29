"use client";

import React from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Bell, Menu, User, Copy } from 'lucide-react';

// 1. We add 'onMenuClick' here so the Layout can listen to this button
export default function MobileHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, authenticated, login, configureWallet } = usePrivy();
  const address = user?.wallet?.address;

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      // No alert needed, it's cleaner without it
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-md border-b border-slate-100 z-[100] flex items-center px-4 justify-between">
      
      {/* 1. LEFT SIDE: Notification */}
      <button className="p-2.5 bg-slate-50 rounded-2xl text-slate-400 hover:text-blue-600 transition-colors">
        <Bell size={20} />
      </button>

      {/* 2. CENTER: Address */}
      <div className="flex flex-col items-center">
        {authenticated && address ? (
          <button 
            onClick={copyAddress}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100 animate-in fade-in duration-500"
          >
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-blue-600 tracking-tighter uppercase italic">
              {address.slice(0, 4)}...{address.slice(-4)}
            </span>
            <Copy size={10} className="text-blue-300" />
          </button>
        ) : (
          <button 
            onClick={login}
            className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]"
          >
            Disconnected
          </button>
        )}
      </div>

      {/* 3. RIGHT SIDE: Profile and Hamburger */}
      <div className="flex items-center gap-2">
        <button 
          onClick={authenticated ? configureWallet : login}
          className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 border border-white shadow-sm overflow-hidden active:scale-95 transition-transform"
        >
          {user?.google?.picture ? (
             <img src={user.google.picture} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User size={20} />
          )}
        </button>

        {/* 2. THE FIX: We call 'onMenuClick' here when the hamburger is tapped */}
        <button 
          onClick={onMenuClick}
          className="p-2.5 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors active:scale-95"
        >
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
}