'use client';
import React, { useState, useEffect } from 'react';
// 1. Updated Imports: use authenticate instead of showConnect
import { authenticate, UserSession, AppConfig } from '@stacks/connect';
import { User, ExternalLink, LogOut, Wallet, Shield } from 'lucide-react';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export default function ProfilePage() {
  const [balance, setBalance] = useState<string>("0 STX");
  const [mounted, setMounted] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    }
  }, []);

  const address = userData?.profile?.stxAddress?.testnet;

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

  // Improved Logout Logic
  const handleLogout = () => {
    userSession.signUserOut();
    window.location.replace("/"); // replace is safer for auth redirects
  };

  // 2. FIXED CONNECT LOGIC: Using 'authenticate'
  const handleConnect = () => {
    authenticate({
      appDetails: {
        name: 'Bigview Treasury',
        icon: window.location.origin + '/images/bigview-image.png',
      },
      userSession, // CRITICAL: This was missing or used differently before
      onFinish: () => {
        window.location.reload(); 
      },
      onCancel: () => {
        console.log("Connection cancelled");
      }
    });
  };

  if (!mounted) return null;

  if (!userSession.isUserSignedIn()) {
    return (
      <div className="min-h-[60vh] p-10 text-center flex flex-col items-center justify-center gap-6">
        <div className="p-6 bg-gray-100 rounded-full">
          <Shield size={48} className="text-gray-400" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Secure Access</h2>
          <p className="text-gray-500 font-medium">Connect your Stacks wallet to view your treasury profile.</p>
        </div>
        <button 
          onClick={handleConnect}
          className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-lg active:scale-95"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  const truncatedAddress = address 
    ? `${address.slice(0, 8)}...${address.slice(-6)}` 
    : "No Address Found";

  return (
    <main className="min-h-screen bg-gray-50 p-4 pb-24 flex flex-col gap-6">
      {/* Identity Header */}
      <div className="flex items-center gap-4 p-2">
        <div className="relative">
          <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl rotate-3">
            <User size={32} />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-4 border-gray-50 animate-pulse" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight italic">Treasury Profile</h2>
          <code className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded-lg uppercase">
            {truncatedAddress}
          </code>
        </div>
      </div>

      {/* Wallet Balance Card */}
      <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all" />
        <div className="flex items-center gap-2 mb-4 opacity-60">
          <Wallet size={16} />
          <span className="text-[10px] uppercase tracking-[0.2em] font-black">Available STX</span>
        </div>
        <div className="flex items-baseline gap-2">
          <h3 className="text-4xl font-black tracking-tighter">{balance.split(' ')[0]}</h3>
          <span className="text-blue-400 font-bold">STX</span>
        </div>
      </div>

      {/* Actions List */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <a 
          href={`https://explorer.hiro.so/address/${address}?chain=testnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-5 flex items-center justify-between border-b border-gray-50 hover:bg-blue-50/30 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
              <ExternalLink size={20} />
            </div>
            <span className="font-bold text-slate-700">Blockchain Explorer</span>
          </div>
          <span className="text-gray-300 group-hover:translate-x-1 transition-transform">→</span>
        </a>

        <button 
          onClick={handleLogout}
          className="p-5 flex items-center justify-between hover:bg-red-50 text-red-500 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 rounded-2xl">
              <LogOut size={20} />
            </div>
            <span className="font-bold">Disconnect Wallet</span>
          </div>
        </button>
      </div>
    </main>
  );
}