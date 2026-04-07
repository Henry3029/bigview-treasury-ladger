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

  if (!address) return <div className="p-6 bg-violet-background rounded-bigview text-text-color-400 font-medium italic border border-dashed border-slate-200 text-center">Please sign in to see your history.</div>;
  if (loading && transactions.length === 0) return <div className="p-4 animate-pulse text-slate-400 font-black uppercase tracking-widest text-xs">Syncing Ledger...</div>;

  return (
  <div className="space-y-6 font-inter">
    {/* Dynamic Notification Toast: Bigview Styled */}
    {message && (
      <div className={`p-4 rounded-bigview text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-top-2 border ${
        status === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
        status === 'error' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
        'bg-gold-buttons/10 text-gold-buttons border-gold-buttons/20'
      }`}>
        {status === 'success' && <CheckCircle2 size={16} />}
        {status === 'error' && <AlertCircle size={16} />}
        {status === 'info' && <Info size={16} />}
        <span className="italic">{message}</span>
      </div>
    )}

    {/* Transaction Ledger Table */}
    <div className="bg-white/[0.02] rounded-bigview border border-white/5 overflow-hidden shadow-2xl backdrop-blur-md">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-white/[0.03] text-left text-white/30 text-[9px] font-black uppercase tracking-[0.3em]">
            <th className="py-5 px-6 italic">Tx Hash</th>
            <th className="py-5 px-6 italic">Status</th>
            <th className="py-5 px-6 text-right italic">Method</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {transactions.map((tx: any) => (
            <tr key={tx.hash} className="hover:bg-white/[0.03] transition-colors group">
              <td className="py-5 px-6">
                <a 
                  href={`https://sepolia.basescan.org/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] text-gold-buttons/70 hover:text-gold-buttons flex items-center gap-2 transition-colors"
                >
                  {tx.hash.substring(0, 14)}... 
                  <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                </a>
              </td>
              <td className="py-5 px-6">
                <span className={`px-3 py-1 rounded-bigview text-[8px] font-black uppercase tracking-widest italic border ${
                  tx.isError === '0' 
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                    : 'bg-red-500/10 text-red-500 border-red-500/20'
                }`}>
                  {tx.isError === '0' ? 'Confirmed' : 'Failed'}
                </span>
              </td>
              <td className="py-5 px-6 text-[10px] font-black text-white/60 text-right uppercase italic tracking-tighter">
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