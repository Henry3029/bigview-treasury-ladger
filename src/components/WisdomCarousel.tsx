"use client";
import React, { useEffect, useState, useRef } from 'react';

const quotes = [
  { text: "Discipline is the bridge between goals and accomplishments.", sage: "Jim Rohn" },
  { text: "The only way to predict your future is to create It", sage: "Abraham Lincoln" },
  { text: "The only true wisdom is in knowing you know nothing.", sage: "Socrates" },
  { text: "Your time is limited, don't waste it living someone else's life.", sage: "Steve Jobs" },
  { text: "Life is what happens when you're busy making other plans.", sage: "John Lennon" },
  { text: "The journey of a thousand miles begins with one step.", sage: "Lao Tzu" },
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
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.offsetWidth);
      setActiveIndex(index);
    }
  };

  const gradients = [
    "from-blue-600 to-indigo-700",
    "from-orange-500 to-red-600",
    "from-emerald-500 to-teal-700"
  ];

  return (
    // Lowered 'my-10' to 'my-4' and removed white background/border to let it float
    <section className="w-full max-w-md mx-auto my-4 overflow-hidden">
      <div className="relative">
        {/* CAROUSEL CONTAINER */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {quotes.map((quote, index) => (
            <div key={index} className="min-w-full snap-center px-1">
              {/* Reduced min-h from 350px to 140px for that compact look */}
              <div className={`bg-gradient-to-br ${gradients[index % 3]} p-6 rounded-[2rem] text-white shadow-lg flex flex-col justify-center min-h-[140px] relative`}>
                
                {/* Decorative Quote Icon */}
                <span className="absolute top-4 left-6 text-white/20 text-4xl font-serif">“</span>
                
                <blockquote className="text-sm md:text-base font-bold leading-snug mb-3 relative z-10 px-4">
                  {quote.text}
                </blockquote>
                
                <cite className="text-[10px] font-black uppercase tracking-widest opacity-80 not-italic px-4">
                  — {quote.sage}
                </cite>
              </div>
            </div>
          ))}
        </div>

        {/* COMPACT DOTS */}
        <div className="flex justify-center space-x-1.5 mt-3">
          {quotes.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                scrollRef.current?.scrollTo({ left: scrollRef.current.offsetWidth * i, behavior: 'smooth' });
                setActiveIndex(i);
              }}
              className={`h-1 rounded-full transition-all duration-300 ${
                activeIndex === i ? "w-4 bg-slate-400" : "w-1 bg-slate-200"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}