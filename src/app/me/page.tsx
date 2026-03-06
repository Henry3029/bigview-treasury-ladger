'use client';
import { useState, useEffect } from 'react';
// 1. Update this import to include useUserSession
import { useConnect, useUserSession } from "@stacks/connect-react"; 
import { User, Shield, ExternalLink, LogOut, Wallet, Plus } from 'lucide-react';

export default function ProfilePage() {
  // 2. Use useUserSession to get the data and the auth object
  const { userSession } = useUserSession(); 
  
  // 3. Get the data from the session
  const userData = userSession.isUserSignedIn() ? userSession.loadUserData() : null;

  // 4. Create a custom signout function
  const handleSignOut = () => {
    userSession.signUserOut();
    window.location.reload(); // Refresh to clear the state
  };

  const [balance, setBalance] = useState<string>("Loading...");
  // ... rest of your code
  const [userPhoto, setUserPhoto] = useState<string | null>(null);

  // 1. Get the Testnet Address
  const address = userData?.profile?.stxAddress?.testnet;
  const truncatedAddress = address 
    ? `${address.slice(0, 6)}...${address.slice(-4)}` 
    : "Not Connected";

  // 2. Fetch Real Testnet Balance from the Stacks API
  useEffect(() => {
    if (address) {
      fetch(`https://api.testnet.hiro.so/extended/v1/address/${address}/balances`)
        .then(res => res.json())
        .then(data => {
  // Use optional chaining (?.) and a fallback (|| 0) to stay safe
  const rawBalance = data?.stx?.balance || 0;
  const stxBalance = parseInt(rawBalance) / 1000000;
  setBalance(`${stxBalance.toLocaleString()} STX`);
})
        .catch(() => setBalance("0 STX"));
    }
  }, [address]);

  return (
  if (!userData) {
  return <div className="p-10 text-center">Please connect your wallet to view your profile.</div>;
}
    <main className="min-h-screen bg-gray-50 p-4 pb-24 flex flex-col gap-6">
    {/* Identity Header */}
    <div className="relative group cursor-pointer" onClick={() => {/* Trigger Upload Logic */}}>
  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 border-2 border-white shadow-sm overflow-hidden">
    {userPhoto ? (
      <img src={userPhoto} alt="User" className="w-full h-full object-cover" />
    ) : (
      <User size={32} />
    )}
  </div>
  {/* The "Plus" icon to tell the user they CAN add a photo */}
  <div className="absolute bottom-0 right-0 bg-green-600 p-1 rounded-full border-2 border-white text-white">
    <Plus size={12} />
  </div>
</div>
        <div>
          <h2 className="text-xl font-bold">My Account</h2>
          <p className="text-sm text-gray-500 font-mono tracking-tight">{truncatedAddress}</p>
        </div>

      {/* Wallet Balance (Dynamic) */}
      <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-lg">
        <div className="flex items-center gap-2 mb-2 opacity-80">
          <Wallet size={16} />
          <span className="text-xs uppercase tracking-wider">Available Balance</span>
        </div>
        <h3 className="text-3xl font-bold">{balance}</h3>
      </div>

      {/* Settings & Activity */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Testnet Explorer Link */}
        <a 
          href={`https://explorer.hiro.so/address/${address}?chain=testnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 flex items-center justify-between border-b border-gray-50 active:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <ExternalLink className="text-blue-500" size={20} />
            <span className="font-medium">View Testnet Explorer</span>
          </div>
        </a>

        {/* Disconnect */}
        <button 
          <button onClick={handleSignOut}
          className="w-full p-4 flex items-center justify-between active:bg-gray-50 text-red-500"
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