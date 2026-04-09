import '@/styles/globals.css';
import Providers from './providers'; 
import { Inter } from 'next/font/google';
import WelcomeBanner from '@/components/WelcomeBanner';
import MobileHeader from '@/components/MobileHeader'; 
import BottomNav from '@/components/BottomNav';

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
<<<<<<< HEAD
  const { user, authenticated } = usePrivy();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  
  const userAddress = user?.wallet?.address;
  
  useEffect(() => {
    async function loadNotifications() {
       if (!authenticated || !userAddress) return;
      try {
        const data = await getLiveNotifications(userAddress);
        setNotifications(data);
      } catch (error) {
        console.log("Bigview Fetch Error:", error);
      }
    }
    loadNotifications();
  }, [authenticated, userAddress]);

=======
>>>>>>> 77fcb600cfc7b19d97b8b9751ea488a026c34ca9
  return (
    <html lang="en">
      <body className={`${inter.variable} font-inter antialiased text-text-color bg-violet-main-background overflow-x-hidden`}>
        <Providers>
          <WelcomeBanner />

          {/* Main Layout Wrapper */}
          <div className="flex flex-col min-h-screen">
            
            {/* Mobile Header handles its own internal logic for drawers */}
            <MobileHeader /> 

            <main className="flex-grow w-full min-h-screen pb-20 lg:pb-0">
              {children}
            </main>

            <footer className="hidden lg:block p-8 text-center text-[10px] uppercase tracking-[0.4em] text-white/20 border-t border-white/5 italic">
              � 2026 Bigview Treasury-Ledger � v2.0
            </footer>

            {/* Bottom Navigation for Mobile */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-t border-white/5">
              <BottomNav />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}