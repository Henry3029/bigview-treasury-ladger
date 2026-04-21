"use client";

import React from 'react';

export default function BigViewLoGo() {
  return (
    <>
      {/* 1. OUTER DIV: Gold Background */}
      <div className="max-w-lg mx-2 bg-light-black py-2 rounded-bigview shadow-2xl relative overflow-hidden group">
        {/* Glowing effect inside the gold */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-white/30 transition-all"></div>
        
        {/* 2. INNER DIV: Centered within the Gold, Charcoal Background */}
        <div className="bg-vibrant-green rounded-none flex flex-col items-center justify-center p-4 border-t border-b border-gold-buttons shadow-inner scale-100 group-hover:scale-[1.01] transition-all relative z-10">
          
          {/* Logo Container */}
          <div className="">
            <img 
              src="/images/bigview-image.png" 
              alt="BigView Protocol Logo" 
              className="w-30 h-auto"
            />
          </div>
          
      </div>
    </div>
    </>
  );
}