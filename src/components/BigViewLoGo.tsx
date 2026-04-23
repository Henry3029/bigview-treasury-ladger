"use client";

import React from 'react';

export default function BigViewLoGo() {
  return (
    <>
   {/*div class name the grey horizontal section band*/}
   <div className="bg-white/60 mx-3 flex justify-center items-center border-y border-grey-200 py-2 my-4">
   
   {/*inner div the white card logo sits on*/}
   <div className="bg-violet-main-background p-6  flex flex-col items-center justify-center">
   
   {/*logo wrapper*/}
   <div className="flex font-black relative items-baseline italic tracking-tighter">
   
   {/* "big" - blue color*/}
          <span className="text-4xl text-blue">BIG</span>
          
          {/* V large later*/}
          <span className="text-6xl text-gold-buttons leading-none z-10 -mx-1">VI</span>
          
          {/*the ew*/}
          <span className="text-4xl text-blue">EW</span>
          
          {/*tge red underline swoosh*/}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[90%] h-1.5 bg-[#D32F2F]"
          style={{ borderRadius: '50% 50% 0 0 / 100% 100% 0 0' }}
          >
          </div>

      </div>
    </div>
    </>
  );
};