"use client";
import React from 'react';
// 1. Removed unused Solana/Privy imports that were causing the "Unused" or "Module" errors
import { useConnect } from '@stacks/connect-react'; 
import { stringAsciiCV } from '@stacks/transactions';

export default function ProposalForm() {
  // 2. We only need Stacks Connect for the actual blockchain interaction
  const { doContractCall } = useConnect(); 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const description = (formData.get('description') as string) || "";

    if (!description) {
        alert("Please enter a description");
        return;
    }

    // 3. Ensure your .env variables match exactly what's in your Vercel/Local settings
    await doContractCall({
      contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: process.env.NEXT_PUBLIC_CONTRACT_NAME || 'bigview-treasury',
      functionName: 'create-proposal',
      functionArgs: [stringAsciiCV(description)],
      onFinish: (data) => {
        console.log("Proposal Created!", data);
        alert("Proposal submitted to the Stacks Testnet!");
      },
      onCancel: () => {
        console.log("User denied the proposal");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 border rounded-3xl bg-white shadow-sm flex flex-col gap-4">
      <h3 className="font-bold text-lg text-slate-800">Create New Proposal</h3>
      <input 
        name="description" 
        placeholder="e.g., Fund the Community Marketing Pool" 
        className="border border-slate-200 p-4 w-full rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all" 
      />
      <button 
        type="submit" 
        className="btn-grain-outline py-2 px-6"
      >
        Submit Proposal
      </button>
    </form>
  );
}