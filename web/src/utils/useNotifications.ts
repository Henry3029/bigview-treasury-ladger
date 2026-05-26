import { publicClient } from '@/utils/viemClient'; 
import { formatEther, parseAbiItem } from 'viem';
import { TREASURY_ADDRESS } from '@/config/env'; 

// 1. 🟢 DEFINE YOUR CUSTOM INTERFACE 
// This forces TypeScript to look for YOUR fields, not the browser's defaults!
export interface CustomNotification {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'error' | 'info';
  time: string;
}

// 2. Update the function signature return type label to match your interface
export async function getLiveNotifications(userAddress: string): Promise<CustomNotification[]> {
  try {
    // Adding ': any[]' bypasses the strict log-inference loop completely
    const logs: any[] = await publicClient.getLogs({
      address: TREASURY_ADDRESS,
      event: parseAbiItem('event Staked(address indexed user, uint256 ethAmount, uint256 bvwEarned)'),
      args: { user: userAddress as `0x${string}` }, 
      fromBlock: 'earliest',
    });

    return logs.map((log, index) => {
      // Convert BigInt safely
      const ethValue = log.args?.ethAmount ? Number(formatEther(log.args.ethAmount)) : 0;
      
      // 🟢 This perfectly satisfies your CustomNotification interface specifications!
      return {
        id: log.transactionHash || `fallback-id-${index}`,
        title: 'Stake Confirmed',
        description: `Successfully staked ${ethValue.toFixed(4)} ETH in Bigview Treasury.`,
        type: 'success', // Matches the literal 'success' type constraint
        time: 'Just now'
      };
    });
  } catch (error) {
    console.error("Bigview Blockchain Error:", error);
    return [];
  }
}