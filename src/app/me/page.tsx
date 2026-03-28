'use client';

import React, { useEffect, useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useBalance } from 'wagmi';
import { User, ExternalLink, LogOut, Wallet, Shield, Copy, Check } from 'lucide-react';

export default function ProfilePage() {
  const { login, logout, authenticated, ready, user } = usePrivy();
  const { wallets } = useWallets();
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Get the primary wallet address from Privy
  const address = wallets[0]?.address as `0x${string}`;

  // Fetch ETH Balance on Base Sepolia
  const { data: balanceData } = useBalance({
    address: address,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!mounted || !ready) return null;

  // Unauthenticated State
  if (!authenticated) {
    return (
      <div className="min-h-[70vh] p-10 text-center flex flex-col items-center justify-center gap-8 bg-slate-50">
        <div className="p-8 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 relative">
          <Shield size={56} className="text-blue-500 mx-auto" />
          <div className="absolute -top-2 -right-2 bg-blue-100 p-2 rounded-full animate-pulse">
            <Shield size={16} className="text-blue-600" />
          </div>
        </div>
        <div className="max-w-xs">
          <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tighter italic">Secure Profile</h2>
          <p className="text-slate-500 font-medium leading-relaxed">
            Please sign in with <span className="text-blue-600 font-bold">Privy</span> to manage your Base Sepolia treasury assets.
          </p>
        </div>
        <button 
          onClick={login}
          className="bg-blue-600 text-white px-12 py-5 rounded-[1.5rem] font-black text-lg hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 active:scale-95"
        >
          Connect & Sign In
        </button>
      </div>
    );
  }

  const truncatedAddress = address 
    ? `${address.slice(0, 6)}...${address.slice(-4)}` 
    : "No Address Found";

  return (
    <main className="min-h-screen bg-slate-50 p-6 pb-24 flex flex-col gap-8 max-w-2xl mx-auto">
      
      {/* Identity Header */}
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-blue-200 rotate-3">
              <User size={40} />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-slate-50 animate-pulse" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic">Treasury Profile</h2>
            <button 
              onClick={handleCopy}
              className="flex items-center gap-2 mt-1 text-[11px] text-blue-600 font-black bg-blue-50 px-3 py-1.5 rounded-xl uppercase tracking-widest hover:bg-blue-100 transition-colors"
            >
              {truncatedAddress}
              {copied ? <Check size={12} /> : <Copy size={12} />}
            </button>
          </div>
        </div>
      </div>

      {/* Wallet Balance Card */}
      <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute -right-10 -top-10 w-56 h-56 bg-blue-500/10 rounded-full blur-[80px] group-hover:bg-blue-500/20 transition-all duration-700" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6 opacity-60">
            <Wallet size={18} className="text-blue-400" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-blue-200">Available Base ETH</span>
          </div>
          <div className="flex items-baseline gap-3">
            <h3 className="text-5xl font-black tracking-tighter">
              {balanceData ? parseFloat(balanceData.formatted).toFixed(4) : "0.0000"}
            </h3>
            <span className="text-blue-400 font-black text-xl italic uppercase tracking-tighter">ETH</span>
          </div>
          
          <div className="mt-8 flex gap-4">
            <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[9px] font-black text-blue-300 uppercase tracking-widest">Network</p>
              <p className="text-xs font-bold text-white">Base Sepolia</p>
            </div>
            <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[9px] font-black text-blue-300 uppercase tracking-widest">Provider</p>
              <p className="text-xs font-bold text-white">{user?.linkedAccounts[0]?.type || 'Wallet'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions List */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white overflow-hidden flex flex-col p-2">
        <a 
          href={`https://sepolia.basescan.org/address/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-6 flex items-center justify-between border-b border-slate-50 hover:bg-blue-50/50 rounded-t-[2rem] transition-all group"
        >
          <div className="flex items-center gap-5">
            <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 shadow-sm">
              <ExternalLink size={24} />
            </div>
            <div>
              <span className="font-black text-slate-800 block">Basescan Explorer</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">View On-Chain Activity</span>
            </div>
          </div>
          <span className="text-slate-300 group-hover:translate-x-2 transition-transform duration-300">→</span>
        </a>

        <button 
          onClick={() => logout()}
          className="p-6 flex items-center justify-between hover:bg-red-50 text-red-500 rounded-b-[2rem] transition-all group"
        >
          <div className="flex items-center gap-5">
            <div className="p-4 bg-red-50 rounded-2xl shadow-sm">
              <LogOut size={24} />
            </div>
            <div>
              <span className="font-black block">Disconnect Wallet</span>
              <span className="text-[10px] font-bold text-red-300 uppercase tracking-widest">End Session Safely</span>
            </div>
          </div>
        </button>
      </div>
    </main>
  );
}