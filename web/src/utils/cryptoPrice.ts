import { COINGECKO } from '@/utils/cryptoPrice'; 
// utils/cryptoPrice.ts

export async function getLiveTokenPrice(tokenId: string): Promise<number> {
  try {
    // Calling CoinGecko's public endpoint
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`,
      {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      // CHOOSE ONE OF THE KEYS BELOW BASED ON YOUR PLAN:
      'x-cg-demo-api-key': COINGECKO,  // Use this if you are on the FREE Demo plan
      // 'x-cg-pro-api-key': apiKey, // Use this if you are on a PAID Pro plan
    },
      { next: { revalidate: 60, } } // Cache the price for 60 seconds to avoid spamming
    );
    
    const data = await response.json();
    
    console.log(" RAW COINGECKO RESPONSE:", JSON.stringify(data));
    
    // FIXED: Added optional chaining (?.) for deep object structural protection
    if (data?.[tokenId]?.usd) {
      return data[tokenId].usd;
    }

  } catch (error) {
    console.error(`Failed to fetch ${tokenId} price, using safety asset fallbacks:`, error);
    
    // Dynamic fallbacks based on which keyword token was sent in!
    if (tokenId === 'coinbase-wrapped-staked-eth') return 3890.00;
    if (tokenId === 'bigview-token') return 0.50;
    
    return 3450.00; // Default fallback for 'ethereum'
  }
  }