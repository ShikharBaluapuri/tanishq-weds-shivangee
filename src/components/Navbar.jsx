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
              ? 'glass-ivory shadow-botanical border border-[#C3A56B]/30' 
              : 'bg-white/75 backdrop-blur-sm border border-[#C3A56B]/20'
          }`}
        >
          {/* Couple Script Logo with Monogram */}
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 group text-left"
          >
            <div className="w-8 h-8 rounded-full bg-[#FAF8F2] border border-[#C3A56B]/60 flex items-center justify-center p-1 shadow-sm group-hover:border-[#C3A56B] transition-colors">
              <img
                src="/monogram_gold_transparent.png"
                alt="T&amp;S"
                className="w-full h-full object-contain filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]"
              />
            </div>
            <div>
              <span
                style={{ fontFamily: "'Pinyon Script', 'Great Vibes', cursive" }}
                className="text-2xl text-[#343F35] block leading-none pt-1"
              >
                Tanishq &amp; Shivangee
              </span>
            </div>
          </button>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6 text-xs font-cormorant uppercase tracking-[0.2em] font-medium text-[#343F35]">
            <button 
              onClick={() => scrollTo('divine-union')}
              className="hover:text-[#41584C] transition-colors"
            >
              Divine Union
            </button>
            <button 
              onClick={() => scrollTo('itinerary')}
              className="hover:text-[#41584C] transition-colors"
            >
              Celebrations
            </button>
            <button 
              onClick={() => scrollTo('venue-section')}
              className="hover:text-[#41584C] transition-colors"
            >
              Venue &amp; Concierge
            </button>
            <button 
              onClick={() => scrollTo('blessings')}
              className="hover:text-[#41584C] transition-colors"
            >
              Wall of Blessings
            </button>
          </div>

          {/* RSVP CTA */}
          <button
            onClick={onOpenRsvp}
            className="px-5 py-1.5 rounded-full bg-[#41584C] text-[#F5F0E5] text-xs font-cormorant uppercase tracking-[0.18em] font-semibold hover:bg-[#2C3E34] hover:scale-105 transition-all border border-[#C3A56B]/40 flex items-center gap-1.5 shadow-sm"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#C3A56B]" />
            <span>RSVP</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
