import Link from 'next/link';
import { PrivyProviderWrapper } from '../components/privyProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased text-slate-900 bg-slate-50">
        <PrivyProviderWrapper>
          {/* --- NAVIGATION BAR (Shown on every page) --- */}
          <nav className="flex items-center justify-between p-6 bg-white shadow-sm">
            <div className="text-xl font-bold text-orange-600">Bigview Treasury</div>
            
            <div className="space-x-6 font-medium">
              <Link href="/" className="hover:text-orange-500">Dashboard</Link>
              <Link href="/history" className="hover:text-orange-500">Ledger</Link>
              <Link href="/stake" className="hover:text-orange-500">Staking</Link>
              <Link href="/governance" className="hover:text-orange-500">Governance</Link>
              <Link href="/about" className="hover:text-orange-500">About</Link>
            </div>

            <button className="px-4 py-2 bg-black text-white rounded-lg">
              Connect Wallet
            </button>
          </nav>

          {/* --- PAGE CONTENT (This changes depending on the URL) --- */}
          <main className="max-w-7xl mx-auto p-8">
            {children}
          </main>

          {/* --- FOOTER (Shown on every page) --- */}
          <footer className="p-10 text-center text-gray-400">
            © 2026 Bigview POX Community
          </footer>
        </PrivyProviderWrapper>
      </body>
    </html>
  );
}