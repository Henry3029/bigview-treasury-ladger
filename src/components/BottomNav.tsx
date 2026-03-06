"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Receipt, Wallet, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();
  
  // Helper to determine if the link is active
  const isActive = (path: string) => pathname === path;

  return (
  <nav className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t p-2 pb-6 z-[100] flex justify-around">
      
      {/* Home Link */}
      <Link href="/" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/') ? 'text-blue-600' : 'text-gray-400'}`}>
        <LayoutDashboard size={24} />
        <span className="text-[10px] font-medium">Home</span>
      </Link>

      {/* Stake Link */}
      <Link href="/stake" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/stake') ? 'text-blue-600' : 'text-gray-400'}`}>
        <Receipt size={24} />
        <span className="text-[10px] font-medium">Stake</span>
      </Link>

      {/* Rewards Link */}
      <Link href="/rewards" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/rewards') ? 'text-blue-600' : 'text-gray-400'}`}>
        <Wallet size={24} />
        <span className="text-[10px] font-medium">Rewards</span>
      </Link>

      {/* Me (Profile) Link - Fixed Pathing */}
      <Link href="/me" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/me') ? 'text-blue-600' : 'text-gray-400'}`}>
        <User size={24} />
        <span className="text-[10px] font-medium">Me</span>
      </Link>

    </nav>
  );
}