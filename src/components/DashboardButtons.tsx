"use client";

import React, { useState } from 'react';
import { openContractCall, UserSession, AppConfig } from '@stacks/connect';
import { Loader2, Wallet, ArrowRight, ExternalLink, CheckCircle } from 'lucide-react';
import { PostConditionMode } from '@stacks/transactions';
import { STACKS_TESTNET } from '@stacks/network';

// 1. Initialize the Stacks Session (This replaces Privy auth check)
const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export default function DashboardButtons() {
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<'success' | 'error' | 'info' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastTxId, setLastTxId] = useState<string | null>(null);

  const getExplorerUrl = (txId: string) => `https://explorer.hiro.so/txid/${txId}?chain=testnet`;

  const notify = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage(text);
    setStatus(type);
    setTimeout(() => {
      setMessage(null);
      setStatus(null);
    }, 4000);
  };

  const handleContractCall = async (functionName: string, args: any[]) => {
    // 2. Simple Check: Is the Stacks wallet connected?
    if (!userSession.isUserSignedIn()) {
      return notify("Please connect your Stacks wallet first!", "info");
    }

    setIsLoading(true);
    
    try {
      const options = {
        userSession, // Use the native Stacks session
        contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
        contractName: process.env.NEXT_PUBLIC_CONTRACT_NAME!,
        functionName,
        functionArgs: args,
        network: STACKS_TESTNET,
        postConditionMode: PostConditionMode.Allow,
        
        appDetails: {
          name: 'Bigview Treasury',
          icon: window.location.origin + '/images/bigview-image.png',
        },

        onFinish: (data: any) => {
          setIsLoading(false);
          setLastTxId(data.txId);
          notify(`Transaction Sent!`, "success");
        },
        onCancel: () => {
          setIsLoading(false);
          notify("Cancelled", "error");
        }
      };

      await openContractCall(options);
    } catch (e) {
      setIsLoading(false);
      console.error("Contract call error:", e);
      notify("Request failed", "error");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      
      {/* Notifications Area */}
      {message && (
        <div className={`p-4 rounded-2xl flex items-center justify-between border animate-in fade-in slide-in-from-top-2 ${
          status === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 
          status === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 
          'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <div className="flex items-center gap-3">
            {status === 'success' ? <CheckCircle size={18} /> : <div className="w-2 h-2 rounded-full bg-current animate-pulse" />}
            <span className="text-sm font-medium">{message}</span>
          </div>
          {status === 'success' && lastTxId && (
            <a href={getExplorerUrl(lastTxId)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-bold underline">
              Track <ExternalLink size={14} />
            </a>
          )}
        </div>
      )}

      {/* CORE ACTIONS SECTION */}
      <section>
        <h3 className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black mb-4 ml-1">Treasury Actions</h3>
        
        <div className="flex flex-col gap-4">
          <button 
            disabled={isLoading}
            onClick={() => window.location.href = '/stake'} 
            className="btn-grain flex flex-col items-center justify-center disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <Wallet size={20} />
              </div>
              <span className="font-bold text-lg">Stake STX</span>
            </div>
            <ArrowRight size={20} />
          </button>

          <button 
            disabled={isLoading}
            onClick={() => handleContractCall('claim-rewards', [])}
            className="w-full bg-white border border-gray-100 p-5 rounded-3xl flex items-center justify-between hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50"
          >
            <span className="font-bold text-gray-700 uppercase tracking-tight">Claim sBTC Rewards</span>
            {isLoading ? <Loader2 className="animate-spin text-blue-600" size={20} /> : <div className="w-2 h-2 rounded-full bg-blue-600" />}
          </button>
        </div>
      </section>
    </div>
  );
}