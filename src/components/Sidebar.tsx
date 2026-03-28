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
  Code2
} from 'lucide-react';

export default function Sidebar({ isMobile, closeMobileMenu }: { isMobile?: boolean, closeMobileMenu?: () => void }) { 
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      // Check if the connected Base address is the Deployer
      const deployerAddr = process.env.NEXT_PUBLIC_DEPLOYER_ADDR?.toLowerCase();
      setIsAdmin(address.toLowerCase() === deployerAddr);
    } else {
      setIsAdmin(false);
    }
  }, [address, isConnected]);

  return (
    <aside className={`flex flex-col h-full ${isMobile ? 'w-full px-4' : 'w-[260px] bg-white border-r border-slate-50 p-6'}`}>
      
      {/* BRANDING SECTION (Hidden on mobile because MobileHeader has it) */}
      {!isMobile && (
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="p-2 bg-blue-600 rounded-2xl shadow-lg shadow-blue-100">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              width={24} 
              height={24} 
              className="brightness-0 invert" 
            />
          </div>
          <span className='font-black text-2xl tracking-tighter text-slate-900 italic'>Bigview</span>
        </div>
      )}

      {/* MAIN NAVIGATION */}
      <nav className="flex-grow space-y-2">
        <SidebarLink href="/" icon={<LayoutDashboard size={20} />} label="Dashboard" active={pathname === '/'} onClick={closeMobileMenu} />
        <SidebarLink href="/swap" icon={<ArrowLeftRight size={20} />} label="Swap" active={pathname === '/swap'} onClick={closeMobileMenu} />
        <SidebarLink href="/stake" icon={<Zap size={20} />} label="Stake" active={pathname === '/stake'} onClick={closeMobileMenu} />
        <SidebarLink href="/rewards" icon={<Wallet size={20} />} label="Rewards" active={pathname === '/rewards'} onClick={closeMobileMenu} />
        <SidebarLink href="/me" icon={<User size={20} />} label="Profile" active={pathname === '/me'} onClick={closeMobileMenu} />
      </nav>

      {/* ADMIN TOOLS (Only shows for the Deployer) */}
      {isAdmin && (
        <div className="mt-6 pt-6 border-t border-slate-100 space-y-2">
          <div className="flex items-center gap-2 px-3 mb-4">
            <Code2 size={12} className="text-red-400" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400">Deployer Tools</p>
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

      {/* FOOTER INFO (Visible on Desktop) */}
      {!isMobile && (
        <div className="mt-auto pt-6 px-2">
           <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Network</p>
              <p className="text-xs font-bold text-blue-600">Base Sepolia</p>
           </div>
        </div>
      )}
    </aside>
  );
}

// Helper Component for Links
function SidebarLink({ href, icon, label, active, isOwnerTool = false, onClick }: any) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`flex items-center gap-3 p-3.5 rounded-[1.2rem] font-bold transition-all duration-200 group ${
        active 
          ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 scale-[1.02]' 
          : isOwnerTool 
            ? 'text-slate-400 hover:bg-red-50 hover:text-red-600' 
            : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
      }`}
    >
      <span className={`${active ? 'text-white' : 'group-hover:scale-110 transition-transform'}`}>
        {icon}
      </span>
      <span className="text-sm tracking-tight">{label}</span>
    </Link>
  );
}