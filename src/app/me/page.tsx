'use client';
import React from 'react';
import { User, Shield, ExternalLink, LogOut } from 'lucide-react';

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 pb-24 flex flex-col gap-6">
      {/* 1. Identity Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
          <User size={32} />
        </div>
        <div>
          <h2 className="text-xl font-bold">My Account</h2>
          <p className="text-sm text-gray-500 font-mono">SP2K...7X9W</p>
        </div>
      </div>

      {/* 2. Menu Options */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-gray-50 active:bg-gray-50">
          <div className="flex items-center gap-3">
            <Shield className="text-blue-500" size={20} />
            <span className="font-medium">Security & Privacy</span>
          </div>
          <ExternalLink size={16} className="text-gray-400" />
        </div>
        
        <div className="p-4 flex items-center justify-between active:bg-gray-50 text-red-500">
          <div className="flex items-center gap-3">
            <LogOut size={20} />
            <span className="font-medium">Disconnect Wallet</span>
          </div>
        </div>
      </div>
    </main>
  );
}