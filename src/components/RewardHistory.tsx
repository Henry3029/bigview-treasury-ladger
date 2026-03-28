"use client";

import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { ExternalLink, CheckCircle2, Clock, history as HistoryIcon } from 'lucide-react';

interface HistoryItem {
  id: string;
  date: string;
  type: string;
  status: string;
}

export const RewardHistory = () => {
  const { address, isConnected } = useAccount();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserHistory() {
      if (!isConnected || !address) {
        setLoading(false);
        return;
      }

      const treasuryAddress = process.env.NEXT_PUBLIC_TREASURY_ADDRESS?.toLowerCase();

      try {
        // Fetching real transaction data from Base Sepolia Testnet
        // Note: You can also use Alchemy or Infura for this, but Basescan is standard.
        const res = await fetch(
          `https://api-sepolia.basescan.org/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${process.env.NEXT_PUBLIC_BASESCAN_API_KEY}`
        );
        const data = await res.json();

        if (data.status === "1" && data.result) {
          // Filter transactions specifically interacting with your Treasury
          const filtered = data.result
            .filter((tx: any) => tx.to?.toLowerCase() === treasuryAddress)
            .slice(0, 5) // Get latest 5
            .map((tx: any) => ({
              id: tx.hash,
              date: new Date(parseInt(tx.timeStamp) * 1000).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              }),
              type: tx.functionName?.split('(')[0] || 'Transaction',
              status: tx.isError === "0" ? 'Confirmed' : 'Failed',
            }));
          
          setHistory(filtered);
        }
      } catch (err) {
        console.error("Error fetching Base history:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserHistory();
  }, [address, isConnected]);

  if (loading) return <div className="p-4 text-gray-400 animate-pulse text-sm font-medium">Syncing history...</div>;
  
  if (history.length === 0) return (
    <div className="p-8 text-center bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
      <p className="text-gray-400 text-sm italic">No recent treasury activity found.</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end px-1 mt-6">
        <h3 className="text-slate-900 font-black text-xl italic tracking-tight">Recent Activity</h3>
        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-lg">Base Sepolia</span>
      </div>

      {history.map((item) => (
        <div key={item.id} className="bg-white p-5 rounded-[2rem] flex justify-between items-center shadow-sm border border-slate-100 hover:border-blue-200 transition-all group">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              item.status === 'Confirmed' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
            }`}>
              {item.status === 'Confirmed' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
            </div>
            <div>
              <p className="font-bold text-slate-900 leading-tight capitalize">
                {item.type.replace(/([A-Z])/g, ' $1').trim()}
              </p>
              <p className="text-xs text-slate-400 font-medium">{item.date}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-xs font-bold mb-1 ${item.status === 'Confirmed' ? 'text-green-600' : 'text-red-500'}`}>
              {item.status}
            </p>
            <a 
              href={`https://sepolia.basescan.org/tx/${item.id}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] text-blue-500 font-mono hover:underline justify-end"
            >
              {item.id.substring(0, 6)}... <ExternalLink size={10} />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};