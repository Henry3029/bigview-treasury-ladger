"use client";
import React, { useEffect, useState } from 'react';
import Flickity from 'react-flickity-component';
import './wisdom.css'; 

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

const flickityOptions = {
  initialIndex: 0,
  autoPlay: 3000, 
  wrapAround: true, 
  prevNextButtons: false, 
  pageDots: true, 
  pauseAutoPlayOnHover: true,
  // ❌ REMOVE adaptiveHeight: true (It causes the white space jumps)
  // ✅ ADD contain: true (Keeps slides from drifting)
  contain: true,
  draggable: true,
};

export default function WisdomCarousel() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // --- FIX 1: Vertical Flash Guard ---
  // We show a placeholder card that looks like a slide so the page doesn't jump.
  if (!isClient) {
    return (
      <section className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100 my-10">
        <h2 className="text-xl font-semibold mb-6">Voices of Wisdom</h2>
        <div className="w-full h-[250px] bg-gray-50 rounded-3xl animate-pulse flex items-center justify-center text-gray-300">
          Loading wisdom...
        </div>
      </section>
    );
  }

  return (
    <section className="wisdom-section p-4 md:p-8 bg-white rounded-3xl shadow-sm border border-gray-100 my-10 overflow-hidden">
      <h2 className="text-xl font-bold mb-6 text-slate-800">Voices of Wisdom</h2>
      
      <div className="flickity-viewport-wrapper">
        <Flickity
          className={'carousel'} 
          options={flickityOptions} 
          // 🚀 FIX: Ensure we don't use 'static' if we want it to refresh properly
        >
          {quotes.map((quote, index) => (
            /* 📱 MOBILE FIX: Set width to 100% and remove unnecessary padding */
            <div key={index} className="carousel-cell w-full px-1">
              {/* 🎨 SHAPE FIX: Use aspect-square or a fixed ratio for that "rounded triangle/diamond" look on mobile */}
              <div className={`quote-card gradient-${(index % 3) + 1} p-6 md:p-10 rounded-[2.5rem] text-white shadow-xl flex flex-col justify-center items-center text-center min-h-[320px] md:min-h-[400px]`}>
                
                {/* 🖋️ TEXT SIZE FIX: text-lg for mobile, text-3xl for laptop */}
                <blockquote className="text-lg md:text-3xl font-serif italic font-medium leading-tight mb-6">
                  "{quote.text}"
                </blockquote>
                
                <cite className="text-[10px] md:text-sm font-sans uppercase tracking-widest font-black opacity-90 not-italic border-t border-white/20 pt-4">
                  — {quote.sage}
                </cite>
              </div>
            </div>
          ))}
        </Flickity>
      </div>
    </section>
  );
}