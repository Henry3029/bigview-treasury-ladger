'use client';

import React, { useState, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { createPublicClient, createWalletClient, custom, parseEther, formatEther, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { Wallet, Loader2, Info, ShieldCheck } from 'lucide-react';
import treasuryAbi from '@/constants/abis/BigViewTreasuryV2.json';

export default function StakeCard() {
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState('0.00');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { login, authenticated, ready, user } = usePrivy();
  const { wallets } = useWallets();
  const embeddedWallet = wallets.find((w) => w.address === user?.wallet?.address);

  const treasuryAddress = process.env.NEXT_PUBLIC_TREASURY_ADDRESS as `0x${string}`;

  // 1. Fetch Balance using Viem Public Client
  const fetchBalance = async () => {
    if (!user?.wallet?.address) return;
    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http()
    });
    const bal = await publicClient.getBalance({ address: user.wallet.address as `0x${string}` });
    setBalance(parseFloat(formatEther(bal)).toFixed(2));
  };

  useEffect(() => {
    if (ready && authenticated) fetchBalance();
  }, [ready, authenticated]);

  const handleStake = async () => {
    if (!ready) return;
    if (!authenticated) return login();
    if (!embeddedWallet) return alert("Wallet not found");

    setLoading(true);
    try {
      // 2. Switch to Base Sepolia if needed
      await embeddedWallet.switchChain(baseSepolia.id);
      
      // 3. Initialize Wallet Client through Privy
      const provider = await embeddedWallet.getEthereumProvider();
      const walletClient = createWalletClient({
        account: user?.wallet?.address as `0x${string}`,
        chain: baseSepolia,
        transport: custom(provider)
      });

      // 4. Send Transaction
      const hash = await walletClient.writeContract({
        address: treasuryAddress,
        abi: treasuryAbi,
        functionName: 'stakeAndDelegate',
        args: [],
        value: parseEther(amount),
      });

      setTxHash(hash);
      setAmount('');
      await fetchBalance(); // Refresh balance
    } catch (err) {
      console.error("Staking failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
  <>
  {/* 1. Main Container: Using Bigview Violet and rounded-bigview */}
  <div className="mx-2 max-w-md bg-charcaol p-6 shadow-2xl border-t-2 border-b-2 border-gold-buttons/60 relative overflow-hidden font-inter">
    
    {/* Brand Background Glow: Using Violet-Glow for depth */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 blur-[60px] -mr-16 -mt-16 rounded-full" />
    
    <div className="mb-8 text-center relative z-10">
     
      <h2 className="text-2xl font-bold text-white mb-1 tracking-tighter">Stake</h2>
      <p className="text-[10px] text-light-green/40 font-bold tracking-tight">
        Earning <span className="text-gold-buttons">BVW</span> Rewards
      </p>
    </div>

    <div className="space-y-6 relative z-10">
      <div className="space-y-3">
        <div className="flex justify-between items-end px-1">
          <label className="text-[10px] font-black text-color-white/50">Amount</label>
          <span className="text-[10px] font-black text-vibrant-green bg-muted-yellow/40 px-2.5 py-1 rounded-bigview  border border-gold-buttons/30">
            Bal: {balance} ETH
          </span>
        </div>
        
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full p-6 bg-black/40 border-2 border-white/5 rounded-bigview focus:border-gold-buttons/40 outline-none transition-all font-black text-2xl text-white placeholder:text-white/30"
          />
        </div>
      </div>

      {/* Primary Action Button: Bigview Gold with Black text */}
      <button 
        onClick={handleStake}
        disabled={loading || !ready || !amount}
        className="w-full py-4 bg-gold-buttons text-text-color rounded-bigview font-black text-lg shadow-xl shadow-gold-buttons/10 transition-all active:scale-95 flex items-center justify-center gap-3 tracking-tight hover:opacity-90 disabled:opacity-50 disabled:bg-white/5 disabled:text-white/20"
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : <Wallet size={20} />}
        <span>{loading ? 'Confirming...' : 'Start Earning'}</span>
      </button>

      {txHash && (
        <p className="text-[9px] text-emerald-500 font-black text-center animate-pulse">
          Success! View on Explorer
        </p>
      )}

      {/* Footer Info: Using brand-aligned opacity for text */}
      <div className="pt-6 border-t border-white/5 flex items-start gap-3 text-color-white/20">
        <Info size={14} className="mt-0.5 text-light-blue" />
        <p className="text-[10px] font-bold leading-relaxed tracking-tight">
          Automated Staking Powered By BigView Ledger
        </p>
      </div>
    </div>
  </div>
  </>
);
}