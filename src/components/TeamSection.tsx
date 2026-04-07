"use client";

import React from 'react';
import { Github, BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';

export default function TeamSection() {
  return (
  /* 1. MAIN SECTION: Using Bigview Violet and rounded-bigview */
  <section className="py-16 px-8 bg-violet-background rounded-bigview border border-dashed border-white/10 text-center relative overflow-hidden font-inter">
    
    {/* Brand Background Accent: Swapped blue for Violet Glow */}
    <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet-glow/10 blur-3xl rounded-full" />
    
    <div className="relative z-10">
      <div className="flex justify-center mb-6">
        {/* Icon Box: White on Violet for high-end contrast */}
        <div className="p-3 bg-white/5 rounded-bigview shadow-sm border border-white/10 text-gold-buttons">
          <ShieldCheck size={28} strokeWidth={2.5} />
        </div>
      </div>

      <h2 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">
        Decentralized Governance
      </h2>
      
      <p className="text-3xl font-black text-white mb-4 italic tracking-tight uppercase">
        Built by the Community
      </p>
      
      {/* Brand-consistent copy with Gold highlights */}
      <p className="text-white/60 max-w-lg mx-auto mb-10 leading-relaxed font-medium uppercase text-[11px] tracking-wide">
        Bigview is an open-source treasury protocol on <span className="text-gold-buttons font-bold">Base</span>. 
        Strategic decisions and protocol upgrades are made by <span className="text-white font-bold underline decoration-gold-buttons/30 decoration-4 underline-offset-4">BVW holders</span>, 
        ensuring a transparent and decentralized future.
      </p>

      {/* FOOTER LINKS: Swapped Slate/Blue for White/Gold */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[10px] font-black text-white/40 hover:text-gold-buttons transition-colors group tracking-widest"
        >
          <Github size={18} className="group-hover:scale-110 transition-transform" />
          VIEW SOURCE
        </a>
        
        <div className="hidden sm:block w-1 h-1 rounded-full bg-white/10" />
        
        <a 
          href="#" 
          className="flex items-center gap-2 text-[10px] font-black text-white/40 hover:text-gold-buttons transition-colors group tracking-widest"
        >
          <BookOpen size={18} className="group-hover:scale-110 transition-transform" />
          READ DOCS
        </a>
        
        <div className="hidden sm:block w-1 h-1 rounded-full bg-white/10" />

        <a 
          href="https://sepolia.basescan.org" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[10px] font-black text-white/40 hover:text-gold-buttons transition-colors group tracking-widest"
        >
          <ExternalLink size={18} className="group-hover:scale-110 transition-transform" />
          EXPLORER
        </a>
      </div>
    </div>
  </section>
);
}