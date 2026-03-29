"use client";
import React, { useState, useEffect } from 'react';
import { X, Menu, Bell, User, Wallet } from 'lucide-react'; 
import Image from 'next/image';
import Sidebar from './Sidebar'; 
import ProfileDrawer from './ProfileDrawer';
import NotificationDropdown, { Notification } from './NotificationDropdown';
import { usePrivy, useWallets } from '@privy-io/react-auth'; // Switched to Privy

export default function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  // PRIVY HOOKS
  const { login, authenticated, user, ready } = usePrivy();
  const { wallets } = useWallets();
  const [activeAddress, setActiveAddress] = useState<string | null>(null);

  // Address logic: Checks external wallets first, then embedded Privy wallet
  useEffect(() => {
    const walletAddress = wallets[0]?.address || user?.wallet?.address;
    if (authenticated && walletAddress) {
      setActiveAddress(walletAddress);
    } else {
      setActiveAddress(null);
    }
  }, [authenticated, wallets, user]);

  const truncatedAddress = activeAddress 
    ? `${activeAddress.slice(0, 4)}...${activeAddress.slice(-4)}`
    : "";

  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Welcome to Bigview',
      description: 'Your treasury dashboard is live on Base Sepolia.',
      type: 'success',
      time: 'JUST NOW'
    }
  ]);

  const handleToggleNotifications = () => {
    setIsNotifOpen(!isNotifOpen);
    if (!isNotifOpen) setHasUnread(false);
  };

  // Prevent UI flicker while Privy is loading
  if (!ready) return <div className="h-[65px] bg-white border-b border-slate-100" />;

  return (
    <>
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-[60]">
        
        {/* LEFT SIDE: Profile + Notifications */}
        <div className="flex items-center gap-1.5 relative">
          <button 
            onClick={handleToggleNotifications} 
            className="p-2 text-slate-600 hover:bg-slate-50 rounded-full relative active:scale-90"
          >
            <Bell size={20} />
            {hasUnread && (
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
            )}
          </button>

          <NotificationDropdown 
            isOpen={isNotifOpen} 
            onClose={() => setIsNotifOpen(false)} 
            notifications={notifications}
          />

          <div className="flex items-center gap-2">
            {authenticated ? (
              /* LOGGED IN: Green Dot + Shortened Address */
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full shadow-inner">
                <div className="w-2 h-2 bg-[#00D094] rounded-full shadow-[0_0_8px_#00D094]"></div>
                <span className="text-[11px] font-black tracking-tighter text-slate-900 tabular-nums uppercase">
                  {truncatedAddress}
                </span>
              </div>
            ) : (
              /* LOGGED OUT: Privy Connect Trigger */
              <button 
                onClick={login}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-100 active:scale-95 transition-all"
              >
                <Wallet size={12} strokeWidth={3} />
                <span className="text-[10px] font-black uppercase tracking-wider">Connect</span>
              </button>
            )}

            <button 
              onClick={() => setIsProfileOpen(true)}
              className="p-0.5 border border-slate-200 rounded-full overflow-hidden bg-slate-50 active:scale-95 transition-transform"
            >
              <div className="w-7 h-7 flex items-center justify-center text-slate-400">
                <User size={18} />
              </div>
            </button>
          </div>
        </div>

        {/* RIGHT SIDE: Menu + Logo */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-2 px-1">
            <div className="p-1 bg-blue-600 rounded-lg shadow-sm">
              <Image 
                src="/images/bigview-image.png"
                alt="BigView" 
                width={22} 
                height={22} 
                className="object-contain"
              />
            </div>
            <span className="font-black text-slate-900 tracking-tighter text-md italic">Bigview</span>
          </div>
        </div>
      </header>

      {/* NAVIGATION DRAWER - Sliding from Right */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-[300px] bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="p-4 flex justify-between items-center border-b border-slate-100">
              <span className="font-bold text-slate-900 text-lg italic uppercase tracking-tighter">Menu</span>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 text-slate-400"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto">
               <Sidebar isMobile={true} closeMobileMenu={() => setIsMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}

      <ProfileDrawer isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
}