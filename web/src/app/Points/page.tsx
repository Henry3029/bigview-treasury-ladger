'use client';
import { useState, useEffect } from 'react';
import Leaderboard from '/@components/Leaderboard'; 

export default function PointsPage() {
  // Real-time network state (Simulating live synced data from Base/ETH blocks)
  const [totalPoints, setTotalPoints] = useState<number>(90642180530);
  const [totalUsers, setTotalUsers] = useState<number>(45048);

  // Simulate real-time updates synced with new blocks
  useEffect(() => {
    const interval = setInterval(() => {
      // Points tick up slightly as new blocks are mined
      setTotalPoints(prev => prev + Math.floor(Math.random() * 150));
      // Occasional new user signs up
      if (Math.random() > 0.85) {
        setTotalUsers(prev => prev + 1);
      }
    }, 3000); // roughly every Base block time

    return () => clearInterval(interval);
  }, []);

  // Utility to format large numbers cleanly (e.g., 90.6B)
  const formatPoints = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    return num.toLocaleString();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10 text-gray-800 dark:text-white">
      
      {/* Intro Section */}
      <header className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">Bigview Ledger Points</h1>
        <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
          Bigview Ledger Points are designed to quantify and reward your contributions to the ever-growing Bigview Ledger ecosystem.
        </p>
      </header>

      {/* "How to Earn" Steps Container */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-wide border-b border-white/10 pb-2">
          Earn Bigview Ledger points
        </h2>

        {/* Step 1 */}
        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm border border-white/20">
            1
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold">Staking with Bigview Ledger</h3>
            <p className="text-gray-400">
              Users earn 1 point per 1 BVW held per day, and 1 point per 2 native staked ETH per day.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm border border-white/20">
            2
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold">Deploying in DeFi</h3>
            <p className="text-gray-400">
              Users who deploy their BVW in DeFi earn up to 2.5x more points.{' '}
              <a href="#" className="text-[#B8860B] hover:underline font-medium inline-flex items-center gap-1">
                See DeFi opportunities here →
              </a>
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm border border-white/20">
            3
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold">Referrals</h3>
            <p className="text-gray-400">
              When you refer a user, you earn 10% of their points as referral points.
            </p>
          </div>
        </div>
      </div>

      {/* Dim Gold Outer Container */}
      <div className="bg-[#B8860B]/20 border border-[#B8860B]/30 rounded-3xl p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2 text-white">Points overview</h2>
          <p className="text-sm text-gray-300">
            Points are updated in sync with new ETH blocks. Daily points are awarded each day at 02:00:00 GMT+2.
          </p>
        </div>

        {/* Inner Rounded-Top White Card */}
        <div className="bg-white rounded-t-2xl p-6 text-black grid grid-cols-2 gap-6 shadow-inner">
          
          {/* Box 1: Live Points Counter */}
          <div className="border-r border-gray-200 pr-4">
            <p className="text-xs uppercase font-semibold text-gray-400 tracking-wider mb-1">Total Points</p>
            <p className="text-4xl font-extrabold font-mono tracking-tight text-gray-900 transition-all duration-300">
              {formatPoints(totalPoints)}
            </p>
          </div>

          {/* Box 2: Total Users Counter */}
          <div className="pl-4">
            <p className="text-xs uppercase font-semibold text-gray-400 tracking-wider mb-1">Total Users</p>
            <p className="text-4xl font-extrabold font-mono tracking-tight text-gray-900">
              {totalUsers.toLocaleString()}
            </p>
          </div>

        </div>
      </div>
      
      <Leaderboard />

    </div>
  );
}