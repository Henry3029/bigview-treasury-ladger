'use client';

import React, { useState, useEffect } from 'react';
import WisdomCarousel from '@/components/WisdomCarousel';
import StakeCard from '@/components/StakeCard';
import { Sparkles } from 'lucide-react';

export default function StakePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    /* 1. CLEAN SLATE: Background now handled globally by layout.tsx */
    <main className="min-h-screen w-full pt-16 pb-16 flex flex-col items-center relative overflow-hidden font-inter">
      
      {/* BACKGROUND DECORATIVE GLOWS: Swapped to Brand Violet Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[40%] bg-charcaol/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-charcaol/5 rounded-full blur-[120px] pointer-events-none" />

      {/* 1. HEADER SECTION: Unified with Bigview Gold and spacing */}
      <div className="w-full max-w-lg mb-8 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-charcaol/5 rounded-bigview border border-white/5 mb-6 backdrop-blur-md">
          <Sparkles size={12} className="text-gold-buttons" />
          <span className="text-[9px] font-black text-solid-green/30 tracking-tight">Bigview Treasury</span>
        </div>
        
        {/* The WisdomCarousel will now sit on your clean Violet Background */}
        <WisdomCarousel />
      </div>
      
      {/* 2. THE STAKE CARD: The core interaction component */}
      <div className="relative z-10 w-full flex justify-center">
        <StakeCard />
      </div>

      {/* 3. FOOTER STATS: Cleaned up typography and colors */}
      <div className="mt-12 flex gap-8 text-[9px] font-black text-white/20 tracking-tight relative z-10">
        <div className="flex items-center gap-2">
          Network: <span className="text-white/60">Base Sepolia</span>
        </div>
        <div className="flex items-center gap-2">
          Reward: <span className="text-color-white">BVW Token</span>
        </div>
      </div>
    </main>
  );
  }