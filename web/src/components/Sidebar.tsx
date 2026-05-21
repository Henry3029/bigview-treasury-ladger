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

      {/* 2. The Slide-up Menu */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-[#13141e] rounded-t-[32px] p-6 z-[101] transition-transform duration-500 ease-in-out shadow-2xl ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        
        <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-6" />

        <div className="flex justify-between items-center mb-8">
          <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-white/5 rounded-full">
            <X size={20} className="dark:text-white" />
          </button>
        </div>

        <nav className="space-y-3 mb-6">
          <SidebarLink label="Stacking" href="/app/Stacking" onClick={onClose} />
          <SidebarLink label="Points" href="/app/Points" onClick={onClose} />
          <SidebarLink label="DeFi" href="/app/DeFi" onClick={onClose} />
          <SidebarLink label="Analytics" href="/app/Analytics" onClick={onClose}/> 
        </nav>

        {/* 3. Authentication & Wallet Flow (Fixed Structure) */}
        {!ready ? (
          <LoadingSpinner />
        ) : !authenticated ? (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={login} 
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              Connect Wallet 
            </button>
          </div>
        ) : (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
            <span className="font-mono bg-gray-100 dark:bg-white/10 p-2 rounded text-sm dark:text-white block">
              {shortAddress(userAddress)}
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
      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl dark:text-white font-bold hover:bg-blue-600/10 transition-colors"
    >
      {label}
    </Link>
  );
}