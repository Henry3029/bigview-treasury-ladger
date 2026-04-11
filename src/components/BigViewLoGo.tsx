"use client";

import React from 'react';

export default function BigViewLoGo() {
  return (
    <>
      {/* 1. OUTER DIV: Gold Background */}
      <div className="w-full max-w-lg mx-auto bg-gold-background py-5 rounded-bigview shadow-2xl relative overflow-hidden group">
        {/* Glowing effect inside the gold */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-white/30 transition-all"></div>
        
        {/* 2. INNER DIV: Centered within the Gold, Charcoal Background */}
        <div className="bg-[#1C1C1C] rounded-bigview flex flex-col items-center justify-center p-6 border-t border-b border-black/10 shadow-inner scale-100 group-hover:scale-[1.01] transition-all relative z-10">
          
          {/* Logo Container */}
          <div className="w-16 h-16 rounded-bigview flex items-center justify-center mb-5 p-3">
            <img 
              src="/images/bigview-image.png" 
              alt="BigView Protocol Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          
          <h3 className="text-xl font-bold text-gold-buttons">
            BigView Treasury Ledger
          </h3>
          <p className="text-[10px] font-bold text-solid-green mt-1">
            BigView: The Gateway to Decentralized Finance
          </p>
          <p className="text-[9px] font-bold text-blue/80 mt-1">
            Seamlessly Connecting Your World to Web3
          </p>
          
      </div>
    </div>
    </>
  );
}