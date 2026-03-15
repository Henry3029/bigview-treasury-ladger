"use client";
import { useEffect, useState } from 'react';
import { Loader2, Users, PieChart, TrendingUp } from 'lucide-react'; 
import { fetchCallReadOnlyFunction, cvToJSON } from '@stacks/transactions';
import { STACKS_TESTNET } from '@stacks/network';
import { usePrivy } from '@privy-io/react-auth';

// 1. CLEANED INTERFACE: Only keeping what we actually use
interface DashboardDataProps {
  stake: string;
}

export default function DashboardData({ stake }: DashboardDataProps) {
  const [summary, setSummary] = useState<any>(null);
  const { user } = usePrivy();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchSummary() {
      if (!user?.wallet?.address) return;

      setIsLoading(true);
      try {
        const response = await fetchCallReadOnlyFunction({
          network: STACKS_TESTNET,
          contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
          contractName: process.env.NEXT_PUBLIC_CONTRACT_NAME!,
          functionName: 'dashboard-summary',
          functionArgs: [],
          senderAddress: user.wallet.address,
        });
        
        setSummary(cvToJSON(response));
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching summary:", error);
      }
    }

    fetchSummary();
  }, [user]);

  // --- THE SPINNER LOGIC ---
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-gray-100 shadow-sm animate-pulse">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="mt-4 text-xs text-gray-400 font-bold uppercase tracking-widest">Syncing Treasury...</p>
      </div>
    );
  }

  if (!summary) return null;

  // --- 2. THE CLEANED RETURN BLOCK ---
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        
        {/* Total Members Card */}
        <div className="p-5 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-gray-400">
            <Users size={14} />
            <span className="text-[10px] uppercase font-black tracking-widest">Members</span>
          </div>
          <span className="text-2xl font-bold text-slate-900">
            {summary?.value['total-members']?.value || "0"}
          </span>
        </div>
        
        {/* Total Staked Card */}
        <div className="p-5 bg-blue-600 rounded-3xl shadow-lg flex flex-col gap-2 text-white">
          <div className="flex items-center gap-2 opacity-80">
            <TrendingUp size={14} />
            <span className="text-[10px] uppercase font-black tracking-widest text-blue-100">Staked</span>
          </div>
          <span className="text-2xl font-bold">
            {summary?.value['total-stakes']?.value ? `${(parseInt(summary.value['total-stakes'].value) / 1000000).toLocaleString()}` : stake}
            <span className="text-xs ml-1 opacity-70">STX</span>
          </span>
        </div>

      </div>

      {/* Rewards Overview (New addition for better UI) */}
      <div className="p-5 bg-slate-900 rounded-3xl shadow-sm flex items-center justify-between text-white">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Total Rewards Paid</span>
          <span className="text-xl font-bold">
            {summary?.value['total-rewards']?.value || "0"} <span className="text-xs text-orange-400">sBTC</span>
          </span>
        </div>
        <PieChart className="text-slate-700" size={32} />
      </div>
    </div>
  );
}