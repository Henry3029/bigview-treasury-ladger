import Link from 'next/link';
import '../styles/globals.css';
import AppPrivyProvider from '../components/privyProvider';
// 1. Import your new Client Component
import WalletButton from '../components/WalletButton';
// 1. Import the Image component from next
import Image from 'next/image';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
        <body className="antialiased text-slate-900">
        <AppPrivyProvider>
          {/* --- NAVIGATION BAR --- */}
          <nav className="flex items-center justify-between p-6 bg-white shadow-sm border-b">
          <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/images/logo.png" // Path starts from /public
                alt="Bigview Treasury Logo"
                width={40}  // Set desired width
                height={40} // Set desired height
                className="rounded-full" // Optional styling
              />
 <span className='text-slate-900'>Treasury</span>
            </div>
            
            <div className="space-x-6 font-medium text-slate-700">
              <Link href="/homePage" className="hover:text-orange-500">Home page</Link>
              <Link href="/history" className="hover:text-orange-500">Ledger</Link>
              <Link href="/stake" className="hover:text-orange-500">Staking</Link>
              <Link href="/governance" className="hover:text-orange-500">Governance</Link>
                <Link href="/about" className="hover:text-orange-500">About Us</Link>
            </div>

            {/* 2. Use the new Client Component here */}
            <WalletButton />
          </nav>

          <main>
            {children}
          </main>

          <footer className="p-10 text-center text-gray-500 border-t mt-10">
            © 2026 Bigview POX Community
          </footer>
        </AppPrivyProvider>
      </body>
    </html>
  );
}