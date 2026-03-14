import type { Metadata } from 'next'; // Added for SEO
import Link from 'next/link';
import '@/styles/globals.css';
import AppPrivyProvider from '@/components/PrivyProvider';
import WalletButton from '@/components/WalletButton';
import Image from 'next/image';
import BottomNav from '@/components/BottomNav';
import Sidebar from '@/components/Sidebar';

// 1. Added Metadata (Only works in Server Components!)
export const metadata: Metadata = {
  title: 'Bigview Treasury Ladger'
  description: 'Stake STX & Earn BTC Rewards'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased text-slate-900 dashboard-layout">
        {/* AppPrivyProvider handles the Stacks/Privy Auth state */}
        <AppPrivyProvider>
          <Sidebar />
          
          <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-white shadow-sm border-b [grid-area:header]">
            <div className="flex items-center gap-2">
              <Image 
                src="/images/bigview-image.png" 
                alt="Logo" 
                width={40} 
                height={40} 
                priority 
                className="rounded-full shadow-sm" 
              />
              <span className='font-bold text-lg tracking-tight text-blue-900'>Treasury</span>
            </div>
            <WalletButton />
          </header>

          <main className="main-content flex-grow pb-24">
            {children}
          </main>

          <BottomNav /> 

          <footer className="p-6 text-center text-xs text-gray-400 border-t [grid-area:footer]">
            © 2026 Bigview Treasury-Ledger
          </footer>
        </AppPrivyProvider>
      </body>
    </html>
  );
}