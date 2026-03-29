"use client";

import React, { useState } from 'react';
import '@/styles/globals.css';
import Sidebar from '@/components/Sidebar';
import WelcomeBanner from '@/components/WelcomeBanner';
import MobileHeader from '@/components/MobileHeader'; 
import BottomNav from '@/components/BottomNav';
import NotificationDropdown, { Notification } from '@/components/NotificationDropdown'; // Import this
import Providers from './providers'; 
import { Inter } from 'next/font/google';
import { X } from 'lucide-react';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

// Dummy data to show inside the bell when it opens
const DUMMY_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Deposit Successful',
    description: '0.05 ETH has been added to your treasury vault.',
    type: 'success',
    time: '2m ago'
  },
  {
    id: '2',
    title: 'Protocol Update',
    description: 'Bigview V2.0 is now live on Base Sepolia.',
    type: 'pending',
    time: '1h ago'
  }
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false); // NEW STATE FOR BELL

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased text-white bg-neutral-950 overflow-x-hidden`}>
        <Providers>
          <WelcomeBanner />

          {/* 1. NOTIFICATION DROPDOWN (OPay Style) */}
          <NotificationDropdown 
            isOpen={isNotifOpen} 
            onClose={() => setIsNotifOpen(false)} 
            notifications={DUMMY_NOTIFICATIONS}
          />

          {/* 2. MOBILE SIDEBAR DRAWER */}
          <div className={`lg:hidden fixed inset-0 z-[150] transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
              onClick={() => setIsMenuOpen(false)} 
            />
            <aside className={`absolute inset-y-0 left-0 w-[280px] bg-neutral-950 transition-transform duration-300 ease-out shadow-2xl border-r border-white/5 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
               <div className="h-full overflow-y-auto">
                 <Sidebar />
               </div>
               <button 
                 onClick={() => setIsMenuOpen(false)} 
                 className="absolute top-6 right-4 p-2 bg-neutral-900 rounded-xl text-neutral-500 active:scale-95 border border-white/5"
               >
                 <X size={20} />
               </button>
            </aside>
          </div>

          <div className="flex min-h-screen">
            <aside className="hidden lg:block fixed inset-y-0 left-0 w-[260px] border-r border-white/5 bg-neutral-950 z-40">
              <Sidebar />
            </aside>

            <div className="flex flex-col flex-1 w-full lg:ml-[260px]">
              
              {/* 3. MOBILE HEADER: Now passing BOTH click handlers */}
              <MobileHeader 
                onMenuClick={() => setIsMenuOpen(true)} 
                onNotificationClick={() => setIsNotifOpen(true)} // NOW CONNECTED
              /> 

              <main className="flex-grow w-full min-h-screen">
                {children}
              </main>

              <footer className="hidden lg:block p-8 text-center text-[10px] uppercase tracking-widest text-neutral-600 border-t border-white/5 bg-neutral-950">
                © 2026 Bigview Treasury-Ledger
              </footer>
            </div>

            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-t border-white/5">
              <BottomNav />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}