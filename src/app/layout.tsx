"use client"; // REQUIRED for the menu state to work

import React, { useState } from 'react';
import '@/styles/globals.css';
import Sidebar from '@/components/Sidebar';
import WelcomeBanner from '@/components/WelcomeBanner';
import MobileHeader from '@/components/MobileHeader'; 
import BottomNav from '@/components/BottomNav';
import Providers from './providers'; 
import { Inter } from 'next/font/google';
import { X } from 'lucide-react';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <html lang="en">
      {/* 1. THE DARK FOUNDATION: Switched bg-slate-50 to bg-neutral-950 and text to white */}
      <body className={`${inter.className} antialiased text-white bg-neutral-950 overflow-x-hidden`}>
        <Providers>
          <WelcomeBanner />

          {/* 2. OPay-STYLE MOBILE SIDEBAR DRAWER */}
          <div className={`lg:hidden fixed inset-0 z-[150] transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {/* Darker Blurred Backdrop like OPay */}
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
              onClick={() => setIsMenuOpen(false)} 
            />
            
            {/* Sliding Sidebar: Using bg-neutral-900 for that deep fintech grey */}
            <aside className={`absolute inset-y-0 left-0 w-[280px] bg-neutral-950 transition-transform duration-300 ease-out shadow-2xl border-r border-white/5 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
               <div className="h-full overflow-y-auto">
                 <Sidebar />
               </div>
               
               {/* Close Button inside the menu */}
               <button 
                 onClick={() => setIsMenuOpen(false)} 
                 className="absolute top-6 right-4 p-2 bg-neutral-900 rounded-xl text-neutral-500 active:scale-95 transition-transform border border-white/5"
               >
                 <X size={20} />
               </button>
            </aside>
          </div>

          <div className="flex min-h-screen">
            
            {/* 3. DESKTOP SIDEBAR: Darkened to match the new theme */}
            <aside className="hidden lg:block fixed inset-y-0 left-0 w-[260px] border-r border-white/5 bg-neutral-950 z-40">
              <Sidebar />
            </aside>

            {/* 4. MAIN WRAPPER */}
            <div className="flex flex-col flex-1 w-full lg:ml-[260px]">
              
              {/* 5. MOBILE HEADER */}
              <MobileHeader onMenuClick={() => setIsMenuOpen(true)} /> 

              <main className="flex-grow w-full min-h-screen">
                {children}
              </main>

              {/* 6. DESKTOP FOOTER: Darkened */}
              <footer className="hidden lg:block p-8 text-center text-[10px] uppercase tracking-widest text-neutral-600 border-t border-white/5 bg-neutral-950">
                © 2026 Bigview Treasury-Ledger
              </footer>
            </div>

            {/* 7. MOBILE BOTTOM NAV: Glass effect dock like OPay */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-t border-white/5">
              <BottomNav />
            </div>

          </div>
        </Providers>
      </body>
    </html>
  );
}