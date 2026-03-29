"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { baseSepolia } from "viem/chains"; 

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""} 
      config={{
        // Switched theme to dark to match your OPay Gold/Black aesthetic
        appearance: {
          theme: "dark",
          accentColor: "#B8860B", // Your Gold Brand Color
          showWalletLoginFirst: true,
        },
        loginMethods: ['google', 'email', 'wallet', 'apple'],
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
          requireUserPasswordOnCreate: false,
        },
        defaultChain: baseSepolia,
        supportedChains: [baseSepolia],
      }}
    >
      {children}
    </PrivyProvider>
  );
}