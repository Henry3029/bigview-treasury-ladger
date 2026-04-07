// src/lib/viemClient.ts
import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';

export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(), // This uses the default public RPC
});