"use client";

import React, { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';

interface HistoryItem {
  id: string;
  date: string;
  amount: string;
  status: string;
}

export const RewardHistory = () => {
  // 1. Swap Stacks Hook for Privy
  const { user, authenticated } = usePrivy();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserHistory() {
      // 2. Get the address from Privy's wallet object
      const stxWallet = user?.linkedAccounts.find((account) => account.type === 'wallet' && account.connectorType === 'stacks');
      const address = stxWallet?.address;

      if (!authenticated || !address) {
        setLoading(false);
        return;
      }

      try {
        // Fetching real transaction data from the Testnet API
        const res = await fetch(
          `https://api.testnet.hiro.so/extended/v1/address/${address}/transactions?limit=5`
        );
        const data = await res.json();

        if (data.results) {
          const formattedData = data.results.map((tx: any) => ({
            id: tx.tx_id,
            date: tx.burn_block_time 
              ? new Date(tx.burn_block_time * 1000).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              : 'Pending',
            // Check if it's a contract call or a standard transfer
            amount: tx.tx_type === 'contract_call' ? 'Contract' : 'STX', 
            status: tx.tx_status === 'success' ? 'Confirmed' : 'Pending',
          }));
          setHistory(formattedData);
        }
      } catch (err) {
        console.error("Error fetching reward history:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserHistory();
  }, [user, authenticated]);

  if (loading) return <div className="p-4 text-gray-400 animate-pulse text-sm font-medium">Syncing history...</div>;
  
  if (history.length === 0) return (
    <div className="p-8 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
      <p className="text-gray-400 text-sm italic">No recent activity found on-chain.</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end px-1">
        <h3 className="text-blue-950 font-bold text-lg">Recent Activity</h3>
        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-md">Live Data</span>
      </div>

      {history.map((item) => (
        <div key={item.id} className="bg-white p-4 rounded-3xl flex justify-between items-center shadow-sm border border-gray-100 hover:border-blue-100 transition-colors">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${
              item.status === 'Confirmed' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
            }`}>
              {item.status === 'Confirmed' ? '✓' : '⧗'}
            </div>
            <div>
              <p className="font-bold text-gray-900 leading-tight">{item.status}</p>
              <p className="text-xs text-gray-400 font-medium">{item.date}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-black text-gray-900">{item.amount}</p>
            <a 
              href={`https://explorer.hiro.so/txid/${item.id}?chain=testnet`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] text-blue-400 font-mono hover:underline"
            >
              {item.id.substring(0, 6)}...
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};