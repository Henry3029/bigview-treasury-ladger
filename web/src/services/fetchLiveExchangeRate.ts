import { createPublicClient, http, formatEther } from 'viem'; 
import { baseSepolia } from 'viem/chain'; import { TREASURY_ADDRESS } from '@/config/env';
import { TREASURY_ABI } from '@/utils/constants'; 


const publicClient = createPublicClient({
	chain: baseSepolia, 
	transport: http(),
	})

export async function fetchLiveExchangeRate(): Promise<number> {
  try {
    const rawRate = await publicClient.readContract({
      address: TREASURY_ADDRESS,
      abi: TREASURY_ABI,
      functionName: 'getExchangeRate',
    });

    // The contract returns the rate multiplied by 10^18 (Wei format)
    // formatEther scales it back down to a normal human readable decimal like 1.1294
    return Number(formatEther(rawRate as bigint));
  } catch (error) {
    console.error("Failed to fetch on-chain cbETH exchange rate:", error);
    return 1.1294; // Your safe UI baseline fallback
  }
}