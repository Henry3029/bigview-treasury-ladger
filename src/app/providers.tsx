"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider, createConfig, http } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiCryptoConfig } from "@privy-io/wagmi";

// 1. Setup Wagmi Config for Base Sepolia
export const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""} // Get this from dashboard.privy.io
      config={{
        // 2. Hybrid Login: Appearance & Wallet Logic
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
          showWalletLoginFirst: true, // Shows "Connect Wallet" for your existing users first
        },
        // Allows users to create a wallet with Google/Email if they don't have one
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
        defaultChain: baseSepolia,
        supportedChains: [baseSepolia],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}