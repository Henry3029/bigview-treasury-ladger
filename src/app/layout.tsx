import Link from 'next/link';
import '../../styles/globals.css';
import AppPrivyProvider from '@/components/privyProvider';
// 1. Import your new Client Component
import WalletButton from '@/components/WalletButton';
// 1. Import the Image component from next
import Image from 'next/image';
import { BottomNav } from '@/components/BottomNav';
import Sidebar from '@/components/Sidebar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
  <html lang="en">
    {/* 1. Add 'dashboard-layout' to the body or a wrapper div */}
    <body className="antialiased text-slate-900 bg-gray-50 dashboard-layout">
      <AppPrivyProvider>
      {/* 🖥️ Desktop Sidebar (Hidden on Mobile) */}
          <Sidebar />
        
        {/* --- TOP HEADER --- */}
        {/* Added 'header' grid-area via className if using CSS modules, 
            or just ensure it's the first child in the grid */}
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

        {/* --- MAIN CONTENT --- */}
        {/* We use 'main-content' class here to trigger the 1200px centering we built */}
        <main className="main-content flex-grow pb-24">
          {children}
        </main>

        {/* --- THE BOTTOM NAV --- */}
        <BottomNav /> 

        {/* --- FOOTER --- */}
        <footer className="p-6 text-center text-xs text-gray-400 border-t [grid-area:footer]">
          © 2026 Bigview Treasury-Ladger
        </footer>
        
      </AppPrivyProvider>
    </body>
  </html>
);