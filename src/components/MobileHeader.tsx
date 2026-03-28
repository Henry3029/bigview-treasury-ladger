"use client";
import React, { useState } from 'react';
import { X, LayoutGrid } from 'lucide-react'; // Using LayoutGrid for a more "Dashboard" feel
import Image from 'next/image';
import Sidebar from './Sidebar'; 

export default function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* THE TOP BAR (Mobile Only) */}
      <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-[60]">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-200">
            <Image 
              src="/logo.png" 
              alt="Bigview" 
              width={24} 
              height={24} 
              className="brightness-0 invert" 
            />
          </div>
          <span className="font-black italic text-slate-900 tracking-tighter text-lg">Bigview</span>
        </div>

        {/* CUSTOM STYLED MENU BUTTON */}
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-slate-50 text-slate-900 rounded-2xl border border-slate-200 active:scale-90 transition-all shadow-sm"
        >
          <span className="text-[10px] font-black uppercase tracking-widest pl-1">Menu</span>
          <LayoutGrid size={20} className="text-blue-600" />
        </button>
      </header>

      {/* THE SLIDE-OUT DRAWER */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Animated Overlay */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-white shadow-2xl animate-in slide-in-from-left duration-500 ease-out flex flex-col rounded-r-[2.5rem]">
            {/* Header inside Menu */}
            <div className="p-6 flex justify-between items-center border-b border-slate-50">
              <div className="flex items-center gap-2">
                <span className="font-black italic text-blue-900 text-xl tracking-tighter">Navigation</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-red-500 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Sidebar Injection */}
            <div className="flex-1 overflow-y-auto pt-4">
               <Sidebar isMobile={true} closeMobileMenu={() => setIsOpen(false)} />
            </div>

            {/* Bottom Branding / Info */}
            <div className="p-8 border-t border-slate-50">
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] text-center">
                 Bigview Treasury • Base Sepolia
               </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}