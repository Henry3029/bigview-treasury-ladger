"use client";
import React, { useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { openContractCall } from '@stacks/connect';
import { Loader2, ArrowRight } from 'lucide-react'; // Added Loader2 for the spinner
import { ExternalLink, CheckCircle } from 'lucide-react';
import { 
  uintCV, 
  boolCV, 
  PostConditionMode 
} from '@stacks/transactions';
import { STACKS_TESTNET } from '@stacks/network';

export default function DashboardButtons() {
  const { authenticated } = usePrivy();
  const { wallets } = useWallets();
  
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<'success' | 'error' | 'info' | null>(null);
  const [isLoading, setIsLoading] = useState(false); // New Loading State
  
  const getExplorerUrl = (txId: string) => {
  return `https://explorer.hiro.so/txid/${txId}?chain=testnet`;
};
const [lastTxId, setLastTxId] = useState<string | null>(null);
  

  const notify = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage(text);
    setStatus(type);
    setTimeout(() => {
      setMessage(null);
      setStatus(null);
    }, 4000);
  };

  const handleContractCall = async (functionName: string, args: any[]) => {
    if (!authenticated) return notify("Please login first!", "info");

    const embeddedWallet = wallets.find((w) => w.walletClientType === 'privy');
    if (!embeddedWallet) return notify("No embedded wallet found.", "error");

    setIsLoading(true); // START SPINNER

    const network = STACKS_TESTNET; 
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
    const contractName = process.env.NEXT_PUBLIC_CONTRACT_NAME!;

    const options = {
      contractAddress,
      contractName,
      functionName,
      functionArgs: args,
      network,
      postConditionMode: PostConditionMode.Allow,
      onFinish: (data: any) => {
  setIsLoading(false);
  // Pass the ID so we can build the link in the UI
  notify(`Sent! View on Explorer`, "success");
  // Save the txId in a temporary state if you want the link to work
  setLastTxId(data.txId); 
},
      onCancel: () => {
        setIsLoading(false); // STOP SPINNER
        notify("Transaction cancelled", "error");
      }
    };

    try {
        await openContractCall(options);
    } catch (e) {
        setIsLoading(false);
        notify("Request failed", "error");
    }
  };

  return (
    <div className="flex flex-col gap-8 p-4">
      
      {/* 1. Global Message Area */}
// Inside your return block, replace the old message area with this:
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

    {/* Show the link ONLY if it's a success and we have a TxId */}
    {status === 'success' && lastTxId && (
      <a 
        href={getExplorerUrl(lastTxId)} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-xs font-bold underline decoration-2 underline-offset-4 hover:text-green-600 transition"
      >
        Track <ExternalLink size={14} />
      </a>
    )}
  </div>
)}

      {/* 2. GOVERNANCE SECTION */}
      <section>
        <h3 className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-3 ml-1">Governance - Proposal #1</h3>
        <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
          <button 
            disabled={isLoading}
            onClick={() => handleContractCall('vote', [uintCV(1), boolCV(true)])}
            className="flex flex-col items-center justify-center bg-green-50 text-green-700 p-4 rounded-2xl border border-green-100 hover:bg-green-100 transition disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <span className="font-bold">Vote Yes</span>}
          </button>
          
          <button 
            disabled={isLoading}
            onClick={() => handleContractCall('vote', [uintCV(1), boolCV(false)])}
            className="flex flex-col items-center justify-center bg-red-50 text-red-700 p-4 rounded-2xl border border-red-100 hover:bg-red-100 transition disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <span className="font-bold">Vote No</span>}
          </button>
        </div>
      </section>

      {/* 3. MEMBERSHIP SECTION */}
      <section>
        <h3 className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-3 ml-1">Membership & Setup</h3>
        <div className="flex flex-col gap-3">
          <button 
            disabled={isLoading}
            onClick={() => handleContractCall('add-member', [])}
            className="w-full flex items-center justify-between bg-purple-600 text-white p-4 rounded-2xl shadow-md active:scale-95 transition disabled:bg-purple-400"
          >
            <span className="font-bold">
               {isLoading ? "Processing..." : "Become a Member"}
            </span>
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <ArrowRight size={18} />}
          </button>
        </div>
      </section>
    </div>
  );
}