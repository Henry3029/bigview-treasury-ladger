import { createPublicClient, http } from 'viem'; 
import { baseSepolia } from 'viem/chains'; 

// @/utils/client.ts
export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC) // Done once, covers everything!
});