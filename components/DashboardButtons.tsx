// src/components/DashboardButtons.tsx
import React from 'react';

// 1. Define an interface for the component props
interface DashboardButtonsProps {
  onStake: () => void;
  onUnstake: () => void;
  onClaim: () => void;
  onProposal: () => void;
  onVote: () => void;
}

// 2. Apply the interface to the component
export default function DashboardButtons({
  onStake,
  onUnstake,
  onClaim,
  onProposal,
  onVote,
}: DashboardButtonsProps) {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <button 
        onClick={onStake}
        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
      >
        Stake STX
      </button>
      <button 
        onClick={onUnstake}
        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
      >
        Unstake
      </button>
      <button 
        onClick={onClaim}
        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
      >
        Claim Rewards
      </button>
      <button 
        onClick={onProposal}
        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        Create Proposal
      </button>
      <button 
        onClick={onVote}
        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        Vote
      </button>
    </div>
  );
}