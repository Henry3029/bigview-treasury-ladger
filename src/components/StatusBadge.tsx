"use client";
import { usePrivy } from '@privy-io/react-auth';
import React from 'react';

interface StatusBadgeProps {
  status: 'online' | 'offline' | 'maintenance' | string;
  label: string;
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const { authenticated, user } = usePrivy();
  
  // 1. Correct way to find the Stacks address in Privy
  // We look through linked accounts for one that looks like a Stacks address
  const stacksAddress = user?.linkedAccounts?.find(
    (acc: any) => acc.type === 'wallet' && acc.connectorType === 'stacks'
  )?.address || user?.wallet?.address;

  // 2. Logic for the visual indicator
  // If authenticated, we show "Success" colors, otherwise we show the passed-in "status"
  const isConnected = authenticated && stacksAddress;
  const activeColor = isConnected ? 'bg-green-500' : 'bg-red-500';
  const bgColor = isConnected ? 'bg-green-50' : 'bg-red-50';
  const textColor = isConnected ? 'text-green-700' : 'text-red-700';

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all
      ${bgColor} ${textColor} ${isConnected ? 'border-green-100' : 'border-red-100'}`}>
      
      {/* The Status Dot */}
      <span className={`h-2 w-2 rounded-full animate-pulse ${activeColor}`}></span>
      
      {/* The Label */}
      <span>
        {isConnected 
          ? `STX: ${stacksAddress.slice(0, 5)}...${stacksAddress.slice(-4)}` 
          : label || "Disconnected"}
      </span>
    </div>
  );
}