import '@/styles/globals.css';
import Providers from './providers'; 
import { Inter } from 'next/font/google';
import WelcomeBanner from '@/components/WelcomeBanner';
import BottomNav from '@/components/BottomNav';
import MobileHeaderWrapper from '@/components/MobileHeaderWrapper';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'Bigview Treasury',
  description: 'Decentralized Treasury Ledger',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-inter antialiased text-text-color bg-violet-main-background overflow-x-hidden`}>
        <Providers>
          <WelcomeBanner />

          <div className="flex flex-col min-h-screen">
            {/* The Header now sits at the top of every page */}
            <MobileHeaderWrapper />

            <main className="flex-grow w-full min-h-screen pb-20 lg:pb-0">
              {children}
            </main>

            <footer className="hidden lg:block px-8 text-center text-[10px] tracking-tight text-white/20 border-t border-white/5">
              © 2026 Bigview Treasury-Ledger • v2.0
            </footer>

            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-color-ash/40 backdrop-blur-xl border-t border-white/5">
              <BottomNav />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}