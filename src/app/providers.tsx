"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider, createConfig, http } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 1. Setup Wagmi Config for Base Sepolia
export const config = createConfig({
  chains: [baseSepolia],
  // DISABLE auto-reconnect on mount to prevent the app from "guessing" the user
  reconnectOnMount: false, 
  transports: {
    [baseSepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""} 
      config={{
        // 2. Define exactly what options appear in the modal
        loginMethods: ['google', 'email', 'wallet', 'apple'],

        appearance: {
          theme: "light",
          accentColor: "#2563eb", // Matches your Bigview brand blue
          showWalletLoginFirst: false, // Shows Google/Email/Socials first for a modern look
        },

        // 3. Prevent automatic wallet creation until they actually log in
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
          requireUserPasswordOnCreate: false, // Makes it smoother for mobile users
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