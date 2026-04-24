"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { baseSepolia } from "viem/chains"; 

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
  <PrivyProvider
    appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""} 
    config={{
      appearance: {
        theme: "dark",
        /* Refined Gold: Closer to your Gold-Buttons for better visibility on violet */
        accentColor: "#FFD700", 
        showWalletLoginFirst: true,
        /* Adding branding text for the Privy Modal */
        walletList: ['metamask', 'coinbase_wallet', 'rainbow', 'phantom'],
      },
      loginMethods: ['google', 'email', 'wallet', 'apple'],
      embeddedWallets: {
        createOnLogin: "users-without-wallets",
        /* No-friction onboarding for your Web3 Ambassador mission */
        requireUserPasswordOnCreate: false,
      },
      /* Sticking strictly to Base Sepolia as requested */
      defaultChain: baseSepolia,
      supportedChains: [baseSepolia],
    }}
  >
    {children}
  </PrivyProvider>
);
}