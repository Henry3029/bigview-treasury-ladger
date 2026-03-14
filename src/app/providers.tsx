"use client";

import React from 'react';
import * as StacksConnect from '@stacks/connect-react';
import { PrivyProvider } from '@privy-io/react-auth';

export function Providers({ children }: { children: React.ReactNode }) {
  // 1. Let's see what is actually inside the Stacks library
  console.log("Stacks Library Content:", StacksConnect);

  // 2. Safely grab the provider
  const StacksProvider = StacksConnect.ConnectProvider;

  const stxOptions = {
    appDetails: {
      name: 'Bigview Treasury',
      icon: '/images/bigview-image.png',
    },
  };

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || "your-app-id"}
      config={{ appearance: { theme: 'light' } }}
    >
      {/* 3. Only render if the provider actually exists */}
      {StacksProvider ? (
        <StacksProvider authOptions={stxOptions}>
          {children}
        </StacksProvider>
      ) : (
        <div className="p-10 text-red-500 bg-white">
          Stacks Provider failed to load. Please check your console (F12).
        </div>
      )}
    </PrivyProvider>
  );
}