import React from 'react';
import { Calendar, MapPin, Heart, CheckCircle2 } from 'lucide-react';

export default function MobileNavigation({ onOpenRsvp }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 p-2 pointer-events-none">
      <nav 
        aria-label="Mobile Navigation Dock"
        className="glass-alabaster mx-auto max-w-sm rounded-full p-1.5 shadow-2xl border border-[#C5A869]/40 flex items-center justify-around pointer-events-auto"
      >
        <button
          onClick={() => scrollTo('itinerary')}
          className="flex flex-col items-center justify-center py-1 px-3 text-[10px] font-cormorant uppercase tracking-wider text-[#1E2F23] hover:text-[#354F3B] transition-colors"
        >
          <Calendar className="w-3.5 h-3.5 text-[#C5A869] mb-0.5" />
          <span>Events</span>
        </button>

        <button
          onClick={() => scrollTo('venue-section')}
          className="flex flex-col items-center justify-center py-1 px-3 text-[10px] font-cormorant uppercase tracking-wider text-[#1E2F23] hover:text-[#354F3B] transition-colors"
        >
          <MapPin className="w-3.5 h-3.5 text-[#354F3B] mb-0.5" />
          <span>Venue</span>
        </button>

        <button
          onClick={() => scrollTo('blessings')}
          className="flex flex-col items-center justify-center py-1 px-3 text-[10px] font-cormorant uppercase tracking-wider text-[#1E2F23] hover:text-[#354F3B] transition-colors"
        >
          <Heart className="w-3.5 h-3.5 text-[#7A917F] mb-0.5" />
          <span>Blessings</span>
        </button>

        <button
          onClick={onOpenRsvp}
          className="flex items-center gap-1.5 py-1.5 px-4 rounded-full bg-[#354F3B] text-[#E8E4D8] text-[11px] font-cormorant uppercase tracking-wider font-semibold shadow-sm border border-[#C5A869]/40"
        >
          <CheckCircle2 className="w-3 h-3 text-[#C5A869]" />
          <span>RSVP</span>
        </button>
      </nav>
    </div>
  );
}
