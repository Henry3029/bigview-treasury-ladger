import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // 1. Setup your Bigview Profit Settings
  const MY_WALLET = process.env.BIGVIEW_PROFIT_WALLET;
  const BIGVIEW_FEE = "0.01"; // 1% Fee
  
if (!MY_WALLET) {
  throw new Error("Missing BIGVIEW_PROFIT_WALLET in environment variables");
}

  // 2. Forward the request to 0x v2
  const query = new URLSearchParams({
    sellToken: searchParams.get('sellToken') || '',
    buyToken: searchParams.get('buyToken') || '',
    sellAmount: searchParams.get('sellAmount') || '',
    feeRecipient: MY_WALLET,
    buyTokenPercentageFee: BIGVIEW_FEE,
  });

  const res = await fetch(`https://base.api.0x.org/swap/v2/quote?${query}`, {
    headers: {
      '0x-api-key': process.env.ZEROX_API_KEY as string,
    },
  });

  const data = await res.json();
  return NextResponse.json(data);
}