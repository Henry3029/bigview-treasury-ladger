import Link from 'next/link';
import '../styles/globals.css';
import AppPrivyProvider from '../components/privyProvider';
// 1. Import your new Client Component
import WalletButton from '../components/WalletButton';
// 1. Import the Image component from next
import Image from 'next/image';
import { BottomNav } from '@/components/BottomNav';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
  <html lang="en">
    <body className="antialiased text-slate-900 bg-gray-50 flex flex-col min-h-screen">
      <AppPrivyProvider>
        {/* --- TOP HEADER (Simplified OPay Style) --- */}
        <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-white shadow-sm border-b">
          <div className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="Logo" width={32} height={32} className="rounded-full" />
            <span className='font-bold text-lg tracking-tight'>Treasury</span>
          </div>
          
          {/* Only the Wallet Button stays at the top */}
          <WalletButton />
        </header>

        {/* --- MAIN CONTENT --- */}
        {/* pb-20 ensures the BottomNav doesn't cover your content */}
        <main className="flex-grow pb-20">
          {children}
        </main>

        {/* --- THE OPay BOTTOM NAV --- */}
        {/* We replace the horizontal links with this */}
        <BottomNav /> 

        {/* --- FOOTER --- */}
        {/* In mobile apps, footers are usually hidden or very small */}
        <footer className="p-6 text-center text-xs text-gray-400 border-t">
          © 2026 Bigview POX
        </footer>
      </AppPrivyProvider>
    </body>
  </html>
);