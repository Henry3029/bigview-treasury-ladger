"use client";

import React, { useEffect, useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth'; // Added useWallets
import { ExternalLink, CheckCircle2, Clock } from 'lucide-react';

interface HistoryItem {
  id: string;
  date: string;
  type: string;
  status: string;
}

export const RewardHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { authenticated } = usePrivy();
  const { wallets } = useWallets(); // Get the wallet array
  
  // Define address from the primary wallet
  const wallet = wallets[0];
  const address = wallet?.address;

  useEffect(() => {
    async function fetchUserHistory() {
      // Safety check: Stop if not logged in or no wallet found
      if (!authenticated || !address) {
        setLoading(false);
        return;
      }

      const treasuryAddress = process.env.NEXT_PUBLIC_TREASURY_ADDRESS?.toLowerCase();
      const apiKey = process.env.NEXT_PUBLIC_BASESCAN_API_KEY;

      try {
        const res = await fetch(
          `https://api-sepolia.basescan.org/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`
        );
        const data = await res.json();

        if (data.status === "1" && data.result) {
          const filtered = data.result
            .filter((tx: any) => tx.to?.toLowerCase() === treasuryAddress)
            .slice(0, 5)
            .map((tx: any) => ({
              id: tx.hash,
              date: new Date(parseInt(tx.timeStamp) * 1000).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              }),
              // Clean up the name: "claimRewards" becomes "Claim Rewards"
              type: tx.functionName 
                ? tx.functionName.split('(')[0].replace(/([A-Z])/g, ' $1').trim() 
                : 'Transaction',
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
  }, [address, authenticated]); // Dependencies updated

  if (loading) return <div className="p-4 text-slate-400 animate-pulse text-sm font-medium">Syncing history...</div>;
  
  if (history.length === 0) return (
    <div className="p-8 text-center bg-violet-background rounded-bigview border border-dashed border-slate-200">
      <p className="text-text-color-400 text-text-color">No recent activity found.</p>
    </div>
  );

  return (
  <div className="space-y-3">
    {/* Header Section */}
    <div className="flex justify-between items-end px-1 mt-6 mb-1">
      <h3 className="text-color-white font-black text-lg tracking-tight ">History</h3>
      <div className="flex items-center gap-2 bg-color-ash/10 px-2.5 py-1 rounded-bigview border border-gold-buttons/20">
          <div className="w-1.5 h-1.5 rounded-full bg-color-ash animate-pulse" />
          <span className="text-[9px] font-black text-gold-buttons uppercase tracking-widest">Base Sepolia</span>
      </div>
    </div>

    {/* List Section */}
    {history.map((item) => (
      <div key={item.id} className="bg-color-ash/5 p-4 rounded-bigview flex justify-between items-center shadow-sm border border-white/5 hover:bg-violet-glow/10 transition-all group">
        <div className="flex items-center gap-3">
          {/* Status Icon Box - Bigview Styled */}
          <div className={`w-10 h-10 rounded-bigview flex items-center justify-center ${
            item.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gold-buttons/10 text-gold-buttons'
          }`}>
            {item.status === 'Confirmed' ? <CheckCircle2 size={18} /> : <Clock size={18} />}
          </div>

          {/* Info */}
          <div>
            <p className="font-black text-white text-md leading-tight">
              {item.type}
            </p>
            <p className="text-[10px] text-white/30 font-bold tracking-tight">{item.date}</p>
          </div>
        </div>

        {/* Action/Status */}
        <div className="text-right">
           <a 
            href={`https://sepolia.basescan.org/tx/${item.id}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-white/5 hover:bg-color-ash/10 px-3 py-1.5 rounded-bigview transition-colors border border-white/5"
          >
            <span className="text-[10px] font-mono font-bold text-white/40 group-hover:text-gold-buttons transition-colors">
              {item.id.substring(0, 6)}...
            </span>
            <ExternalLink size={12} className="text-color-white/20 group-hover:text-gold-buttons transition-colors" />
          </a>
        </div>
      </div>
    ))}
  </div>
);
}