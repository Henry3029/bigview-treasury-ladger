"use client";

import React, { useEffect, useState } from 'react';
import { useConnect } from "@stacks/connect-react";

interface HistoryItem {
  id: string;
  date: string;
  amount: string;
  status: string;
}

export const RewardHistory = () => {
  const { userSession } = useConnect();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserHistory() {
      if (!userSession.isUserSignedIn()) {
        setLoading(false);
        return;
      }

      const address = userSession.loadUserData().profile.stxAddress.testnet;
      
      try {
        const res = await fetch(
          `https://api.testnet.hiro.so/extended/v1/address/${address}/transactions?limit=5`
        );
        const data = await res.json();

        const formattedData = data.results.map((tx: any) => ({
          id: tx.tx_id,
          // Convert unix timestamp to readable date
          date: new Date(tx.burn_block_time * 1000).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
          // In a real DAO, you'd parse the specific 'amount' from contract events
          amount: tx.tx_type === 'contract_call' ? 'Action' : 'STX', 
          status: tx.tx_status === 'success' ? 'Confirmed' : 'Pending',
        }));

        setHistory(formattedData);
      } catch (err) {
        console.error("Error fetching reward history:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserHistory();
  }, [userSession]);

  if (loading) return <div className="p-4 text-gray-400 animate-pulse">Syncing history...</div>;
  if (history.length === 0) return <div className="p-4 text-gray-400 italic">No recent activity found.</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-gray-800 font-bold px-1 text-lg">Recent Activity</h3>
      {history.map((item) => (
        <div key={item.id} className="bg-white p-4 rounded-3xl flex justify-between items-center shadow-sm border border-gray-50">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              item.status === 'Confirmed' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
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
            <p className="text-[10px] text-gray-300 font-mono">ID: {item.id.substring(0, 6)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};