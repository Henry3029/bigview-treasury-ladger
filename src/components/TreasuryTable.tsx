"use client";

import React, { useEffect, useState } from 'react';
import { ExternalLink, CheckCircle2, AlertCircle, Info } from 'lucide-react';

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

      const apiKey = process.env.NEXT_PUBLIC_BASESCAN_API_KEY;

      try {
        // Fetching from Base Sepolia API
        const res = await fetch(
          `https://api-sepolia.basescan.org/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`,
          { cache: 'no-store' }
        );
        const data = await res.json();
        
        if (data.status === "1" && data.result) {
          setTransactions(data.result.slice(0, 10) || []);
          notify("Base transactions updated.", "success");
        }
      } catch (err) {
        console.error("Failed to fetch history", err);
        notify("Could not connect to the Base Explorer.", "error"); 
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [address]);

  if (!address) return <div className="p-6 bg-slate-50 rounded-[2rem] text-slate-400 font-medium italic border border-dashed border-slate-200 text-center">Please sign in to see your history.</div>;
  if (loading && transactions.length === 0) return <div className="p-4 animate-pulse text-slate-400 font-black uppercase tracking-widest text-xs">Syncing Ledger...</div>;

  return (
    <div className="space-y-6">
      {/* Dynamic Notification Toast */}
      {message && (
        <div className={`p-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3 shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${
          status === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 
          status === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 
          'bg-blue-50 text-blue-700 border border-blue-100'
        }`}>
          {status === 'success' && <CheckCircle2 size={16} />}
          {status === 'error' && <AlertCircle size={16} />}
          {status === 'info' && <Info size={16} />}
          {message}
        </div>
      )}

      <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-left text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <th className="py-5 px-6">Tx Hash</th>
              <th className="py-5 px-6">Status</th>
              <th className="py-5 px-6 text-right">Method</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {transactions.map((tx: any) => (
              <tr key={tx.hash} className="hover:bg-slate-50/80 transition-colors group">
                <td className="py-5 px-6">
                  <a 
                    href={`https://sepolia.basescan.org/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[11px] text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {tx.hash.substring(0, 12)}... <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </td>
                <td className="py-5 px-6">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                    tx.isError === '0' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {tx.isError === '0' ? 'Confirmed' : 'Failed'}
                  </span>
                </td>
                <td className="py-5 px-6 text-[11px] font-bold text-slate-600 text-right capitalize">
                  {tx.functionName ? tx.functionName.split('(')[0].replace(/([A-Z])/g, ' $1') : 'Transfer'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}