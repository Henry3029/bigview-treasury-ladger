"use client";

import React from 'react';
import { ConnectProvider } from '@stacks/connect-react';
import AppPrivyProvider from '@/components/PrivyProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppPrivyProvider>
      <ConnectProvider
        authOptions={{
          appDetails: {
            name: 'Bigview Treasury',
            icon: '/images/bigview-image.png', // Fixed the extra quote here
          },
        }}
      >
        {children}
      </ConnectProvider>
    </AppPrivyProvider>
  );
}