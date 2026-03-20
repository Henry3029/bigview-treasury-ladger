"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Zap, 
  Wallet, 
  User, 
  ShieldCheck, // Admin Icon
  Settings 
} from 'lucide-react';
import Image from 'next/image';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export default function Sidebar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      const userAddr = userData.profile.stxAddress.testnet;
      const deployerAddr = process.env.NEXT_PUBLIC_DEPLOYER_ADDR;
      
      // If the connected wallet matches your deployer address, show admin tools
      setIsAdmin(userAddr === deployerAddr);
    }
  }, []);

  return (
    <aside className="hidden lg:flex flex-col w-[260px] bg-white border-r h-screen fixed left-0 top-0 z-40 p-6">
      {/* ... Branding and Main Nav ... */}

      {/* 3. HIDDEN ADMIN TOOLS */}
      {isAdmin && (
        <div className="pt-6 border-t border-slate-50 space-y-2 animate-in fade-in slide-in-from-bottom-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-4 px-2">Developer Tools</p>
          
          <SidebarLink 
            href="/admin/mint" 
            icon={<ShieldCheck size={20} />} 
            label="Token Minter" 
            active={pathname === '/admin/mint'} 
            isOwnerTool
          />
        </div>
      )}
    </aside>
  );
}

// Helper Component for Links
function SidebarLink({ href, icon, label, active, isAdmin = false }: any) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 p-3 rounded-2xl font-bold transition-all ${
        active 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
          : isAdmin 
            ? 'text-slate-500 hover:bg-red-50 hover:text-red-600' 
            : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
      }`}
    >
      {icon}
      <span className="text-sm tracking-tight">{label}</span>
    </Link>
  );
}