import React, { useState, useEffect } from 'react';

export default function Navbar({ onOpenRsvp }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 inset-x-0 z-40 transition-all duration-300">
      <nav 
        aria-label="Main Navigation"
        className="h-20 bg-[#F7F4EE]/95 backdrop-blur-md border-b border-[#E5DEC9] px-6 md:px-14 flex items-center justify-between shadow-sm"
      >
        {/* Left Brand Emblem */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
        >
          {/* Subtle gold-toned त•S monogram icon */}
          <div className="w-8 h-8 rounded-full bg-[#FAF5E9] border border-[#B89352]/40 flex items-center justify-center text-[#9A8052] font-cormorant font-semibold text-xs tracking-wider shadow-sm group-hover:border-[#B89352] transition-colors">
            त•S
          </div>
          <div>
            <span className="font-cormorant font-semibold text-xl md:text-2xl text-[#1C1917] tracking-tight block leading-none">
              Tanishq &amp; Shivangee
            </span>
          </div>
        </button>

        {/* Center Navigation Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-7 xl:gap-8 text-[11px] tracking-[0.22em] uppercase text-[#57534E] font-medium font-sans">
          <button 
            onClick={() => scrollTo('hero')}
            className="hover:text-[#B89352] transition-colors cursor-pointer"
          >
            OUR STORY
          </button>
          <span className="text-[#C8A464]/40 select-none">•</span>
          <button 
            onClick={() => scrollTo('itinerary')}
            className="hover:text-[#B89352] transition-colors cursor-pointer"
          >
            CELEBRATIONS
          </button>
          <span className="text-[#C8A464]/40 select-none">•</span>
          <button 
            onClick={() => scrollTo('venue-section')}
            className="hover:text-[#B89352] transition-colors cursor-pointer"
          >
            THE VENUE
          </button>
          <span className="text-[#C8A464]/40 select-none">•</span>
          <button 
            onClick={() => scrollTo('blessings')}
            className="hover:text-[#B89352] transition-colors cursor-pointer"
          >
            AASHISH VACHAN
          </button>
          <span className="text-[#C8A464]/40 select-none">•</span>
          <button 
            onClick={() => scrollTo('family')}
            className="hover:text-[#B89352] transition-colors cursor-pointer"
          >
            FAMILY
          </button>
        </div>

        {/* Right Pill CTA Button */}
        <button
          onClick={onOpenRsvp}
          className="bg-[#C8A464] hover:bg-[#B59050] text-white text-[10px] tracking-[0.22em] uppercase font-medium px-6 py-2.5 rounded-full shadow-sm transition-all cursor-pointer focus:outline-none"
        >
          CONFIRM RSVP
        </button>
      </nav>
    </header>
  );
}
