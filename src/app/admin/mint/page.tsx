"use client";
import React, { useState, useEffect } from 'react';
import { openContractCall, UserSession, AppConfig } from '@stacks/connect';
import { uintCV, PostConditionMode, fetchCallReadOnlyFunction, cvToJSON } from '@stacks/transactions';
import { STACKS_TESTNET } from '@stacks/network';
import { Coins, Flame, ArrowUpRight, ShieldAlert, Activity } from 'lucide-react';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export default function AdminTokenPage() {
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalSupply, setTotalSupply] = useState("0");
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Total Supply & Check Ownership
  const fetchSupplyAndAuth = async () => {
    const network = STACKS_TESTNET;
    const deployerAddr = process.env.NEXT_PUBLIC_DEPLOYER_ADDR;

    // Ownership Check
    if (userSession.isUserSignedIn()) {
      const userAddr = userSession.loadUserData().profile.stxAddress.testnet;
      setIsOwner(userAddr === deployerAddr);
    }

    try {
      const response = await fetchCallReadOnlyFunction({
        network,
        contractAddress: process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS || '',
        contractName: 'bigview-token',
        functionName: 'get-total-supply',
        functionArgs: [],
        senderAddress: deployerAddr || '',
      });
      const json = cvToJSON(response);
      const supply = Number(json.value.value) / 1000000;
      setTotalSupply(supply.toLocaleString());
    } catch (e) {
      console.error("Failed to fetch supply", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplyAndAuth();
  }, []);

  const handleAction = async (action: 'mint' | 'burn') => {
    if (!userSession.isUserSignedIn()) return alert("Connect Wallet First");
    if (!amount || Number(amount) <= 0) return alert("Enter a valid amount");

    setIsProcessing(true);
    const microUnits = BigInt(Math.floor(Number(amount) * 1000000));

    try {
      await openContractCall({
        network: STACKS_TESTNET,
        contractAddress: process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS || '',
        contractName: 'bigview-token', 
        functionName: action,
        functionArgs: [uintCV(microUnits)],
        postConditionMode: PostConditionMode.Allow,
        onFinish: (data) => {
          alert(`${action.toUpperCase()} Successful! TxID: ${data.txId}`);
          setIsProcessing(false);
          setAmount('');
          fetchSupplyAndAuth(); // Refresh supply after action
        },
        onCancel: () => setIsProcessing(false),
      });
    } catch (e) {
      console.error(e);
      setIsProcessing(false);
    }
  };

  if (loading) return null;

  // 2. Access Denied UI
  if (!isOwner) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-red-100 text-center max-w-sm">
          <ShieldAlert size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-black text-slate-900 italic">Access Restricted</h2>
          <p className="text-sm text-gray-500 mt-2 font-medium">This terminal is only accessible by the Bigview deployer address.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 pb-24 bg-slate-50 flex flex-col items-center gap-6">
      <div className="w-full max-w-md mt-10 text-center">
        <h1 className="text-3xl font-black italic text-slate-900 tracking-tighter">Bigview Admin</h1>
        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-1">Token Supply Controller</p>
      </div>

      {/* 3. Live Supply Tracker Card */}
      <div className="w-full max-w-md bg-slate-900 p-6 rounded-[2rem] text-white shadow-xl flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase font-black text-blue-400 tracking-widest mb-1">Total BVW Supply</p>
          <h3 className="text-2xl font-black">{totalSupply}</h3>
        </div>
        <div className="p-3 bg-white/10 rounded-2xl">
          <Activity size={24} className="text-blue-400" />
        </div>
      </div>

      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100">
        <div className="mb-8">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-[0.2em]">Quantity (BVW)</label>
          <div className="relative mt-2">
            <input 
              type="number" 
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:border-blue-500 outline-none font-black text-2xl transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={() => handleAction('mint')}
            disabled={isProcessing}
            className="group w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-700 shadow-xl transition-all active:scale-95 disabled:opacity-50"
          >
            <Coins size={22} className="group-hover:rotate-12 transition-transform" />
            Mint New Tokens
          </button>

          <div className="flex items-center gap-4 my-2">
            <div className="h-[1px] bg-slate-100 flex-1" />
            <span className="text-[10px] font-bold text-slate-300 uppercase italic">Danger Zone</span>
            <div className="h-[1px] bg-slate-100 flex-1" />
          </div>

          <button 
            onClick={() => handleAction('burn')}
            disabled={isProcessing}
            className="group w-full py-5 bg-white text-red-600 border-2 border-red-50 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-red-50 transition-all active:scale-95 disabled:opacity-50"
          >
            <Flame size={22} className="group-hover:animate-bounce" />
            Burn Supply
          </button>
        </div>
      </div>
    </main>
  );
}