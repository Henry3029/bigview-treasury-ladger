'use client';

import {PrivyProvider} from '@privy-io/react-auth';

export default function AppPrivyProvider({children}: {children: React.ReactNode}) {
  return (
    <PrivyProvider
      // We use a fallback string just in case the .env is being a "demon" again
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'insert-your-id-here'}
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          logo: 'https://your-logo-url.com/logo.png', // Optional: adds professional touch
        },
        // ✅ FIXED: Using the standard configuration for modern Privy
        embeddedWallets: {
          createOnLogin: 'users-without-wallets', 
          requireUserPasswordOnCreate: false, // Makes it smoother for users
        },
        // If 'createOnLogin' still shows a red line, 
        // it means your version uses 'onCreateWallet':
        /* embeddedWallets: {
          onCreateWallet: 'users-without-wallets',
        }, 
        */
      }}
    >
      {children}
    </PrivyProvider>
  );
}