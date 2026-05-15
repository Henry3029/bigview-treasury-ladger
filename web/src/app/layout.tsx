import '@/styles/globals.css';
import Providers from './providers'; 
import { Inter } from 'next/font/google';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

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
          <Header />

          <div className="flex flex-col h-dvh overflow-hidden">
            {/* The Header now sits at the top of every page */}
            

            <main className="flex-grow w-full overflow-y-auto pb-20 lg:pb-0">
              {children}
            </main>

            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-color-ash/40 backdrop-blur-xl border-t border-white/5">
              
            </div>
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}