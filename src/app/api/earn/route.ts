import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(process.env.AERODROME_API_URL || '');
    const data = await response.json();
    const pool = data.data.find((p: any) => p.symbol === "vAMM-WETH/USDC");

    const rawApy = parseFloat(pool?.apr || "15.0");
    const devFeePercent = 10; // Your 10% cut
    const netApy = (rawApy * (1 - devFeePercent / 100)).toFixed(2);

    return NextResponse.json({
      rawApy: rawApy.toString(),
      apy: netApy, // This is what we show the user
      tvl: pool?.tvl || "1,200,000",
      devFee: devFeePercent.toString()
    });
  } catch (error) {
    return NextResponse.json({ apy: "12.0", tvl: "0" });
  }
}