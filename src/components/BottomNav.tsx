"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Zap, 
  Wallet, 
  User 
} from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 lg:hidden bg-white/80 backdrop-blur-md border-t p-2 pb-6 z-[100] flex justify-around items-center">
      
      {/* 1. Home */}
      <NavLink 
        href="/" 
        icon={<LayoutDashboard size={22} />} 
        label="Home" 
        active={isActive('/')} 
      />

      {/* 2. Swap */}
      <NavLink 
        href="/swap" 
        icon={<ArrowLeftRight size={22} />} 
        label="Swap" 
        active={isActive('/swap')} 
      />

      {/* 3. Stake (The Middle "Action" Button) */}
      <Link 
        href="/stake" 
        className={`flex flex-col items-center gap-1 transition-all ${
          isActive('/stake') 
            ? 'text-blue-600 scale-110' 
            : 'text-gray-400 hover:text-blue-500'
        }`}
      >
        <div className={`p-3 rounded-2xl ${isActive('/stake') ? 'bg-blue-100' : 'bg-gray-50'}`}>
          <Zap size={24} fill={isActive('/stake') ? "currentColor" : "none"} />
        </div>
        <span className="text-[10px] font-bold">Stake</span>
      </Link>

      {/* 4. Rewards */}
      <NavLink 
        href="/rewards" 
        icon={<Wallet size={22} />} 
        label="Rewards" 
        active={isActive('/rewards')} 
      />

      {/* 5. Me */}
      <NavLink 
        href="/me" 
        icon={<User size={22} />} 
        label="Me" 
        active={isActive('/me')} 
      />

    </nav>
  );
}

// Helper component to keep the code clean
function NavLink({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex flex-col items-center gap-1 transition-colors ${
        active ? 'text-blue-600' : 'text-gray-400'
      }`}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}