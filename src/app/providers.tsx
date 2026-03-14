"use client"; // This line is the magic fix!

import { ConnectProvider } from '@stacks/connect-react';
import AppPrivyProvider from '@/components/PrivyProvider';
import Image from 'next/image';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConnectProvider
      authOptions={{
        appDetails: {
          name: 'Bigview Treasury',
          icon: '/images/bigview-image.png" ', // Replace with your actual icon path
        },
      }}
    >
      {children}
    </ConnectProvider>
  );
}