'use client';

import { PrivyProvider } from '@privy-io/react-auth';

export default function AppPrivyProvider({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#DAA520', 
          showWalletLoginFirst: false, 
        },
        loginMethods: ['email', 'google', 'apple'],
        
        embeddedWallets: {
          //  Change this to 'all-users' to ensure a wallet is ALWAYS created
          createOnLogin: 'all-users', 
          requireUserPasswordOnCreate: false,
        },
        //  This is the secret sauce for non-EVM chains like Stacks
        // It tells Privy to keep the wallet "chain-agnostic"
        externalWallets: {
          stacks: {
            enabled: true
          }
        }
      }}
    >
      {children}
    </PrivyProvider>
    </html>
  );
}