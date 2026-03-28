import type { Metadata } from 'next'; 
import '@/styles/globals.css';
import WalletButton from '@/components/WalletButton';
import Image from 'next/image';
import BottomNav from '@/components/BottomNav';
import Sidebar from '@/components/Sidebar';
import MobileHeader from '@/components/MobileHeader';
import Providers from './providers'; 
import { Menu } from 'lucide-react'; // Make sure lucide-react is installed

export const metadata: Metadata = {
  title: 'Bigview Treasury Ledger',
  description: 'Stake & Earn Rewards on Base'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased text-slate-900 bg-slate-50 overflow-x-hidden">
        <Providers>
          <div className="flex min-h-screen">
            
            {/* 1. SIDEBAR: Only visible on Large screens (Desktop) */}
            <div className="hidden lg:block">
              <Sidebar />
            </div>

            <div className="flex flex-col flex-1 w-full lg:ml-[260px]">
              
              {/* 2. MOBILE HEADER: Single bar with Hamburger + Logo + Wallet */}
              <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b">
                <div className="flex items-center gap-3">
                  {/* HAMBURGER: Only shows on mobile */}
                  <button className="lg:hidden p-1 hover:bg-slate-100 rounded-md">
                    <Menu size={24} className="text-blue-900" />
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <Image 
                      src="/images/bigview-image.png" 
                      alt="Logo" 
                      width={28} 
                      height={28} 
                      priority 
                      className="rounded-full" 
                    />
                    <span className='font-black text-lg tracking-tight text-blue-900 italic'>Bigview</span>
                  </div>
                </div>
                
                <WalletButton />
              </header>

              {/* 3. MAIN CONTENT: Added padding so nothing gets cut off */}
              <main className="flex-grow p-4 pb-32 lg:pb-12">
                {children}
              </main>

              {/* FOOTER: Hidden on mobile to keep it app-like */}
              <footer className="hidden lg:block p-8 text-center text-[10px] uppercase tracking-widest text-gray-400 border-t bg-white">
                © 2026 Bigview Treasury-Ledger
              </footer>
            </div>

            {/* 4. BOTTOM NAV: Only visible on mobile */}
            <div className="lg:hidden">
              <BottomNav />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}