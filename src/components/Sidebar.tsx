"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Receipt, Wallet, User, History, LogOut } from 'lucide-react';
import { UserSession, AppConfig } from '@stacks/connect';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    userSession.signUserOut();
    window.location.replace('/'); 
  };

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-[260px] bg-white border-r border-slate-100 p-6 z-40">
      <div className="mb-10 px-2">
        <h1 className="text-xl font-black text-blue-900 tracking-tight italic">Bigview</h1>
      </div>

      <nav className="flex flex-col gap-2 flex-grow">
        <SidebarLink href="/" icon={<LayoutDashboard size={20}/>} label="Dashboard" active={isActive('/')} />
        <SidebarLink href="/stake" icon={<Receipt size={20}/>} label="Stake STX" active={isActive('/stake')} />
        <SidebarLink href="/rewards" icon={<Wallet size={20}/>} label="My Rewards" active={isActive('/rewards')} />
        <SidebarLink href="/history" icon={<History size={20}/>} label="History" active={isActive('/history')} />
        <SidebarLink href="/me" icon={<User size={20}/>} label="Profile" active={isActive('/me')} />
      </nav>

      {/* Logout Button at the bottom of the sidebar */}
      {userSession.isUserSignedIn() && (
        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 p-3 rounded-xl font-bold text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all border border-transparent hover:border-red-100 group"
        >
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
          <span>Disconnect</span>
        </button>
      )}
    </aside>
  );
}

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