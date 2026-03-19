import type { Metadata } from 'next'; 
import NextTopLoader from 'nextjs-toploader';
import '@/styles/globals.css';
import WalletButton from '@/components/WalletButton';
import Image from 'next/image';
import BottomNav from '@/components/BottomNav';
import Sidebar from '@/components/Sidebar';

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
      <body className="antialiased text-slate-900 dashboard-layout">
        {/* FIX: NextTopLoader goes here, above Providers */}
        <NextTopLoader 
          color="#2563eb" 
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2563eb,0 0 5px #2563eb"
        />
          <Sidebar />
          
          <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-white/80 backdrop-blur-md shadow-sm border-b [grid-area:header]">
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

          <main className="main-content flex-grow pb-20">
            {children}
          </main>

          <BottomNav /> 

          <footer className="p-6 text-center text-[10px] uppercase tracking-widest text-gray-400 border-t [grid-area:footer]">
            © 2026 Bigview Treasury-Ledger
          </footer>
      </body>
    </html>
  );
}