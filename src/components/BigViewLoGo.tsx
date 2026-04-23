"use client";

import React from 'react';

export default function BigViewLoGo() {
  return (
    <>
   {/*div class name the grey horizontal section band*/}
   <div className="w-full bg-[#f5f5f5] flex justify-center items-center border-y border-grey-200 py-6 my-4">
   
   {/*inner div the white card logo sits on*/}
   <div className="w-[90%] max-w-md bg-white py-10 px-6 rounded-2xl shadow-sm flex flex-col items-center justify-center">
   
   {/*logo wrapper*/}
   <div className="flex font-black relative items-baseline italic tracking-tighter">
   
   {/* "big" - Neutral Grey */}
          <span className="text-4xl text-[#555555]">big</span>
          
          {/* V large later*/}
          <span className="text-6xl text-gold-buttons leading-none z-10 -mx-1">V</span>
          
          {/*tge red underline swoosh*/}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[90%] h-1.5 bg-[#D32F2F]"
          style={{ borderRadius: '50% 50% 0 0 / 100% 100% 0 0' }}
          >
          </div>
          
          {/* Optional "by BIGVIEW" tag like the "by ZENITH" one */}
        <span className="text-[10px] font-bold italic text-[#555555] mt-1 self-center uppercase tracking-widest">
          by Ledger
        </span>

      </div>
    </div>
  </div>
    </>
  );
};