import type { Metadata } from 'next'; 
import '@/styles/globals.css';
import Sidebar from '@/components/Sidebar';
import MobileHeader from '@/components/MobileHeader'; // This handles the hamburger logic
import BottomNav from '@/components/BottomNav';
import Providers from './providers'; 

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
            
            {/* 1. DESKTOP SIDEBAR: Hidden on mobile */}
            <aside className="hidden lg:block fixed inset-y-0 left-0 w-[260px] border-r bg-white">
              <Sidebar />
            </aside>

            <div className="flex flex-col flex-1 w-full lg:ml-[260px]">
              
              {/* 2. MOBILE HEADER: Now a separate component to handle the Menu click */}
              <MobileHeader /> 

              {/* 3. MAIN CONTENT */}
              <main className="flex-grow p-4 pb-32 lg:pb-12 max-w-5xl mx-auto w-full">
                {children}
              </main>

              {/* 4. DESKTOP FOOTER */}
              <footer className="hidden lg:block p-8 text-center text-[10px] uppercase tracking-widest text-gray-400 border-t bg-white">
                © 2026 Bigview Treasury-Ledger
              </footer>
            </div>

            {/* 5. MOBILE BOTTOM NAV: Hidden on desktop */}
            <div className="lg:hidden">
              <BottomNav />
            </div>

          </div>
        </Providers>
      </body>
    </html>
  );
}