import React from 'react';
import WalletButton from '@/components/WalletButton'; // So they can connect if they haven't

export default function StakePage() {
  return (
    <main className="min-h-screen p-8 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Stack your STX</h1>
        <p className="text-slate-600 mb-8">Lock your STX to support the network and earn rewards.</p>

        {/* --- STAKING CARD --- */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Stake STX</h2>
            <WalletButton /> {/* Quick way to connect */}
          </div>

          <div className="space-y-4">
            {/* Input Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Amount to Stake
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                  STX
                </span>
              </div>
            </div>

            {/* Action Button */}
            <button className="w-full bg-orange-600 text-white py-4 rounded-xl font-semibold hover:bg-orange-700 transition">
              Stake Now
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}