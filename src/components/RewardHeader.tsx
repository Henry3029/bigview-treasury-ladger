"use client";

import React from 'react';
import { DashboardButtons } from './DashboardButtons'; // Using your updated buttons

export const RewardHeader = ({ totalEarned, pending }: { totalEarned: string, pending: string }) => {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-xl mb-6 border border-white/10">
      <div className="flex flex-col items-center">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Lifetime BVW Earned</p>
        {/* Changed STX to BVW to match your Solidity rewardToken */}
        <h1 className="text-5xl font-black text-center my-3 italic tracking-tighter">
          {totalEarned} <span className="text-xl not-italic opacity-50">BVW</span>
        </h1>
      </div>
      
      {/* Pending Section */}
      <div className="mt-8 bg-white/10 backdrop-blur-md rounded-[2rem] p-6 flex justify-between items-center border border-white/5">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">Available to Claim</p>
          <div className="flex items-baseline gap-1">
            <p className="text-2xl font-bold">{pending}</p>
            <p className="text-xs font-bold text-orange-400">BVW</p>
          </div>
        </div>
        
        <div className="w-1/2">
           {/* Instead of a separate ClaimButton, 
             this can trigger the claim logic from DashboardButtons 
           */}
           <button 
             onClick={() => {/* Trigger handleClaim from DashboardButtons */}}
             className="w-full py-3 bg-white text-blue-600 rounded-2xl font-black text-sm shadow-lg hover:bg-gray-100 transition-transform active:scale-95"
           >
             Claim Now
           </button>
        </div>
      </div>
    </div>
  );
};