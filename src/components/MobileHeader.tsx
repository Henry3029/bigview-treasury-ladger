"use client";
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Sidebar from './Sidebar'; // We reuse your sidebar logic!

export default function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* THE TOP BAR (Visible only on mobile) */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Bigview" width={30} height={30} />
          <span className="font-black italic text-blue-900">Bigview</span>
        </div>

        {/* THE HAMBURGER BUTTON */}
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <Menu size={28} />
        </button>
      </header>

      {/* THE SLIDE-OUT DRAWER */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Dark Overlay (Click to close) */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* The Actual Menu Content */}
          <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="p-4 flex justify-end">
              <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400">
                <X size={28} />
              </button>
            </div>
            
            {/* Reuse your Sidebar component here! */}
            <div className="h-full overflow-y-auto">
                <Sidebar isMobile={true} closeMobileMenu={() => setIsOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}