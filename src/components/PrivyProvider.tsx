"use client"; // Ensure this is at the very top!
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
        loginMethods: ['email', 'google', 'apple'],
        embeddedWallets: {
          createOnLogin: 'all-users', 
          requireUserPasswordOnCreate: false,
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}