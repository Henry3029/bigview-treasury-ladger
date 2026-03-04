// components/BottomNav.tsx
"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-3 pb-6">
      <Link href="/" className={pathname === '/' ? 'text-blue-600' : 'text-gray-400'}>
        <div className="flex flex-col items-center">
          <span>🏠</span>
          <span className="text-xs">Home</span>
        </div>
      </Link>
      <Link href="/stake" className={pathname === '/stake' ? 'text-blue-600' : 'text-gray-400'}>
        <div className="flex flex-col items-center">
          <span>🥩</span>
          <span className="text-xs">Stake</span>
        </div>
      </Link>
      <Link href="/rewards" className={pathname === '/rewards' ? 'text-blue-600' : 'text-gray-400'}>
        <div className="flex flex-col items-center">
          <span>🎁</span>
          <span className="text-xs">Rewards</span>
        </div>
      </Link>
      {/* NEW: Me (Profile) Link */}
      <Link href="/profile" className={`flex flex-col items-center gap-1 ${isActive('/profile') ? 'text-green-600' : 'text-gray-400'}`}>
        <User size={24} />
        <span className="text-[10px] font-medium">Me</span>
      </Link>
    </nav>
  );
}