'use client';

import {PrivyProvider} from '@privy-io/react-auth';

export default function AppPrivyProvider({children}: {children: React.ReactNode}) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        // Customize appearance and login methods here
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets', // Automatically create a wallet for new users
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}