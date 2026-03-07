"use client";
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react'; // Icon import
import { fetchCallReadOnlyFunction, cvToJSON } from '@stacks/transactions';
import { STACKS_TESTNET } from '@stacks/network';
import { usePrivy } from '@privy-io/react-auth';

interface DashboardDataProps {
  stake: string;
  reward: string;
  proposal: string;
  votesFor: number;
  votesAgainst: number;
}

export default function DashboardData({ stake, reward, proposal, votesFor, votesAgainst }: DashboardDataProps) {
  // your component code...
  const [summary, setSummary] = useState<any>(null);
  const { user } = usePrivy();
  
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<'success' | 'error' | 'info' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Helper function for notifications
  const notify = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage(text);
    setStatus(type);
    setTimeout(() => {
      setMessage(null);
      setStatus(null);
    }, 4000);
  };

  useEffect(() => {
    async function fetchSummary() {
      if (!user?.wallet?.address) return;

      setIsLoading(true);
      const network = STACKS_TESTNET;
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
      const contractName = process.env.NEXT_PUBLIC_CONTRACT_NAME!;

      try {
        const response = await fetchCallReadOnlyFunction({
          network,
          contractAddress,
          contractName,
          functionName: 'dashboard-summary',
          functionArgs: [],
          senderAddress: user.wallet.address,
        });
        
        setSummary(cvToJSON(response));
        setIsLoading(false);
        // notify('Updated', 'success'); // Optional: can be annoying if it pops up every time
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching summary:", error);
        notify('Could not load treasury data', 'error');
      }
    }

    fetchSummary();
  }, [user]);

  // --- THE SPINNER LOGIC ---
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-gray-100 shadow-sm">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="mt-4 text-sm text-gray-500 font-medium">Fetching Treasury Data...</p>
      </div>
    );
  }

  // If no data and not loading
  if (!summary) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Notifications */}
      {message && (
        <div className={`p-4 rounded-2xl border ${status === 'error' ? 'bg-red-50' : 'bg-green-50'}`}>
           {message}
        </div>
      )}

      {/* The Data Card */}
      <div className="grid grid-cols-2 gap-4 p-6 bg-white rounded-3xl shadow-sm border border-gray-50">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total Members</span>
          {/* If summary exists, use it. Otherwise, use a default 0 */}
          <span className="text-2xl font-bold text-slate-900">
            {summary?.value['total-members']?.value || "0"}
          </span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total Staked</span>
          {/* If summary exists, use it. Otherwise, use the 'stake' prop from the parent! */}
          <span className="text-2xl font-bold text-blue-600">
            {summary?.value['total-stakes']?.value ? `${summary.value['total-stakes'].value} STX` : stake}
          </span>
        </div>
      </div>
    </div>
  );
  }