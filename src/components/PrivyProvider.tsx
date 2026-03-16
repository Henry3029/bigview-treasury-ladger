'use client';

import { PrivyProvider } from '@privy-io/react-auth';

export default function AppPrivyProvider({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#DAA520', 
          showWalletLoginFirst: false, 
        },
        // 💡 Stacks isn't an EVM chain, so we leave supportedChains empty 
        // but we MUST enable the login methods specifically.
        loginMethods: ['email', 'google', 'apple'],
        
        embeddedWallets: {
          // 🔥 FIXED: Changed 'onCreateWallet' to 'createOnLogin'
          createOnLogin: 'users-without-wallets',
          requireUserPasswordOnCreate: false,
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}