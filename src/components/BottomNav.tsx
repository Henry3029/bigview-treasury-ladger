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
  <nav className="fixed bottom-0 left-0 right-0 lg:hidden bg-violet-background backdrop-blur-2xl border-t border-white/5 p-2 pb-8 z-[100] flex justify-around items-center shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
    
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
      className="flex flex-col items-center gap-1 -mt-8 transition-all active:scale-90"
    >
      <div className={`p-4 rounded-full shadow-2xl border-4 border-violet-background ${
        isActive('/stake') 
          ? 'bg-gold-buttons text-text-color shadow-gold-buttons/40' 
          : 'bg-violet-glow text-white shadow-black/50'
      }`}>
        <Zap size={28} fill={isActive('/stake') ? "currentColor" : "none"} strokeWidth={2.5} />
      </div>
      <span className={`text-[10px] font-black uppercase tracking-tighter italic ${
        isActive('/stake') ? 'text-gold-buttons' : 'text-white/50'
      }`}>
        Stake
      </span>
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

// Helper Component (Move this OUTSIDE your main component's return block)
function NavLink({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex flex-col items-center gap-1 transition-all duration-300 active:scale-95 ${
        active ? 'text-gold-buttons' : 'text-white/40'
      }`}
    >
      <div className={active ? 'drop-shadow-[0_0_8px_rgba(253,230,138,0.5)]' : ''}>
        {icon}
      </div>
      <span className={`text-[10px] font-black uppercase tracking-tighter italic ${
        active ? 'opacity-100' : 'opacity-60'
      }`}>
        {label}
      </span>
    </Link>
  );
}