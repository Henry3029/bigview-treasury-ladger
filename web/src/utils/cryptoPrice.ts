// utils/cryptoPrice.ts

export async function getLiveEthPrice(): Promise<number> {
  try {
    // Calling CoinGecko's public endpoint
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
      { next: { revalidate: 60 } } // Cache the price for 60 seconds to avoid spamming
    );
    
    // 🚀 FIXED: Guard clause to catch rate-limits (429) or server errors (500) safely
    if (!response.ok) {
      throw new Error(`CoinGecko API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // 🚀 FIXED: Added optional chaining (?.) for deep object structural protection
    if (data?.ethereum?.usd) {
      return data.ethereum.usd;
    }
    
    throw new Error("Unexpected JSON data layout structure from CoinGecko");
  } catch (error) {
    console.error("Failed to fetch ETH price from CoinGecko:", error);
    return 3450.00; // Safe backup fallback price if the internet or API drops out
  }
}