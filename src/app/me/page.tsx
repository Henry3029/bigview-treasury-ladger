'use client';
import { useState, useEffect } from 'react';
// 1. Change the imports to use the stable AppConfig and UserSession
import { AppConfig, UserSession } from "@stacks/auth"; 
import { User, ExternalLink, LogOut, Wallet, Plus, Shield } from 'lucide-react';

// 2. Define the session outside the component or in a useMemo so it's stable
const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export default function ProfilePage() {
  const [balance, setBalance] = useState<string>("Loading...");
  const [userPhoto] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

// 1. Wait for the browser to be ready
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // 2. If not ready, show a simple loading state (prevents the crash)
  if (!mounted) return <div className="p-10 text-center">Loading dashboard...</div>;
  // 3. Safety Check: If not signed in, show the "Please Connect" screen
  if (!userSession.isUserSignedIn()) {
    return (
      <div className="p-10 text-center flex flex-col items-center gap-4">
        <Shield size={48} className="text-gray-300" />
        <p className="text-gray-500">Please connect your wallet to view your profile.</p>
      </div>
    );
  }

  // 4. Load User Data using the stable class method
  const userData = userSession.loadUserData();
  const address = userData?.profile?.stxAddress?.testnet;
  const truncatedAddress = address 
    ? `${address.slice(0, 6)}...${address.slice(-4)}` 
    : "Not Connected";

  const handleSignOut = () => {
    userSession.signUserOut();
    window.location.href = "/"; // Redirect to home after logout
  };

  // 5. Fetch Balance
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

  return (
    <main className="min-h-screen bg-gray-50 p-4 pb-24 flex flex-col gap-6">
      {/* Identity Header */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 border-2 border-white shadow-sm overflow-hidden">
            {userPhoto ? (
              <img src={userPhoto} alt="User" className="w-full h-full object-cover" />
            ) : (
              <User size={32} />
            )}
          </div>
          <div className="absolute bottom-0 right-0 bg-green-600 p-1 rounded-full border-2 border-white text-white">
            <Plus size={12} />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold">My Account</h2>
          <p className="text-sm text-gray-500 font-mono tracking-tight">{truncatedAddress}</p>
        </div>
      </div>

      {/* Wallet Balance */}
      <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-lg">
        <div className="flex items-center gap-2 mb-2 opacity-80">
          <Wallet size={16} />
          <span className="text-xs uppercase tracking-wider">Available Balance</span>
        </div>
        <h3 className="text-3xl font-bold">{balance}</h3>
      </div>

      {/* Settings & Activity */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <a 
          href={`https://explorer.hiro.so/address/${address}?chain=testnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 flex items-center justify-between border-b border-gray-50 hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <ExternalLink className="text-blue-500" size={20} />
            <span className="font-medium">View Testnet Explorer</span>
          </div>
        </a>

        <button 
          onClick={handleSignOut}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 text-red-500"
        >
          <div className="flex items-center gap-3">
            <LogOut size={20} />
            <span className="font-medium">Disconnect Wallet</span>
          </div>
        </button>
      </div>
    </main>
  );
}