// utils/cryptoPrice.ts

export async function getLiveEthPrice(): Promise<number> {
  try {
    // Calling CoinGecko's completely free, public endpoint
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
      { next: { revalidate: 60 } } // Next.js trick: Cache the price for 60 seconds to avoid spamming
    );
    
    const data = await response.json();
    
    // CoinGecko returns: { ethereum: { usd: 3450.25 } }
    return data.ethereum.usd;
  } catch (error) {
    console.error("Failed to fetch ETH price from CoinGecko:", error);
    return 3450.00; // Safe backup fallback price if the internet drops out
  }
}