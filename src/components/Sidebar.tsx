"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Receipt, Wallet, User, History } from 'lucide-react'; // Added History icon

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-[260px] bg-white border-r border-gray-100 p-6 overflow-y-auto [grid-area:sidebar]">
      <div className="mb-10 px-2">
        <h1 className="text-xl font-bold text-blue-900 tracking-tight">Bigview</h1>
      </div>

      <nav className="flex flex-col gap-2">
        <SidebarLink href="/" icon={<LayoutDashboard size={20}/>} label="Dashboard" active={isActive('/')} />
        <SidebarLink href="/stake" icon={<Receipt size={20}/>} label="Stake STX" active={isActive('/stake')} />
        <SidebarLink href="/rewards" icon={<Wallet size={20}/>} label="My Rewards" active={isActive('/rewards')} />
        
        {/* Added History Link since we built that table earlier! */}
        <SidebarLink href="/history" icon={<History size={20}/>} label="History" active={isActive('/history')} />
        
        <SidebarLink href="/me" icon={<User size={20}/>} label="Profile" active={isActive('/me')} />
      </nav>
    </aside>
  );
}

// Better typing for the icon prop
function SidebarLink({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 p-3 rounded-xl font-medium transition-all ${
        active 
          ? 'bg-blue-50 text-blue-600 shadow-sm' 
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}