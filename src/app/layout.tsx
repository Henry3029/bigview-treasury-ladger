<<<<<<< HEAD
"use client";
import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import '@/styles/globals.css';
import Sidebar from '@/components/Sidebar';
import WelcomeBanner from '@/components/WelcomeBanner';
import MobileHeader from '@/components/MobileHeader'; 
import BottomNav from '@/components/BottomNav';
import NotificationDropdown from '@/components/NotificationDropdown';
import type { Notification } from '@/components/NotificationDropdown';
import Providers from './providers'; 
import { Inter } from 'next/font/google';
import { X } from 'lucide-react';

// Using the utility we created
import { getLiveNotifications } from '@/utils/useNotifications';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, authenticated } = usePrivy();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const userAddress = user?.wallet?.address;
  
  useEffect(() => {
    async function loadNotifications() {
       if (!authenticated || !userAddress) return;
      
      try {
        const data = await getLiveNotifications(userAddress);
        setNotifications(data);
      } catch (error) {
        console.log("failed to fetch big view notifications", error);
      }
    }
    loadNotifications();
  }, [authenticated, userAddress]);

  return (
    <html lang="en">
      <body className={`${inter.variable} font-inter antialiased text-text-color bg-violet-main-background overflow-x-hidden`}>
        <Providers>
          <WelcomeBanner />

          <NotificationDropdown 
            isOpen={isNotifOpen} 
            onClose={() => setIsNotifOpen(false)} 
            notifications={notifications}
          />

          <div className={`lg:hidden fixed inset-0 z-[150] transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsMenuOpen(false)} />
            <aside className={`absolute inset-y-0 left-0 w-[280px] bg-violet-background/95 backdrop-blur-2xl transition-transform duration-300 ease-out shadow-2xl border-r border-white/5 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-full overflow-y-auto"><Sidebar /></div>
                <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-4 p-2 bg-white/5 rounded-bigview text-white/40 active:scale-95 border border-white/5"><X size={20} /></button>
            </aside>
          </div>

          <div className="flex min-h-screen">
            <aside className="hidden lg:block fixed inset-y-0 left-0 w-[260px] border-r border-white/5 bg-black/20 backdrop-blur-sm z-40">
              <Sidebar />
            </aside>
            <div className="flex flex-col flex-1 w-full lg:ml-[260px]">
              <MobileHeader onMenuClick={() => setIsMenuOpen(true)} onNotificationClick={() => setIsNotifOpen(true)} /> 
              <main className="flex-grow w-full min-h-screen">{children}</main>
              <footer className="hidden lg:block p-8 text-center text-[10px] uppercase tracking-[0.4em] text-white/20 border-t border-white/5 italic">
                 2026 Bigview Treasury-Ledger  v2.0
              </footer>
            </div>
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-t border-white/5">
              <BottomNav />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
=======
"use client";
import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import '@/styles/globals.css';
import Sidebar from '@/components/Sidebar';
import WelcomeBanner from '@/components/WelcomeBanner';
import MobileHeader from '@/components/MobileHeader'; 
import BottomNav from '@/components/BottomNav';
import NotificationDropdown from '@/components/NotificationDropdown';
import type { Notification } from '@/components/NotificationDropdown';
import Providers from './providers'; 
import { Inter } from 'next/font/google';
import { X } from 'lucide-react';

// Using the utility we created
import { getLiveNotifications } from '@/utils/useNotifications';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, authenticated } = usePrivy();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const userAddress = user?.wallet?.address;
  
  useEffect(() => {
    async function loadNotifications() {
       if (!authenticated || !userAddress) return;
      
      try {
        const data = await getLiveNotifications(userAddress);
        setNotifications(data);
      } catch (error) {
        console.log("failed to fetch big view notifications", error);
      }
    }
    loadNotifications();
  }, [authenticated, userAddress]);

  return (
    <html lang="en">
      <body className={`${inter.variable} font-inter antialiased text-text-color bg-violet-main-background overflow-x-hidden`}>
        <Providers>
          <WelcomeBanner />

          <NotificationDropdown 
            isOpen={isNotifOpen} 
            onClose={() => setIsNotifOpen(false)} 
            notifications={notifications}
          />

          <div className={`lg:hidden fixed inset-0 z-[150] transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsMenuOpen(false)} />
            <aside className={`absolute inset-y-0 left-0 w-[280px] bg-violet-background/95 backdrop-blur-2xl transition-transform duration-300 ease-out shadow-2xl border-r border-white/5 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-full overflow-y-auto"><Sidebar /></div>
                <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-4 p-2 bg-white/5 rounded-bigview text-white/40 active:scale-95 border border-white/5"><X size={20} /></button>
            </aside>
          </div>

          <div className="flex min-h-screen">
            <aside className="hidden lg:block fixed inset-y-0 left-0 w-[260px] border-r border-white/5 bg-black/20 backdrop-blur-sm z-40">
              <Sidebar />
            </aside>
            <div className="flex flex-col flex-1 w-full lg:ml-[260px]">
              <MobileHeader onNotificationClick={() => setIsNotifOpen(true)} /> 
              <main className="flex-grow w-full min-h-screen">{children}</main>
              <footer className="hidden lg:block p-8 text-center text-[10px] uppercase tracking-[0.4em] text-white/20 border-t border-white/5 italic">
                © 2026 Bigview Treasury-Ledger • v2.0
              </footer>
            </div>
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-t border-white/5">
              <BottomNav />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
>>>>>>> d3ab3257ea93123a52be17586f5117f87f2d0244
}