"use client";
import { usePrivy } from '@privy-io/react-auth';
import React from 'react';

// 1. Define the rules (Interface) for the props
interface StatusBadgeProps {
  status: 'online' | 'offline' | 'maintenance' | string;
  label: string;
}


// 2. Apply the interface to the component
export default function StatusBadge({ status, label }: StatusBadgeProps) {
  // Determine dot color based on status
  const dotColor = status === 'online' ? 'bg-green-500' : 'bg-red-500';
  const { authenticated, user } = usePrivy();
  
  // 2. Identify the connected Stacks address
  const stacksAddress = user?.wallet?.address; // This depends on how Privy maps it

  return (
    <div className={`flex items-center gap-2 p-2 rounded-full text-sm font-medium
      ${authenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
      <span className={`h-2 w-2 rounded-full ${authenticated ? 'bg-green-500' : 'bg-red-500'}`}></span>
      {authenticated ? `Connected: ${stacksAddress?.slice(0,6)}...` : "Disconnected"}
    </div>
  );
}