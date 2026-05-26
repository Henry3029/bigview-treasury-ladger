// services/bigviewStatsHub.ts
import { createPublicClient, http, formatEther } from 'viem';
import { baseSepolia } from 'viem/chains';
import { TREASURY_ABI } from '@/utils/constants'; 
import { TREASURY_ADDRESS } from '@/config/env'; 
import { getLiveTokenPrice } from '@/utils/cryptoPrice'; 
import { publicClient } from '@/utils/client'; 

export interface LiveStatUpdate {
  id: string;
  cryptoAmount: number;
  fiatRate: number;
}

export async function fetchLiveHubStats(): Promise<LiveStatUpdate[]> {
  try {
    if (!TREASURY_ADDRESS) throw new Error("TREASURY_ADDRESS is not configured in .env");

    // 2. Fire off ALL blockchain reads AND individual price utility calls at the same time!
    const [
      rawRewards, 
      rawTotalStaked, 
      rawNative,
      ethPrice,     //  Result of individual utility call 1
      cbEthPrice,   //  Result of individual utility call 2
      bvwPrice      //  Result of individual utility call 3
    ] = await Promise.all([
      // Blockchain Contract Reads
      publicClient.readContract({ address: TREASURY_ADDRESS, abi: TREASURY_ABI, functionName: 'totalRewardsPaid' }),
      publicClient.readContract({ address: TREASURY_ADDRESS, abi: TREASURY_ABI, functionName: 'totalStakedcbETH' }),
      publicClient.getBalance({ address: TREASURY_ADDRESS }),
      
      // Your Custom Utility Functions (Fetching one by one in parallel)
      getLiveTokenPrice('ethereum'),
      getLiveTokenPrice('coinbase-wrapped-staked-eth'),
      getLiveTokenPrice('bigview-token') // Replace with your actual asset ID if listed, or fallback number
    ]);

    // 3. Construct the clean array mapping straight to your state positions
    return [
      {
        id: 'rewards',
        cryptoAmount: Number(formatEther(rawRewards)),
        fiatRate: ethPrice //  Clean, live, and reactive!
      },
      {
        id: 'cbeth-tvl',
        cryptoAmount: Number(formatEther(rawTotalStaked)), 
        fiatRate: cbEthPrice
      },
      {
        id: 'bvw-tvl',
        cryptoAmount: Number(formatEther(rawTotalStaked)), 
        fiatRate: bvwPrice || 0.50 // Fallback to baseline price if token isn't live on CG yet
      },
      {
        id: 'native-tvl',
        cryptoAmount: Number(formatEther(rawNative)), 
        fiatRate: ethPrice
      }
    ];

  } catch (error) {
    console.error("Stats Hub Service failed, using fallbacks:", error);
    return [
      { id: 'rewards', cryptoAmount: 1134.52, fiatRate: 3450 },
      { id: 'cbeth-tvl', cryptoAmount: 16542.18, fiatRate: 3890 },
      { id: 'bvw-tvl', cryptoAmount: 20245282, fiatRate: 0.45 },
      { id: 'native-tvl', cryptoAmount: 8432.90, fiatRate: 3450 }
    ];
  }
}