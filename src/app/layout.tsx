import type { Metadata } from 'next'; 
import '@/styles/globals.css';
import WalletButton from '@/components/WalletButton';
import Image from 'next/image';
import BottomNav from '@/components/BottomNav';
import Sidebar from '@/components/Sidebar';
import MobileHeader from '@/components/MobileHeader';
// 1. Import your new Providers component
import Providers from './providers'; 

export const metadata: Metadata = {
  title: 'Bigview Treasury Ledger',
  description: 'Stake & Earn Rewards on Base' // Updated description for the new chain
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased text-slate-900 bg-slate-50">
        {/* 2. Wrap EVERYTHING inside Providers */}
        <Providers>
          <MobileHeader />
          <div className="flex min-h-screen">
            <Sidebar />

            <div className="flex flex-col flex-1 w-full lg:ml-[260px]">
              
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

              <main className="flex-grow p-4 pb-28 lg:pb-12">
                {children}
              </main>

              <footer className="p-8 text-center text-[10px] uppercase tracking-widest text-gray-400 border-t bg-white">
                © 2026 Bigview Treasury-Ledger
              </footer>
            </div>

            <BottomNav /> 
          </div>
        </Providers>
      </body>
    </html>
  );
}