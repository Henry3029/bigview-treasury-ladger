"use client";

import React, { useEffect, useState } from 'react';
import { UserSession, AppConfig } from '@stacks/connect';

// 1. INITIALIZE NATIVE STACKS SESSION
const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

interface StatusBadgeProps {
  status?: 'online' | 'offline' | 'maintenance' | string;
  label?: string;
}

export default function StatusBadge({ label }: StatusBadgeProps) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 2. CHECK SIGN-IN STATUS NATIVELY
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      const stxAddress = userData.profile.stxAddress.testnet;
      setAddress(stxAddress);
      setIsConnected(true);
    }
  }, []);

  // 3. Logic for the visual indicator
  const activeColor = isConnected ? 'bg-green-500' : 'bg-red-500';
  const bgColor = isConnected ? 'bg-green-50' : 'bg-red-50';
  const textColor = isConnected ? 'text-green-700' : 'text-red-700';

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all
      ${bgColor} ${textColor} ${isConnected ? 'border-green-100' : 'border-red-100'}`}>
      
      {/* The Status Dot */}
      <span className={`h-2 w-2 rounded-full ${isConnected ? 'animate-pulse' : ''} ${activeColor}`}></span>
      
      {/* The Label */}
      <span>
        {isConnected && address
          ? `STX: ${address.slice(0, 5)}...${address.slice(-4)}` 
          : label || "Disconnected"}
      </span>
    </div>
  );
}