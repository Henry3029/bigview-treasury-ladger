import type { Metadata } from 'next'; 
import '@/styles/globals.css';
import WalletButton from '@/components/WalletButton';
import Image from 'next/image';
import BottomNav from '@/components/BottomNav';
import Sidebar from '@/components/Sidebar';
import MobileHeader from '@/components/MobileHeader';

export const metadata: Metadata = {
  title: 'Bigview Treasury Ledger',
  description: 'Stake STX & Earn BTC Rewards'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased text-slate-900 bg-slate-50">
      <MobileHeader />
        <div className="flex min-h-screen">
          {/* 1. SIDEBAR: Fixed on desktop, hidden on mobile */}
          <Sidebar />

          {/* 2. CONTENT WRAPPER: Pushed right on desktop to make room for Sidebar */}
          <div className="flex flex-col flex-1 w-full lg:ml-[260px]">
            
            {/* STICKY HEADER */}
            <header className="sticky top-0 z-30 flex items-center justify-between p-4 bg-white/80 backdrop-blur-md shadow-sm border-b">
              <div className="flex items-center gap-2">
                <Image 
                  src="/images/bigview-image.png" 
                  alt="Logo" 
                  width={32} 
                  height={32} 
                  priority 
                  className="rounded-full shadow-sm" 
                />
                <span className='font-black text-lg tracking-tight text-blue-900 italic'>Bigview</span>
              </div>
              <WalletButton />
            </header>

            {/* MAIN CONTENT AREA */}
            <main className="flex-grow p-4 pb-28 lg:pb-12">
              {children}
            </main>

            {/* FOOTER */}
            <footer className="p-8 text-center text-[10px] uppercase tracking-widest text-gray-400 border-t bg-white">
              © 2026 Bigview Treasury-Ledger
            </footer>
          </div>

          {/* 3. BOTTOM NAV: Fixed at bottom for mobile only */}
          <BottomNav /> 
        </div>
      </body>
    </html>
  );
}