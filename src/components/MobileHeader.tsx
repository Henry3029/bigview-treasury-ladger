"use client";
import React, { useState, useEffect } from 'react';
import { X, Menu, Bell, User } from 'lucide-react'; 
import Image from 'next/image';
import Sidebar from './Sidebar'; 
import ProfileDrawer from './ProfileDrawer';
import NotificationDropdown, { Notification } from './NotificationDropdown';
import { useWatchContractEvent } from 'wagmi'; // 1. Import Wagmi hook
import { treasuryAbi } from '@/lib/abi'; // Ensure you have your ABI exported here

export default function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false); // Start false until an event hits

  // 2. Local state to store live notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // 3. LISTEN FOR EVENTS (e.g., "Stake" event)
  useWatchContractEvent({
    address: process.env.NEXT_PUBLIC_TREASURY_CONTRACT_ADDRESS as `0x${string}`,
    abi: treasuryAbi,
    eventName: 'Stake', // Change this to whatever your contract event is named
    onLogs(logs) {
      console.log('New Event Detected!', logs);
      
      const newNotif: Notification = {
        id: Math.random().toString(),
        title: 'New Stake Detected',
        description: 'A new deposit has been confirmed on Base Sepolia.',
        type: 'success',
        time: 'JUST NOW'
      };

      // Add to the top of the list and show the red dot
      setNotifications(prev => [newNotif, ...prev]);
      setHasUnread(true);
    },
  });

  const handleToggleNotifications = () => {
    setIsNotifOpen(!isNotifOpen);
    if (!isNotifOpen) {
      setHasUnread(false);
    }
  };

  return (
    <>
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-[60]">
        
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMenuOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-md">
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-2 px-1">
            <div className="p-1 bg-blue-600 rounded-lg shadow-sm">
              <Image src="/logo.png" alt="Bigview" width={22} height={22} className="brightness-0 invert" />
            </div>
            <span className="font-bold text-slate-900 tracking-tight text-md">Bigview</span>
          </div>
        </div>

        <div className="flex items-center gap-1 relative">
          <button onClick={handleToggleNotifications} className="p-2 text-slate-600 hover:bg-slate-50 rounded-full relative transition-transform active:scale-90">
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

          <button onClick={() => setIsProfileOpen(true)} className="ml-1 p-0.5 border border-slate-200 rounded-full overflow-hidden bg-slate-50 active:scale-95">
            <div className="w-7 h-7 flex items-center justify-center text-slate-400">
              <User size={18} />
            </div>
          </button>
        </div>
      </header>

      {/* NAVIGATION DRAWER */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-[300px] bg-white shadow-2xl flex flex-col">
            <div className="p-4 flex justify-between items-center border-b border-slate-100">
              <span className="font-bold text-slate-900 text-lg">Menu</span>
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