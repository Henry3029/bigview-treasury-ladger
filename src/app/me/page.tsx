'use client';
import { useState, useEffect } from 'react';
// 1. USE PRIVY instead of Stacks Auth
import { usePrivy } from '@privy-io/react-auth'; 
import { User, ExternalLink, LogOut, Wallet, Plus, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { user, authenticated, logout, ready } = usePrivy();
  const [balance, setBalance] = useState<string>("Loading...");
  const [mounted, setMounted] = useState(false);

  // Get the Stacks address from Privy's linked accounts
  const stxAccount = user?.linkedAccounts.find(
    (acc) => acc.type === 'wallet' && acc.connectorType === 'stacks'
  );
  const address = stxAccount?.address;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch Balance using the real address from Privy
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

  if (!ready || !mounted) return <div className="p-10 text-center text-gray-400 animate-pulse">Loading profile...</div>;

  if (!authenticated) {
    return (
      <div className="p-10 text-center flex flex-col items-center gap-4">
        <Shield size={48} className="text-gray-300" />
        <p className="text-gray-500 font-medium">Please connect your wallet to view your profile.</p>
      </div>
    );
  }

  const truncatedAddress = address 
    ? `${address.slice(0, 6)}...${address.slice(-4)}` 
    : "No Stacks Address Found";

  return (
    <main className="min-h-screen bg-gray-50 p-4 pb-24 flex flex-col gap-6">
      {/* Identity Header */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 border-2 border-white shadow-sm overflow-hidden">
            {/* Privy gives you the user's email or avatar if available */}
            <User size={32} />
          </div>
          <div className="absolute bottom-0 right-0 bg-blue-600 p-1 rounded-full border-2 border-white text-white">
            <Plus size={12} />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">My Account</h2>
          <p className="text-sm text-gray-500 font-mono tracking-tight">{truncatedAddress}</p>
        </div>
      </div>

      {/* Wallet Balance */}
      <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
        {/* Subtle decorative circle */}
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full" />
        
        <div className="flex items-center gap-2 mb-2 opacity-80">
          <Wallet size={16} />
          <span className="text-xs uppercase tracking-wider font-semibold">Available Balance</span>
        </div>
        <h3 className="text-3xl font-bold">{balance}</h3>
      </div>

      {/* Settings & Activity */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <a 
          href={`https://explorer.hiro.so/address/${address}?chain=testnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 flex items-center justify-between border-b border-gray-50 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <ExternalLink className="text-blue-500" size={18} />
            </div>
            <span className="font-semibold text-gray-700">View Testnet Explorer</span>
          </div>
        </a>

        <button 
          onClick={() => logout()}
          className="w-full p-4 flex items-center justify-between hover:bg-red-50 text-red-500 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <LogOut size={18} />
            </div>
            <span className="font-semibold">Disconnect Wallet</span>
          </div>
        </button>
      </div>
    </main>
  );
}