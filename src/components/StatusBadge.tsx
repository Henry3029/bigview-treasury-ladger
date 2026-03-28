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
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all
      ${bgColor} ${textColor} ${borderColor}`}>
      
      {/* The Status Dot */}
      <span className={`h-2 w-2 rounded-full ${isConnected ? 'animate-pulse' : ''} ${activeColor}`}></span>
      
      {/* The Label */}
      <span>
        {isConnected && address
          ? `BASE: ${address.slice(0, 6)}...${address.slice(-4)}` 
          : label || "Disconnected"}
      </span>
    </div>
  );
}