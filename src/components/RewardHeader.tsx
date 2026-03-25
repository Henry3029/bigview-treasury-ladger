import React from 'react';
import { ClaimButton } from './ClaimButton'; // <-- Make sure this path is correct!

export const RewardHeader = ({ totalEarned, pending }: { totalEarned: string, pending: string }) => {
  return (
    <div className="bg-gradient-to-br from-green-600 to-green-700 p-8 rounded-3xl text-white shadow-lg mb-6">
      <p className="text-sm opacity-80 text-center uppercase tracking-wider">Total Rewards Earned</p>
      <h1 className="text-4xl font-bold text-center my-2">{totalEarned} STX</h1>
      
      {/* This is the box that holds the "Claim" section */}
      <div className="mt-6 bg-white/10 rounded-2xl p-4 flex justify-between items-center">
        <div>
          <p className="text-xs opacity-70">Pending Claim</p>
          <p className="text-lg font-semibold">{pending} STX</p>
        </div>
        
        {/* We removed the old <button> and put our new <ClaimButton /> here */}
        <div className="w-1/3">
          <ClaimButton />
        </div>
      </div>
    </div>
  );
};