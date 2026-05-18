// The official cbETH Token Contract Address on Base Mainnet
const CBETH_ADDRESS = '0x2Ae3F1Ec7F1F5012CFEab0185abd7ef84Df8DE33'; 

// Minimal ABI snippet needed to read the exchange rate
const CBETH_MINI_ABI = [
  {
    name: 'exchangeRate',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }]
  }
] as const;

export async function fetchLiveExchangeRate(): Promise<number> {
  try {
    const rawRate = await publicClient.readContract({
      address: CBETH_ADDRESS,
      abi: CBETH_MINI_ABI,
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