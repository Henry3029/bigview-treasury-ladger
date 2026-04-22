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
  <nav className="fixed bottom-0 left-0 right-0 lg:hidden bg-violet-main-background border-t border-white/5 p-2 py-1 z-[100] flex justify-around items-center shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
    
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
    <NavLink
      href="/stake" 
      icon={<Zap size={22}/>}
      label="Stake"
      active={isActive('/Stake')}
      />

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

// Helper Component (Move this OUTSIDE your main component's return block)
function NavLink({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex flex-col items-center gap-1 transition-all duration-300 active:scale-95 ${
        active ? 'text-vibrant-green' : 'text-color-white'
      }`}
    >
      <div className={active ? 'drop-shadow-[0_0_8px_rgba(253,230,138,0.5)]' : ''}>
        {icon}
      </div>
      <span className={`text-[10px] font-bold tracking-tighter ${
        active ? 'text-vibrant-green' : 'text-color-white'
      }`}>
        {label}
      </span>
    </Link>
  );
}