"use client";

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
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
  Settings,
  Code2,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ isMobile, closeMobileMenu }: { isMobile?: boolean, closeMobileMenu?: () => void }) { 
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      const deployerAddr = process.env.NEXT_PUBLIC_DEPLOYER_ADDR?.toLowerCase();
      setIsAdmin(address.toLowerCase() === deployerAddr);
    } else {
      setIsAdmin(false);
    }
  }, [address, isConnected]);

  return (
    <aside className={`flex flex-col h-full font-inter ${
      isMobile 
        ? 'w-full px-4 bg-slate-950' 
        : 'w-[280px] bg-slate-950 border-r border-white/5 p-6 shadow-2xl'
    }`}>
      
      {/* BRANDING SECTION */}
      {!isMobile && (
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="p-2.5 bg-blue-600 rounded-[1.2rem] shadow-lg shadow-blue-900/40 border border-white/20">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              width={22} 
              height={22} 
              className="brightness-0 invert" 
            />
          </div>
          <div className="flex flex-col">
            <span className='font-black text-2xl tracking-tighter text-white italic leading-none'>Bigview</span>
            <span className="text-[8px] font-black text-blue-500 uppercase tracking-[0.4em] mt-1">Treasury</span>
          </div>
        </div>
      )}

      {/* MAIN NAVIGATION */}
      <nav className="flex-grow space-y-3">
        <SidebarLink href="/" icon={<LayoutDashboard size={20} />} label="Dashboard" active={pathname === '/'} onClick={closeMobileMenu} />
        <SidebarLink href="/swap" icon={<ArrowLeftRight size={20} />} label="Swap" active={pathname === '/swap'} onClick={closeMobileMenu} />
        <SidebarLink href="/stake" icon={<Zap size={20} />} label="Stake" active={pathname === '/stake'} onClick={closeMobileMenu} />
        <SidebarLink href="/rewards" icon={<Wallet size={20} />} label="Rewards" active={pathname === '/rewards'} onClick={closeMobileMenu} />
        <SidebarLink href="/me" icon={<User size={20} />} label="Profile" active={pathname === '/me'} onClick={closeMobileMenu} />
      </nav>

      {/* ADMIN TOOLS */}
      {isAdmin && (
        <div className="mt-8 pt-8 border-t border-white/5 space-y-3">
          <div className="flex items-center gap-2 px-4 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-red-500/80">Deployer Engine</p>
          </div>
          
          <SidebarLink 
            href="/admin/mint" 
            icon={<ShieldCheck size={20} />} 
            label="Token Minter" 
            active={pathname === '/admin/mint'} 
            isOwnerTool 
            onClick={closeMobileMenu}
          />
        </div>
      )}

      {/* FOOTER INFO: OPay-style Status Card */}
      {!isMobile && (
        <div className="mt-auto pt-8">
           <div className="p-5 bg-white/[0.03] rounded-3xl border border-white/5 relative overflow-hidden group hover:bg-white/[0.05] transition-all">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-600/10 rounded-full blur-2xl" />
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Protocol Status</p>
              <div className="flex items-center justify-between">
                <p className="text-xs font-black text-white italic uppercase">Base Sepolia</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                  <span className="text-[9px] font-black text-emerald-500 uppercase">Live</span>
                </div>
              </div>
           </div>
        </div>
      )}
    </aside>
  );
}

function SidebarLink({ href, icon, label, active, isOwnerTool = false, onClick }: any) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`flex items-center justify-between p-4 rounded-2xl font-black transition-all duration-300 group ${
        active 
          ? 'bg-blue-600 text-white shadow-[0_10px_25px_rgba(37,99,235,0.3)] border border-white/20' 
          : isOwnerTool 
            ? 'text-slate-500 hover:bg-red-500/10 hover:text-red-500 border border-transparent' 
            : 'text-slate-400 hover:bg-white/[0.05] hover:text-white border border-transparent'
      }`}
    >
      <div className="flex items-center gap-4">
        <span className={`${active ? 'text-white' : 'group-hover:text-blue-500 transition-colors'}`}>
          {icon}
        </span>
        <span className="text-[13px] uppercase tracking-tighter italic">{label}</span>
      </div>
      
      {active && <ChevronRight size={14} className="text-white/60 animate-in slide-in-from-left-2 duration-300" />}
    </Link>
  );
}