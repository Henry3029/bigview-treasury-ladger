"use client";

import React from 'react';
import { Github, BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';

export default function TeamSection() {
  return (
    <section className="py-16 px-8 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200 text-center relative overflow-hidden">
      {/* Subtle Background Accent */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full" />
      
      <div className="relative z-10">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-blue-600">
            <ShieldCheck size={28} strokeWidth={2.5} />
          </div>
        </div>

        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">
          Decentralized Governance
        </h2>
        
        <p className="text-3xl font-black text-slate-900 mb-4 italic tracking-tight">
          Built by the Community
        </p>
        
        <p className="text-slate-500 max-w-lg mx-auto mb-10 leading-relaxed font-medium">
          Bigview is an open-source treasury protocol on <span className="text-blue-600 font-bold">Base</span>. 
          Strategic decisions and protocol upgrades are made by <span className="text-slate-900 font-bold underline decoration-blue-200 decoration-4 underline-offset-4">BVW holders</span>, 
          ensuring a transparent and decentralized future.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-black text-slate-700 hover:text-blue-600 transition-colors group"
          >
            <Github size={18} className="group-hover:scale-110 transition-transform" />
            VIEW SOURCE
          </a>
          
          <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-200" />
          
          <a 
            href="#" 
            className="flex items-center gap-2 text-sm font-black text-slate-700 hover:text-blue-600 transition-colors group"
          >
            <BookOpen size={18} className="group-hover:scale-110 transition-transform" />
            READ DOCS
          </a>
          
          <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-200" />

          <a 
            href="https://sepolia.basescan.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-black text-slate-700 hover:text-blue-600 transition-colors group"
          >
            <ExternalLink size={18} className="group-hover:scale-110 transition-transform" />
            EXPLORER
          </a>
        </div>
      </div>
    </section>
  );
}