"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Receipt, Wallet, User } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    // 'hidden lg:flex' means it only exists on desktop
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-[260px] bg-white border-r border-gray-100 p-6 [grid-area:sidebar]">
      <div className="mb-10 px-2">
        <h1 className="text-xl font-bold text-blue-900">Bigview</h1>
      </div>

      <nav className="flex flex-col gap-2">
        <SidebarLink href="/" icon={<LayoutDashboard size={20}/>} label="Dashboard" active={isActive('/')} />
        <SidebarLink href="/stake" icon={<Receipt size={20}/>} label="Stake STX" active={isActive('/stake')} />
        <SidebarLink href="/rewards" icon={<Wallet size={20}/>} label="My Rewards" active={isActive('/rewards')} />
        <SidebarLink href="/me" icon={<User size={20}/>} label="Profile" active={isActive('/me')} />
      </nav>
    </aside>
  );
}

function SidebarLink({ href, icon, label, active }: { href: string; icon: any; label: string; active: boolean }) {
  return (
    <Link href={href} className={`flex items-center gap-3 p-3 rounded-xl font-medium transition-all ${
      active ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'
    }`}>
      {icon}
      <span>{label}</span>
    </Link>
  );
}