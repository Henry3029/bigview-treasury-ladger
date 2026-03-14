"use client";
import React, { useState } from 'react'; // 1. Added useState to imports
import { openContractCall } from '@stacks/connect';
import { stringAsciiCV } from '@stacks/transactions';

export default function ProposalForm() {
  // 2. MOVED HOOKS TO THE TOP LEVEL (Required)
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<'success' | 'error' | 'info' | null>(null);

  const notify = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage(text);
    setStatus(type);
    setTimeout(() => {
      setMessage(null);
      setStatus(null);
    }, 4000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const description = (formData.get('description') as string) || "";

    if (!description) {
      notify("Please enter a description", "info");
      return;
    }

    // 3. Added fallbacks ('') to prevent undefined errors
    await openContractCall({
      contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '',
      contractName: process.env.NEXT_PUBLIC_CONTRACT_NAME || '',
      functionName: 'create-proposal',
      functionArgs: [stringAsciiCV(description)],
      onFinish: (data) => {
        console.log("Proposal Created!", data);
        notify("Proposal submitted to the Stacks Testnet!", "success");
      },
      onCancel: () => {
        notify("User denied the proposal", "error");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 border rounded-3xl bg-white shadow-sm flex flex-col gap-4">
      <h3 className="font-bold text-lg text-slate-800">Create New Proposal</h3>
      
      {/* 4. Dynamic feedback message */}
      {message && (
        <p className={`p-3 rounded-lg text-sm ${
          status === 'success' ? 'bg-green-100 text-green-700' : 
          status === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {message}
        </p>
      )}

      <input 
        name="description" 
        placeholder="e.g., Fund the Community Marketing Pool" 
        className="border border-slate-200 p-4 w-full rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all" 
      />
      <button 
        type="submit" 
        className="bg-orange-600 text-white font-bold py-3 px-6 rounded-2xl hover:bg-orange-700 transition-colors"
      >
        Submit Proposal
      </button>
    </form>
  );
}