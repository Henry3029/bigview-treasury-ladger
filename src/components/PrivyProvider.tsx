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
        // ✅ UPDATED: Modern Privy Configuration
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}