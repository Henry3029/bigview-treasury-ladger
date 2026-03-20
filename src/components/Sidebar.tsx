"use client";

// 1. ADD THESE IMPORTS (They were missing!)
import React, { useState, useEffect } from 'react';
import { AppConfig, UserSession } from '@stacks/connect';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Zap, 
  Wallet, 
  User, 
  ShieldCheck, 
  Settings 
} from 'lucide-react';

// 2. INITIALIZE SESSION (Now AppConfig and UserSession are defined)
const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export default function Sidebar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      const userAddr = userData.profile.stxAddress.testnet;
      
      // Make sure your .env.local has NEXT_PUBLIC_DEPLOYER_ADDR set to your wallet
      const deployerAddr = process.env.NEXT_PUBLIC_DEPLOYER_ADDR;
      
      setIsAdmin(userAddr === deployerAddr);
    }
  }, []);

  return (
<aside className={`${isMobile ? 'flex' : 'hidden lg:flex'} flex-col w-full lg:w-[260px] bg-white h-full p-6`}>
      {/* BRANDING SECTION */}
      <div className="flex items-center gap-2 mb-10 px-2">
        <Image 
          src="/images/bigview-image.png" 
          alt="Logo" 
          width={32} 
          height={32} 
          className="rounded-full shadow-sm" 
        />
        <span className='font-black text-xl tracking-tight text-blue-900 italic'>Bigview</span>
      </div>

      {/* MAIN NAVIGATION */}
      <nav className="flex-grow space-y-2">
        <SidebarLink href="/" icon={<LayoutDashboard size={20} />} label="Dashboard" active={pathname === '/'} />
        <SidebarLink href="/swap" icon={<ArrowLeftRight size={20} />} label="Swap" active={pathname === '/swap'} />
        <SidebarLink href="/stake" icon={<Zap size={20} />} label="Stake" active={pathname === '/stake'} />
        <SidebarLink href="/rewards" icon={<Wallet size={20} />} label="Rewards" active={pathname === '/rewards'} />
        <SidebarLink href="/me" icon={<User size={20} />} label="Profile" active={pathname === '/me'} />
      </nav>

      {/* 3. HIDDEN ADMIN TOOLS */}
      {isAdmin && (
        <div className="pt-6 border-t border-slate-50 space-y-2 animate-in fade-in slide-in-from-bottom-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-4 px-2">Developer Tools</p>
          
          <SidebarLink 
            href="/admin/mint" 
            icon={<ShieldCheck size={20} />} 
            label="Token Minter" 
            active={pathname === '/admin/mint'} 
            isOwnerTool // Fixed: the helper uses isOwnerTool
          />
        </div>
      )}
    </aside>
  );
}

// Helper Component for Links
function SidebarLink({ href, icon, label, active, isOwnerTool = false }: any) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 p-3 rounded-2xl font-bold transition-all ${
        active 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
          : isOwnerTool 
            ? 'text-slate-500 hover:bg-red-50 hover:text-red-600' 
            : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
      }`}
    >
      {icon}
      <span className="text-sm tracking-tight">{label}</span>
    </Link>
  );
}