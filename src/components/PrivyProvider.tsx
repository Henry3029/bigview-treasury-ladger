'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { Stacks } from '@js-items/stacks-network'; // Optional: if you want to be specific

export default function AppPrivyProvider({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      // Ensure this matches exactly what is in your Privy Dashboard
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#DAA520', // Changed to match your "Grainlify Gold"
          showWalletLoginFirst: false, // This ensures Email/Google shows up first!
        },
        // We need to tell Privy to support Stacks specifically
        supportedChains: [], 
        embeddedWallets: {
          onCreateWallet: 'users-without-wallets',
          requireUserPasswordOnCreate: false, // Makes it "Seamless" for Google users
        },
        // ADD THIS: Specifically for Stacks support
        loginMethods: ['email', 'google', 'apple'],
      }}
    >
      {children}
    </PrivyProvider>
  );
}