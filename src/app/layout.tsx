import type { Metadata } from 'next'; 
import '@/styles/globals.css';
import Sidebar from '@/components/Sidebar';
import MobileHeader from '@/components/MobileHeader'; 
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
            
            {/* 1. DESKTOP SIDEBAR: Fixed position keeps it stable while scrolling */}
            <aside className="hidden lg:block fixed inset-y-0 left-0 w-[260px] border-r bg-white z-40">
              <Sidebar />
            </aside>

            {/* 2. MAIN WRAPPER: Margin-left (lg:ml) only applies on desktop */}
            <div className="flex flex-col flex-1 w-full lg:ml-[260px]">
              
              {/* 3. MOBILE HEADER: Already contains your Logo, Bell, and Profile */}
              <MobileHeader /> 

        {/* 4. MAIN CONTENT AREA */}
<main className="flex-grow w-full min-h-screen">
  {/* We removed 'p-4' and 'max-w-5xl' from here. 
     Now your pages (Dashboard, Stake, etc.) can decide 
     their own width and padding!
  */}
  {children}
</main>

              {/* 5. DESKTOP FOOTER: Hidden on mobile for that clean App feel */}
              <footer className="hidden lg:block p-8 text-center text-[10px] uppercase tracking-widest text-gray-400 border-t bg-white">
                © 2026 Bigview Treasury-Ledger
              </footer>
            </div>

            {/* 6. MOBILE BOTTOM NAV: Floating at the bottom of the viewport */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
              <BottomNav />
            </div>

          </div>
        </Providers>
      </body>
    </html>
  );
}