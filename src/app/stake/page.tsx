'use client';

import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import WisdomCarousel from '@/components/WisdomCarousel';
import { useWriteContract, useWaitForTransactionReceipt, useBalance } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { Wallet, Zap, Loader2, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { abi as treasuryAbi } from '@/constants/abis/BigViewTreasury.json';

export default function StakePage() {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<'success' | 'error' | 'info' | null>(null);
  const [mounted, setMounted] = useState(false);

  const { login, authenticated, ready, user } = usePrivy();
  const address = user?.wallet?.address as `0x${string}`;
  
  // Fetch user balance and allow manual refresh after a successful stake
  const { data: balanceData, refetch: refreshBalance } = useBalance({ address });

  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    setMounted(true);
  }, []);

  const notify = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage(text);
    setStatus(type);
    setTimeout(() => {
      setMessage(null);
      setStatus(null);
    }, 5000);
  };

  const handleStake = async () => {
    if (!ready) return;
    if (!authenticated) {
      notify("Authentication required", "info");
      login();
      return;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return notify("Enter a valid amount", "error");
    }

    // Using your preferred variable name
    const treasuryAddress = process.env.NEXT_PUBLIC_TREASURY_ADDRESS;

    if (!treasuryAddress) {
      return notify("Treasury address missing in .env", "error");
    }

    try {
      writeContract({
        address: treasuryAddress as `0x${string}`,
        abi: treasuryAbi,
        functionName: 'stakeAndDelegate',
        args: [], 
        value: parseEther(amount), 
      });
    } catch (err) {
      notify("Staking failed", "error");
    }
  };

  useEffect(() => {
    if (isConfirmed) {
      notify("Stake confirmed on Base!", "success");
      setAmount('');
      refreshBalance(); // This updates the "Balance: X ETH" display immediately
    }
    if (error) {
      const errorMsg = error.message?.toLowerCase().includes("insufficient") 
        ? "Insufficient ETH for gas" 
        : "Transaction rejected";
      notify(errorMsg, "error");
    }
  }, [isConfirmed, error, refreshBalance]);

  if (!mounted) return null;

  const isLoading = isPending || isConfirming;

  // Helper to leave a tiny bit of ETH for the network fee (Gas)
  const setMaxAmount = () => {
    if (balanceData) {
      const bal = parseFloat(balanceData.formatted);
      const gasBuffer = 0.003; // Safe buffer for Base Sepolia
      const maxStake = bal > gasBuffer ? (bal - gasBuffer).toFixed(5) : "0";
      setAmount(maxStake);
    }
  };

  return (
  // 1. Reduced pt-24 to pt-20 to close the white gap under the header
  <main className="min-h-screen w-full p-4 pt-20 pb-32 bg-slate-50 flex flex-col items-center font-inter">
    
    {/* 2. Wisdom Carousel: Removed mb-6 to bring the card closer to the quotes */}
    <div className="w-full max-w-lg mb-4">
      <WisdomCarousel />
    </div>
    
    {/* Toast Notification */}
    {message && (
      <div className={`fixed top-24 z-50 w-[92%] max-w-md p-4 rounded-2xl border shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${
        status === 'success' ? 'bg-white border-green-100 text-green-600' : 
        status === 'error' ? 'bg-white border-red-100 text-red-600' : 
        'bg-white border-blue-100 text-blue-600'
      }`}>
        {status === 'success' ? <CheckCircle2 size={18} /> : status === 'error' ? <AlertCircle size={18} /> : <Info size={18} />}
        <span className="text-xs font-black italic tracking-tight uppercase">{message}</span>
      </div>
    )}

    {/* 3. THE STAKE CARD: Using rounded-3xl for the modern look */}
    <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100">
      
      <div className="mb-8 text-center">
        {/* Fintech Icon: Added rotate-3 for personality */}
        <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-blue-100 rotate-3 transition-transform hover:rotate-0">
          <Zap size={28} fill="currentColor" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-1 italic tracking-tighter uppercase">Stake ETH</h2>
        <p className="text-[9px] text-slate-400 font-bold tracking-[0.2em] leading-relaxed uppercase">
          Lock Assets on <span className="text-blue-600">Base Sepolia</span>
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-end px-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Deposit Amount</label>
            <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md italic uppercase">
              Bal: {balanceData ? parseFloat(balanceData.formatted).toFixed(4) : '0.00'} ETH
            </span>
          </div>
          
          <div className="relative group">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              // Standardized to rounded-2xl
              className="w-full p-6 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-black text-3xl placeholder:text-slate-200 tabular-nums"
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 flex flex-col items-end">
              <span className="font-black text-slate-300 text-[10px] tracking-widest uppercase">Ether</span>
              <button 
                onClick={setMaxAmount}
                className="text-[10px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-tighter transition-colors"
              >
                MAX
              </button>
            </div>
          </div>
        </div>

        <button 
          onClick={handleStake}
          disabled={isLoading || !ready}
          className={`w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-100 transition-all active:scale-95 flex items-center justify-center gap-3 italic uppercase tracking-tight ${
            isLoading ? 'opacity-80 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Wallet size={20} />
              <span>Stake Assets</span>
            </>
          )}
        </button>

        <div className="pt-6 border-t border-slate-50 flex items-start gap-3 text-slate-400">
          <Info size={14} className="mt-0.5 text-blue-400" />
          <p className="text-[9px] font-bold leading-relaxed uppercase tracking-wider">
            Stake your ETH to earn <span className="text-slate-600 font-black">BVW</span> rewards every block.
          </p>
        </div>
      </div>
    </div>
  </main>
);
}