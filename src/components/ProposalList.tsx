import React from 'react';

// Example data structure
interface Proposal {
  id: number;
  title: string;
  votesFor: number;
  votesAgainst: number;
}

export default function ProposalList() {
  // Normally you would fetch this data from your contract
  const proposals: Proposal[] = [
    { id: 1, title: "Upgrade Treasury Strategy", votesFor: 1500, votesAgainst: 200 },
    { id: 2, title: "Allocate Funds to Marketing", votesFor: 300, votesAgainst: 800 },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Active Proposals</h2>
      {proposals.map(p => (
        <div key={p.id} className="p-4 bg-white rounded-lg shadow-sm border flex justify-between items-center">
          <div>
            <h3 className="font-semibold">{p.title}</h3>
            <p className="text-sm text-gray-500">For: {p.votesFor} | Against: {p.votesAgainst}</p>
          </div>
          <div className="space-x-2">
            <button className="btn-grain py-2 px-6">Vote For</button>
            <button className="btn-grain py-2 px-6">Vote Against</button>
          </div>
        </div>
      ))}
    </div>
  );
}