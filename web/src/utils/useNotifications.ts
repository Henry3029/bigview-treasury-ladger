import { publicClient } from '@/utils/viemClient'; 
import { formatEther } from 'viem';
// Use 'type' for imports that are only used for labels to keep the file light
import { parseAbiItem } from 'viem';
import { TREASURY_ADDRESS } from '@/config/env'; 

export async function getLiveNotifications(userAddress: string): Promise<Notification[]> {
  try {
    const logs = await publicClient.getLogs({
      address: TREASURY_ADDRESS
      // 1. Updated to match your actual Solidity event name
      event: parseAbiItem('event Staked(address indexed user, uint256 ethAmount, uint256 bvwEarned)'),
      // 2. Updated 'to' to 'user' to match the event parameter
      args: { user: userAddress as `0x${string}` }, 
      fromBlock: 'earliest',
    });

    return logs.map(log => {
      // Convert BigInt to a readable number (ETH has 18 decimals)
      const ethValue = log.args.ethAmount ? Number(formatEther(log.args.ethAmount)) : 0;
      
      
      return {
        id: log.transactionHash || Math.random().toString(),
        title: 'Stake Confirmed',
        description: `Successfully staked ${ethValue} ETH in Bigview Treasury.`,
        type: 'success',
        time: 'Just now'
      };
    });
  } catch (error) {
    console.error("Bigview Blockchain Error:", error);
    return [];
  }
}