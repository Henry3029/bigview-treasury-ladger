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
  
  // Fetch user balance for the "Max" button
  const { data: balanceData } = useBalance({ address });

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

    const treasuryAddress = process.env.NEXT_PUBLIC_TREASURY_ADDRESS;

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
    }
    if (error) {
      const errorMsg = error.message?.includes("insufficient funds") 
        ? "Insufficient ETH for gas" 
        : "Transaction rejected";
      notify(errorMsg, "error");
    }
  }, [isConfirmed, error]);

  if (!mounted) return null;

  const isLoading = isPending || isConfirming;

  return (
    <main className="min-h-screen p-6 pb-32 bg-slate-50 flex flex-col items-center">
    <WisdomCarousel />
      
      {/* Dynamic Notification Toast */}
      {message && (
        <div className={`fixed top-6 z-50 w-[90%] max-w-md p-4 rounded-3xl border shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${
          status === 'success' ? 'bg-white border-green-100 text-green-600' : 
          status === 'error' ? 'bg-white border-red-100 text-red-600' : 
          'bg-white border-blue-100 text-blue-600'
        }`}>
          {status === 'success' ? <CheckCircle2 size={20} /> : status === 'error' ? <AlertCircle size={20} /> : <Info size={20} />}
          <span className="text-sm font-black italic tracking-tight">{message}</span>
        </div>
      )}

      <div className="w-full max-w-md mt-12 bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-white">
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-blue-100 rotate-3">
            <Zap size={32} fill="currentColor" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2 italic tracking-tighter uppercase">Stake ETH</h2>
          <p className="text-xs text-slate-400 font-bold tracking-widest leading-relaxed">
            LOCK ASSETS ON <span className="text-blue-600">BASE SEPOLIA</span> TO EARN BVW REWARDS
          </p>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <div className="flex justify-between items-end px-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Deposit Amount</label>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                Balance: {balanceData ? parseFloat(balanceData.formatted).toFixed(4) : '0.00'} ETH
              </span>
            </div>
            
            <div className="relative group">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full p-7 bg-slate-50 border-2 border-slate-50 rounded-[2rem] focus:border-blue-500 focus:bg-white outline-none transition-all font-black text-3xl placeholder:text-slate-200"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-end">
                <span className="font-black text-slate-300 text-xs tracking-widest uppercase mb-1">Ether</span>
                <button 
                  onClick={() => balanceData && setAmount(formatEther(balanceData.value))}
                  className="text-[10px] font-black text-blue-500 hover:text-blue-700 uppercase tracking-widest transition-colors"
                >
                  Max
                </button>
              </div>
            </div>
          </div>

          <button 
            onClick={handleStake}
            disabled={isLoading || !ready}
            className={`w-full py-6 bg-blue-600 text-white rounded-[1.5rem] font-black text-xl shadow-2xl shadow-blue-100 transition-all active:scale-95 flex items-center justify-center gap-3 ${
              isLoading ? 'opacity-80 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                <span>Confirming...</span>
              </>
            ) : (
              <>
                <Wallet size={24} />
                <span>Stake Assets</span>
              </>
            )}
          </button>

          <div className="pt-4 border-t border-slate-50 flex items-center gap-4 text-slate-400">
            <div className="p-3 bg-slate-50 rounded-2xl">
              <Info size={18} />
            </div>
            <p className="text-[10px] font-medium leading-relaxed uppercase tracking-wider">
              Rewards accrue every block. Unstaking may be subject to a cooldown period.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}