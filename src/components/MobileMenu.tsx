'use client';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  // This is the function the Sidebar will call
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="lg:hidden p-1">
        <Menu size={24} className="text-blue-900" />
      </button>

      <div className={`fixed inset-0 z-[100] transition-transform duration-300 lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
        
        <div className="relative w-72 h-full bg-white shadow-xl flex flex-col pt-16">
          <button onClick={handleClose} className="absolute top-4 right-4 p-2">
            <X size={24} />
          </button>
          
          {/* PASS THE PROPS HERE */}
          <Sidebar isMobile={true} closeMobileMenu={handleClose} />
        </div>
      </div>
    </>
  );
}