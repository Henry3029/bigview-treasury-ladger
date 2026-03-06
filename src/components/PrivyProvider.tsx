'use client';

import {PrivyProvider} from '@privy-io/react-auth';

export default function AppPrivyProvider({children}: {children: React.ReactNode}) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
        },
        embeddedWallets: {
          // ✅ FIX: Move createOnLogin inside this new property
          automaticEmbeddedWalletCreation: {
            enabled: true,
            onNoWalletFound: true, 
          }
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}