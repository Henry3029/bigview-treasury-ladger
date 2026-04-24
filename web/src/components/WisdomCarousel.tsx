"use client";
import React, { useEffect, useState, useRef } from 'react';
import { Quote, Sparkles, TrendingUp, Trophy, Target, Lightbulb } from 'lucide-react';

const quotes = [
  { 
    text: "Discipline is the bridge between goals and accomplishments.", 
    sage: "Jim Rohn",
    color: "from-emerald-900 via-green-800 to-black",
    icon: <Target className="text-emerald-400" size={20} />
  },
  { 
    text: "The only way to predict your future is to create it.", 
    sage: "Abraham Lincoln", 
    color: "from-blue-900 via-indigo-950 to-black",
    icon: <Sparkles className="text-blue-300" size={20} />
  },
  { 
    text: "The only true wisdom is in knowing you know nothing.", 
    sage: "Socrates",
    color: "from-slate-900 via-slate-800 to-black",
    icon: <Lightbulb className="text-yellow-400" size={20} />
  },
  { 
    text: "Your time is limited, don't waste it living someone else's life.", 
    sage: "Steve Jobs",
    color: "from-red-900 via-orange-950 to-black",
    icon: <Trophy className="text-orange-400" size={20} />
  },
  { 
    text: "Life is what happens when you're busy making other plans.", 
    sage: "John Lennon",
    color: "from-purple-900 via-indigo-900 to-black",
    icon: <TrendingUp className="text-purple-300" size={20} />
  },
  { 
    text: "The journey of a thousand miles begins with one step.", 
    sage: "Lao Tzu",
    color: "from-teal-900 via-emerald-950 to-black",
    icon: <Quote className="text-teal-400" size={20} />
  },
];

export default function WisdomCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const nextIndex = (activeIndex + 1) % quotes.length;
        const scrollAmount = scrollRef.current.offsetWidth * nextIndex;
        
        scrollRef.current.scrollTo({
          left: scrollAmount,
          behavior: 'smooth'
        });
        setActiveIndex(nextIndex);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.offsetWidth);
      setActiveIndex(index);
    }
  };

  return (
    <section className="w-full max-w-md mx-auto my-2 overflow-hidden font-inter">
      <div className="relative">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {quotes.map((quote, index) => (
            <div key={index} className="min-w-full snap-center px-2">
              <div className={`bg-gradient-to-br ${quote.color} p-2 rounded-2xl text-white shadow-xl flex flex-col justify-center min-h-[110px] relative overflow-hidden group`}>
                
                {/* Decorative Shine Elements (OPay Aesthetic) */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />
                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
                
                {/* Icon Header */}
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="p-1.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
                    {quote.icon}
                  </div>
                  <span className="text-[9px] font-black text-gold-buttons tracking-tight">Bigview Insight</span>
                </div>
                
                <blockquote className="text-sm md:text-sm font-bold leading-snug mb-2 relative z-10 tracking-tight">
                  "{quote.text}"
                </blockquote>
                
                <cite className="text-[9px] font-medium text-white/50 tracking-tight not-italic relative z-10">
                  — {quote.sage}
                </cite>

                {/* Hidden Background Text for depth */}
                <div className="absolute -right-4 bottom-2 text-white/[0.03] text-6xl font-black select-none">
                  WISE
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* COMPACT DOTS: Positioned inside the card area for a cleaner look */}
        <div className="flex justify-center space-x-1.5 mt-3">
          {quotes.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                scrollRef.current?.scrollTo({ left: scrollRef.current.offsetWidth * i, behavior: 'smooth' });
                setActiveIndex(i);
              }}
              className={`h-1 rounded-full transition-all duration-500 ${
                activeIndex === i ? "w-6 bg-slate-400" : "w-1.5 bg-slate-200"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}