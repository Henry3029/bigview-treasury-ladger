'use client';

import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import LoadingSpinner from './LoadingSpinner'; 
import { X } from 'lucide-react'; 
import { shortAddress } from '@/utils/shortAddress'; 

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { authenticated, login, ready, user } = usePrivy();
  const userAddress = user?.wallet?.address;
  
  return (
    <>
      {/* 1. The Backdrop (Behind the menu) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity"
          onClick={onClose}
        />
      )}

      {/* 2. The Slide-up Bottom Drawer Menu Layout */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-[#13141e] rounded-t-[32px] p-6 z-[101] transition-transform duration-500 ease-in-out shadow-2xl ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        
        {/* Top Header Anchor Component Context Row */}
        <div className="flex flex-col items-center w-full mb-6 relative">
          {/* Subtle Pull Indicator Drag Handle */}
          <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mb-2" />
          
          {/* 🚀 FIXED: Integrated clean absolute close toggle directly in header height slot */}
          <button 
            onClick={onClose} 
            className="absolute -top-2 right-0 p-2 bg-gray-100 dark:bg-white/5 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
            aria-label="Close menu"
          >
            <X size={18} className="dark:text-white" />
          </button>
        </div>

        {/* Navigation Core Ledger Item Links */}
        <nav className="space-y-3 mb-6">
          <SidebarLink label="Stacking" href="/app/Stacking" onClick={onClose} />
          <SidebarLink label="Points" href="/app/Points" onClick={onClose} />
          <SidebarLink label="DeFi" href="/app/DeFi" onClick={onClose} />
          <SidebarLink label="Analytics" href="/app/Analytics" onClick={onClose}/> 
        </nav>

        {/* 3. Authentication & Wallet Flow */}
        {!ready ? (
          <div className="py-4 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : !authenticated ? (
          <div className="pt-4 border-t border-gray-200 dark:border-white/10">
            <button
              onClick={login} 
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              Connect Wallet 
            </button>
          </div>
        ) : (
          <div className="pt-4 border-t border-gray-200 dark:border-white/10 text-center">
            <span className="font-mono bg-gray-100 dark:bg-white/10 p-3 rounded-xl text-sm dark:text-white block tracking-wider font-bold">
              {/* 🚀 FIXED: Added logical fallback guard so `shortAddress` never receives undefined */}
              {userAddress ? shortAddress(userAddress) : '0x000...0000'}
            </span>
          </div>
        )}
      </div>
    </>
  );
}

// Small helper component to keep our links clean
function SidebarLink({ href, onClick, label }: { href: string; onClick: () => void; label: string }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl dark:text-white font-bold hover:bg-blue-600/10 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
    >
      {label}
    </Link>
  );
}