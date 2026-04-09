"use client";

import React, { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth'; // The new import

interface StatusBadgeProps {
  label?: string;
}

export default function StatusBadge({ label }: StatusBadgeProps) {
  // 1. Swap useAccount for usePrivy
  const { user, authenticated } = usePrivy(); 
  const [mounted, setMounted] = useState(false);

  // 2. Get the address from the Privy user object
  const address = user?.wallet?.address;
  const isConnected = authenticated;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-bigview text-[10px] font-black uppercase tracking-widest italic border transition-all shadow-sm
      ${isConnected 
        ? 'bg-gold-buttons/10 text-gold-buttons border-gold-buttons/20' 
        : 'bg-violet-glow/5 text-white/30 border-white/5'
      }`}>
      
      <span className={`h-1.5 w-1.5 rounded-full transition-colors 
        ${isConnected 
          ? 'bg-gold-buttons animate-pulse shadow-[0_0_8px_rgba(255,215,0,0.5)]' 
          : 'bg-white/20'
        }`}>
      </span>
      
      <span className="tracking-[0.15em]">
        {isConnected && address
          ? `BASE: ${address.slice(0, 6)}...${address.slice(-4)}` 
          : label || "Disconnected"}
      </span>
    </div>
  );
}