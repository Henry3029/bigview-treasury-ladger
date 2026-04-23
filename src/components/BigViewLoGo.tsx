"use client";

import React from 'react';

export default function BigViewLoGo() {
  return (
    <>
      {/* 1. OUTER DIV: Gold Background */}
      <div className="max-w-lg bg-white/40 py-2 rounded-bigview shadow-2xl relative overflow-hidden group">
        
        {/* 2. INNER DIV: Centered within the Gold, Charcoal Background */}
        <div className="bg-violet-main-background/80 flex flex-col items-center justify-center w-32 h-16 p-4 border-t border-b border-black/10 shadow-inner scale-100 group-hover:scale-[1.01] transition-all relative z-10">
          
          {/* Logo Container */}
          <div className="text-white font-black text-6xl">BI<span className="text-gold-buttons">G</span>VI<span className="text-gold-buttons">EW</span>
          </div>
          
      </div>
    </div>
    </>
  );
}