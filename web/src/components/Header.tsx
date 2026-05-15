'use client';

import React, { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Menu, MoreHorizontal, Sun, Moon } from 'lucide-react'; 
import Sidebar from './Sidebar'; 


export default function Header() {
  // FIX 1: Use boolean false, not string "false"
  const [leftMenuOpen, setLeftMenuOpen] = useState(false);
  const [rightMenuOpen, setRightMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // Consistent naming
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  }
  
  const openSidebar = () => setLeftMenuOpen(true);
  const closeSidebar = () => setLeftMenuOpen(false);

  return (
    <>
      <header className="flex justify-between items-center p-4 bg-white dark:bg-[#13141e] relative z-[50]">
        
        {/* LEFT SIDE: Logo & Hamburger */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 dark:bg-white rounded-xl flex items-center justify-center">
            <img src="/images/bigview-image.png" alt="Logo" className="w-7 h-7 object-contain" />
          </div>
          <button 
            onClick={openSidebar}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* RIGHT SIDE: Options & Connect */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setRightMenuOpen(true)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg"
          >
            <MoreHorizontal className="text-gray-600 dark:text-gray-300" />
          </button>
          
          {/* Note: Fix your gradient naming in tailwind.config.js if "from-bigview-gold" isn't custom defined */}
          <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:opacity-90 text-black px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95">
            Connect
          </button>
        </div>

        {/* Sidebar Component: Matches the variable name exactly */}
        <Sidebar isOpen={leftMenuOpen} onClose={closeSidebar} />
      </header>

      {/* Backdrop for Right Menu (Sidebar has its own backdrop) */}
      {rightMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity"
          onClick={() => setRightMenuOpen(false)}
        />
      )}
      
      {/* RIGHT DROP-UP (Settings) */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-[#13141e] rounded-t-[32px] p-8 z-[101] transition-transform duration-500 ease-in-out ${rightMenuOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-8" />
        
        <button 
          onClick={toggleTheme}
          className="w-full flex items-center justify-between p-4 bg-gray-100 dark:bg-white/5 rounded-2xl transition-all active:scale-95"
        >
          <span className="font-bold dark:text-white">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
          {isDarkMode ? <Moon className="text-blue-400" /> : <Sun className="text-yellow-500" />}
        </button>
        
        <button 
          onClick={() => setRightMenuOpen(false)}
          className="mt-6 w-full py-4 text-gray-500 font-bold"
        >
          Close
        </button>
      </div>
    </>
  );
}