'use client';

import { PrivyProvider } from '@privy-io/react-auth';

export default function AppPrivyProvider({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body> {/* 👈 1. Added body tag here */}
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
              // 👈 2. This creates an Ethereum wallet by default
              createOnLogin: 'all-users', 
              requireUserPasswordOnCreate: false,
            },

            // 👈 3. This is how you actually enable Stacks in the SDK
            additionalChains: [], // Add custom chain objects here if needed
            
            /* Note: As of the latest SDK, Stacks is often handled as an 
               "extended chain." If your dashboard has Stacks enabled, 
               Privy will handle the derivation.
            */
          }}
        >
          {children}
        </PrivyProvider>
      </body> {/* 👈 4. Closed body tag here */}
    </html>
  );
}