'use client';
import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth'; 
import { User, ExternalLink, LogOut, Wallet, Plus, Shield, Link as LinkIcon } from 'lucide-react';

export default function ProfilePage() {
  const { user, authenticated, logout, ready, linkWallet } = usePrivy();
  const [balance, setBalance] = useState<string>("0 STX");
  const [mounted, setMounted] = useState(false);

  // 🎯 FIX: Find the Stacks address specifically
  // Privy stores the stacks address in the 'wallet' type where the address starts with 'S'
  const stacksWallet = user?.linkedAccounts.find(
    (acc): acc is any => acc.type === 'wallet' && acc.address?.startsWith('S')
  );
  const address = stacksWallet?.address;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch Balance from Hiro API
  useEffect(() => {
    if (address) {
      fetch(`https://api.testnet.hiro.so/extended/v1/address/${address}/balances`)
        .then(res => res.json())
        .then(data => {
          const rawBalance = data?.stx?.balance || "0";
          const stxBalance = parseInt(rawBalance) / 1000000;
          setBalance(`${stxBalance.toLocaleString()} STX`);
        })
        .catch(() => setBalance("0 STX"));
    }
  }, [address]);

  if (!ready || !mounted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-blue-600 font-bold animate-pulse">Syncing Treasury Data...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-[60vh] p-10 text-center flex flex-col items-center justify-center gap-4">
        <Shield size={48} className="text-gray-300" />
        <p className="text-gray-500 font-medium">Please login to view your Treasury profile.</p>
      </div>
    );
  }

  const truncatedAddress = address 
    ? `${address.slice(0, 6)}...${address.slice(-4)}` 
    : "Generating Stacks Address...";

  return (
    <main className="min-h-screen bg-gray-50 p-4 pb-24 flex flex-col gap-6">
      {/* Identity Header */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 border-2 border-white shadow-sm overflow-hidden">
            <User size={32} />
          </div>
          <div className="absolute bottom-0 right-0 bg-green-500 p-1 rounded-full border-2 border-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">My Account</h2>
          <p className="text-sm text-gray-500 font-mono tracking-tight bg-gray-100 px-2 py-0.5 rounded">
            {truncatedAddress}
          </p>
        </div>
      </div>

      {/* Wallet Balance Card */}
      <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full" />
        <div className="flex items-center gap-2 mb-2 opacity-80">
          <Wallet size={16} />
          <span className="text-xs uppercase tracking-wider font-semibold">Stacks Balance</span>
        </div>
        <h3 className="text-3xl font-bold">{balance}</h3>
      </div>

      {/* Actions List */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        {/* Explorer Link */}
        <a 
          href={`https://explorer.hiro.so/address/${address}?chain=testnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 flex items-center justify-between border-b border-gray-100 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
              <ExternalLink size={18} />
            </div>
            <span className="font-semibold text-gray-700">View on Explorer</span>
          </div>
        </a>
        
        {/* Link Stacks Wallet Button */}
        <button 
          onClick={() => linkWallet()}
          className="p-4 flex items-center justify-between border-b border-gray-100 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg text-orange-500">
              <LinkIcon size={18} />
            </div>
            <span className="font-semibold text-gray-700">Link Stacks Wallet</span>
          </div>
        </button>

        {/* Logout Button */}
        <button 
          onClick={() => logout()}
          className="p-4 flex items-center justify-between hover:bg-red-50 text-red-500 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <LogOut size={18} />
            </div>
            <span className="font-semibold">Logout</span>
          </div>
        </button>
      </div>
    </main>
  );
}