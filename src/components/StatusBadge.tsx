"use client";

import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

interface StatusBadgeProps {
  label?: string;
}

export default function StatusBadge({ label }: StatusBadgeProps) {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  // Prevents hydration mismatch between server and client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Logic for the visual indicator
  const activeColor = isConnected ? 'bg-green-500' : 'bg-red-500';
  const bgColor = isConnected ? 'bg-green-50' : 'bg-red-50';
  const textColor = isConnected ? 'text-green-700' : 'text-red-700';
  const borderColor = isConnected ? 'border-green-100' : 'border-red-100';

  return (
  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-bigview text-[10px] font-black uppercase tracking-widest italic border transition-all shadow-sm
    ${isConnected 
      ? 'bg-gold-buttons/10 text-gold-buttons border-gold-buttons/20' 
      : 'bg-violet-glow/5 text-white/30 border-white/5'
    }`}>
    
    {/* The Bigview Status Dot: Using Gold for active connectivity */}
    <span className={`h-1.5 w-1.5 rounded-full transition-colors 
      ${isConnected 
        ? 'bg-gold-buttons animate-pulse shadow-[0_0_8px_rgba(255,215,0,0.5)]' 
        : 'bg-white/20'
      }`}>
    </span>
    
    {/* The Label: Applied tracking and italic styling */}
    <span className="tracking-[0.15em]">
      {isConnected && address
        ? `BASE: ${address.slice(0, 6)}...${address.slice(-4)}` 
        : label || "Disconnected"}
    </span>
  </div>
);
}