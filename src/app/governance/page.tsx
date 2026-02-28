// src/app/governance/page.tsx
import React from 'react';
import ProposalForm from '@/components/ProposalForm';
import ProposalList from '@/components/ProposalList';

export default function GovernancePage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Governance Hub</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <ProposalList />
          </div>
          <div className="md:col-span-1">
            <ProposalForm />
          </div>
        </div>
      </div>
    </main>
  );
}