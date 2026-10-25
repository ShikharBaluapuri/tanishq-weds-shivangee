import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function Navbar({ onOpenRsvp }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 transition-all duration-300">
      <div className={`mx-auto max-w-5xl px-4 transition-all ${scrolled ? 'pt-2' : 'pt-4'}`}>
        <nav 
          aria-label="Main Navigation"
          className={`flex items-center justify-between px-5 sm:px-7 py-2.5 rounded-full transition-all duration-300 ${
            scrolled 
              ? 'glass-alabaster shadow-botanical border border-[#C5A869]/30' 
              : 'bg-white/70 backdrop-blur-sm border border-[#C5A869]/20'
          }`}
        >
          {/* Couple Script Logo */}
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 group text-left"
          >
            <div className="w-7 h-7 rounded-full bg-[#354F3B] border border-[#C5A869]/50 flex items-center justify-center text-[#E8E4D8] font-cormorant italic text-xs font-semibold">
              T&amp;S
            </div>
            <div>
              <span
                style={{ fontFamily: "'Pinyon Script', 'Great Vibes', 'Alex Brush', cursive" }}
                className="text-2xl text-[#1E2F23] block leading-none pt-1"
              >
                Tanishq &amp; Shivangee
              </span>
            </div>
          </button>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-7 text-xs font-cormorant uppercase tracking-[0.2em] font-medium text-[#1E2F23]">
            <button 
              onClick={() => scrollTo('itinerary')}
              className="hover:text-[#354F3B] transition-colors"
            >
              Celebrations
            </button>
            <button 
              onClick={() => scrollTo('venue-section')}
              className="hover:text-[#354F3B] transition-colors"
            >
              Venue &amp; Concierge
            </button>
            <button 
              onClick={() => scrollTo('blessings')}
              className="hover:text-[#354F3B] transition-colors"
            >
              Wall of Blessings
            </button>
          </div>

          {/* RSVP CTA */}
          <button
            onClick={onOpenRsvp}
            className="px-5 py-1.5 rounded-full bg-[#354F3B] text-[#E8E4D8] text-xs font-cormorant uppercase tracking-[0.18em] font-semibold hover:bg-[#2A3F2F] hover:scale-105 transition-all border border-[#C5A869]/40 flex items-center gap-1.5 shadow-sm"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A869]" />
            <span>RSVP</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
