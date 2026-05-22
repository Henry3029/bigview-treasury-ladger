import { createPublicClient, http, formatEther } from 'viem'; 
import { baseSepolia } from 'viem/chain'; import { CBETH_TOKEN_ADDRESS } from '@/config/env';

// Minimal ABI snippet needed to read the exchange rate
const CBETH_TOKEN_ABI = [
  {
    name: 'exchangeRate',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }]
  }
] as const;

const publicClient = createPublicClient({
	chain: baseSepolia, 
	transport: http(),
	})

export async function fetchLiveExchangeRate(): Promise<number> {
  try {
    const rawRate = await publicClient.readContract({
      address: CBETH_TOKEN_ADDRESS,
      abi: CBETH_TOKEN_ABI,
      functionName: 'exchangeRate',
    });

    // The contract returns the rate multiplied by 10^18 (Wei format)
    // formatEther scales it back down to a normal human readable decimal like 1.1294
    return Number(formatEther(rawRate as bigint));
  } catch (error) {
    console.error("Failed to fetch on-chain cbETH exchange rate:", error);
    return 1.1294; // Your safe UI baseline fallback
  }
}