"use client";

import React from 'react';
// 1. Try a more direct import if the named one is failing
import { ConnectProvider } from '@stacks/connect-react';
import { PrivyProvider } from '@privy-io/react-auth';

export function Providers({ children }: { children: React.ReactNode }) {
  // 2. Define authOptions outside the return for clarity
  const stxOptions = {
    appDetails: {
      name: 'Bigview Treasury',
      icon: '/images/bigview-image.png',
    },
  };

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || "your-app-id-here"}
      config={{
        appearance: { theme: 'light' },
      }}
    >
      <ConnectProvider authOptions={stxOptions}>
        {children}
      </ConnectProvider>
    </PrivyProvider>
  );
}