"use client";
import React, { useEffect, useState, useRef } from 'react';

const quotes = [
  { text: "Discipline is the bridge between goals and accomplishments.", sage: "Jim Rohn" },
  { text: "The only way to predict your future is to create It", sage: "Abraham Lincoln" },
  { text: "The only true wisdom is in knowing you know nothing.", sage: "Socrates" },
  { text: "Your time is limited, don't waste it living someone else's life.", sage: "Steve Jobs" },
  { text: "Life is what happens when you're busy making other plans.", sage: "John Lennon" },
  { text: "The journey of a thousand miles begins with one step.", sage: "Lao Tzu" },
  { text: "Be the change that you wish to see in the world.", sage: "Mahatma Gandhi" },
  { text: "Our greatest glory is not in never failing, but in rising up every time we fail.", sage: "Ralph Waldo Emerson" },
  { text: "What we think, we become.", sage: "Buddha" },
  { text: "The way to get started is to quit talking and begin doing.", sage: "Walt Disney" },
  { text: "Everything has beauty, but not everyone sees it.", sage: "Confucius" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", sage: "Mahatma Gandhi" },
];

export default function WisdomCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // --- AUTO-PLAY LOGIC ---
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
    }, 4000); // 4 seconds

    return () => clearInterval(interval);
  }, [activeIndex]);

  // Update index when user swipes manually
  const handleScroll = () => {
    if (scrollRef.current) {
      const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.offsetWidth);
      setActiveIndex(index);
    }
  };

  const gradients = [
    "from-blue-600 to-cyan-400",
    "from-amber-500 to-orange-600",
    "from-emerald-500 to-teal-600"
  ];

  return (
    <section className="p-4 md:p-8 bg-white rounded-3xl shadow-sm border border-gray-100 my-10 overflow-hidden">
      <h2 className="text-xl font-bold mb-6 text-slate-800">Voices of Wisdom</h2>
      
      <div className="relative">
        {/* CAROUSEL CONTAINER */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide space-x-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {quotes.map((quote, index) => (
            <div key={index} className="min-w-full snap-center px-1">
              <div className={`bg-gradient-to-br ${gradients[index % 3]} p-8 md:p-12 rounded-[2.5rem] text-white shadow-xl flex flex-col justify-center items-center text-center min-h-[350px] md:min-h-[400px]`}>
                
                <blockquote className="text-xl md:text-3xl font-serif italic font-medium leading-relaxed mb-8">
                  "{quote.text}"
                </blockquote>
                
                <cite className="text-xs md:text-sm font-sans uppercase tracking-[0.2em] font-black opacity-90 not-italic border-t border-white/20 pt-6">
                  — {quote.sage}
                </cite>
              </div>
            </div>
          ))}
        </div>

        {/* CUSTOM DOTS */}
        <div className="flex justify-center space-x-2 mt-6">
          {quotes.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                scrollRef.current?.scrollTo({ left: scrollRef.current.offsetWidth * i, behavior: 'smooth' });
                setActiveIndex(i);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === i ? "w-8 bg-slate-800" : "w-2 bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}