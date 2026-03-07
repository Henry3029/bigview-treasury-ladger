'use client';

import { PrivyProvider } from '@privy-io/react-auth';

export default function AppPrivyProvider({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'insert-your-id-here'}
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
        },
        // ✅ THE ACTUAL FIX: 
        // In your version, 'createOnLogin' is GONE. 
        // It is now called 'onCreateWallet'.
        embeddedWallets: {
          onCreateWallet: 'users-without-wallets', 
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}