import { createPublicClient, http, formatEther } from 'viem'; 
import { baseSepolia } from 'viem/chains'; 

const BVW_POOL_ADDRESS = process.env.NEXT_PUBLIC_BVW_POOL_ADDRESS as `0x${string}`;

const POOL_MINI_ABI = [
  {
    name: 'getReserves', 
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '_reserve0', type: 'uint112' }, { name: '_reserve1', type: 'uint112' }]
  }
] as const;

const publicClient = createPublicClient({
  chain: baseSepolia, 
  transport: http(),
});

// 🚀 FIXED: Type changed to Promise<string> since formatEther returns a string!
export async function fetchBvwMarketPrice(): Promise<string> {
  try {
    const [reserve0, reserve1] = await publicClient.readContract({
      address: BVW_POOL_ADDRESS,
      abi: POOL_MINI_ABI,
      functionName: 'getReserves',
    });

    // 1. MATH FIRST (Using BigInt precision): 
    // We multiply reserve1 by 10^18 before dividing so we don't lose decimals
    const precisionMultiplier = 10n ** 18n;
    const rawPriceInWei = (reserve1 * precisionMultiplier) / reserve0;

    // 2. FORMAT LAST: Turns the massive BigInt into a clean string like "0.45"
    return formatEther(rawPriceInWei); 

  } catch (error) {
    console.error("DEX Pool liquid asset query failed:", error);
    return "0.45"; // 🚀 FIXED: Returns a matching string placeholder for safety
  }
}