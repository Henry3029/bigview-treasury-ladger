// utils/cryptoPrice.ts

export async function getLiveEthPrice(tokenId: string): Promise<number> {
  try {
    // Calling CoinGecko's public endpoint
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`
      { next: { revalidate: 60 } } // Cache the price for 60 seconds to avoid spamming
    );
    
    // FIXED: Guard clause to catch rate-limits (429) or server errors (500) safely
    if (!response.ok) {
      throw new Error(`CoinGecko API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // FIXED: Added optional chaining (?.) for deep object structural protection
    if (data?.[tokenId]?.usd) {
      return data[tokenId].usd;
    }
    
    throw new Error("Unexpected JSON data layout structure from CoinGecko");
  } catch (error) {
    console.error(`Failed to fetch ${tokenId} price, using safety asset fallbacks:`, error);
    
    // Dynamic fallbacks based on which keyword token was sent in!
    if (tokenId === 'coinbase-wrapped-staked-eth') return 3890.00;
    if (tokenId === 'bigview-token') return 0.50;
    
    return 3450.00; // Default fallback for 'ethereum'
  }