'use client';

import ProtocolStatsHub from '@/components/ProtocolStatsHub';
import BigviewStats from '@/components/BigviewStats';
import CycleStatsTable from '@/components/CycleStatsTable'; 

export default function AnalyticsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10 text-gray-800 dark:text-white">
      
      {/* Header Info Section */}
      <header className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Bigview Ledger Analytics
        </h1>
        <h3 className="text-lg text-gray-500/80 dark:text-gray-400/70 max-w-2xl font-normal leading-relaxed">
          Dive deep into the world of Bigview Ledger. Learn more about TVL, our fast growth since launch, and the Bigview Ledger Signer network.
        </h3>
      </header>

      {/* Main Stats Hub (The 4-row block detailing individual pool asset tracking) */}
      <section className="space-y-4">
        <ProtocolStatsHub />
      </section>

      {/* Deep Dive Grid (The deep forest green metrics panel tracking Base infrastructure) */}
      <section className="pt-2">
        <BigviewStats />
      </section>
      
      <section className="pt-2">
      <CycleStatsTable />
      </section>

    </div>
  );
}