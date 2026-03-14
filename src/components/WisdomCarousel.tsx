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
};

export default function WisdomCarousel() {
  // --- ADDED: Client-side guard ---
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Or a simple skeleton loader

  return (
    <section className="wisdom-section p-8 bg-white rounded-3xl shadow-sm border border-gray-100 my-10">
      <h2 className="text-xl font-semibold mb-6">Voices of Wisdom</h2>
      <Flickity
        className={'carousel'} 
        elementType={'div'} 
        options={flickityOptions} 
        disableImagesLoaded={false} 
        reloadOnUpdate 
        static 
      >
        {quotes.map((quote, index) => (
          <div key={index} className="carousel-cell px-2">
            <div className={`quote-card gradient-${(index % 3) + 1} p-8 rounded-3xl text-white shadow-xl flex flex-col justify-center min-h-[250px]`}>
              <blockquote className="text-xl md:text-2xl font-serif italic font-medium leading-normal mb-4">
                "{quote.text}"
              </blockquote>
              <cite className="text-sm font-sans uppercase tracking-wider font-bold opacity-80 not-italic">
                — {quote.sage}
              </cite>
            </div>
          </div>
        ))}
      </Flickity>
    </section>
  );
}