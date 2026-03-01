// src/app/history/page.tsx
import TreasuryTable from "@/components/TreasuryTable"; // Adjust path if needed

async function getTreasuryData() {
  const TREASURY_ADDR = "ST1PQ..."; // Your contract address
  const res = await fetch(
    `https://api.testnet.hiro.so/extended/v1/address/${TREASURY_ADDR}/transactions`,
    { cache: 'no-store' }
  );
  return res.json();
}

export default async function HistoryPage() {
  const data = await getTreasuryData();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Treasury Ledger</h1>
      
      {/* 🚀 This is where your component goes! */}
      <TreasuryTable transactions={data.results} />
      
    </div>
  );
}