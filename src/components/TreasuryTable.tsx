"use client";

import React, { useEffect, useState } from 'react';

interface TreasuryTableProps {
  address: string | null;
}

export default function TreasuryTable({ address }: TreasuryTableProps) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<'success' | 'error' | 'info' | null>(null);

  const notify = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage(text);
    setStatus(type);
    
    setTimeout(() => {
      setMessage(null);
      setStatus(null);
    }, 4000);
  };

  useEffect(() => {
    async function fetchHistory() {
      if (!address) {
        notify("Please connect your wallet to view history.", "info");
        setLoading(false);
        return;
      }

      try {
        // We don't necessarily need a notification for every fetch, 
        // but it's good for the initial load!
        const res = await fetch(
          `https://api.testnet.hiro.so/extended/v1/address/${address}/transactions`,
          { cache: 'no-store' }
        );
        const data = await res.json();
        setTransactions(data.results || []);
        
        if (data.results?.length > 0) {
          notify("Transactions updated.", "success");
        }
      } catch (err) {
        console.error("Failed to fetch history", err);
        // Fixed: Added the 'error' type here
        notify("Could not connect to the Stacks API.", "error"); 
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [address]);

  if (!address) return <div className="p-4 bg-slate-50 rounded-xl text-slate-500 italic">Please sign in to see your history.</div>;
  if (loading && transactions.length === 0) return <div className="p-4 animate-pulse text-slate-400">Loading history...</div>;

  return (
    <div className="space-y-4">
      {/* Moved the message ABOVE the table for better layout */}
      {message && (
        <div className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
          status === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 
          status === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 
          'bg-blue-50 text-blue-700 border border-blue-100'
        }`}>
          {message}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b text-left text-slate-500 text-sm font-semibold">
              <th className="py-4 px-2">ID</th>
              <th className="py-4 px-2">Status</th>
              <th className="py-4 px-2 text-right">Type</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx: any) => (
              <tr key={tx.tx_id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                <td className="py-4 px-2 font-mono text-xs text-orange-600">
                  {tx.tx_id.substring(0, 10)}...
                </td>
                <td className="py-4 px-2">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    tx.tx_status === 'success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {tx.tx_status}
                  </span>
                </td>
                <td className="py-4 px-2 text-sm text-slate-700 text-right">
                  {tx.tx_type.replace('_', ' ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}