"use client";

import React, { useEffect, useState } from 'react';
import { fetchCallReadOnlyFunction, cvToJSON, uintCV } from '@stacks/transactions';
import { STACKS_TESTNET } from '@stacks/network';

const NETWORK = process.env.NEXT_PUBLIC_NETWORK || '';
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
const CONTRACT_NAME = process.env.NEXT_PUBLIC_CONTRACT_NAME || '';

interface Proposal {
  id: number;
  description: string;
  votesFor: number;
  votesAgainst: number;
}

export default function ProposalList() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Get the total count from your dashboard-summary
        const summaryRes = await fetchCallReadOnlyFunction({
          network: NETWORK,
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACT_NAME,
          functionName: 'dashboard-summary',
          functionArgs: [],
          senderAddress: CONTRACT_ADDRESS,
        });
        
        const summaryData = cvToJSON(summaryRes).value;
        const count = Number(summaryData['proposals-count'].value);

        // 2. Fetch each proposal by ID (Clarity Map Pattern)
        // We loop from 1 up to the current count
        const proposalPromises = [];
        for (let i = 1; i <= count; i++) {
          proposalPromises.push(
            fetchCallReadOnlyFunction({
              network: NETWORK,
              contractAddress: CONTRACT_ADDRESS,
              contractName: CONTRACT_NAME,
              functionName: 'get-proposal-by-id', // Make sure this matches your contract!
              functionArgs: [uintCV(i)],
              senderAddress: CONTRACT_ADDRESS,
            })
          );
        }

        const results = await Promise.all(proposalPromises);
        const formatted = results.map((res, index) => {
          const p = cvToJSON(res).value?.value; 
          return {
            id: index + 1,
            description: p.description?.value || "Untitled Proposal",
            votesFor: Number(p['votes-for']?.value || 0),
            votesAgainst: Number(p['votes-against']?.value || 0),
          };
        });

        setProposals(formatted.reverse()); // Show newest first
      } catch (error) {
        console.error("Error loading proposals:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="text-slate-500 animate-pulse">Loading Governance...</div>;

  return (
    <div className="grid gap-4">
      {proposals.map((p) => (
        <div key={p.id} className="p-5 bg-white border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">Proposal #{p.id}</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{p.description}</h3>
            </div>
          </div>
          <div className="mt-4 flex gap-6 text-sm font-medium">
            <span className="text-green-600">👍 {p.votesFor} For</span>
            <span className="text-red-600">👎 {p.votesAgainst} Against</span>
          </div>
        </div>
      ))}
    </div>
  );
}