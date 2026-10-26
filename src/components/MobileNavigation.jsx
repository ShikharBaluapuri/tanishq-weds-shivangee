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
        className="glass-cream mx-auto max-w-sm rounded-full p-1.5 shadow-[0_12px_36px_rgba(12,34,59,0.15)] border border-[#B8A072]/30 flex items-center justify-around pointer-events-auto backdrop-blur-xl bg-[#FAF8F5]/90"
      >
        <button
          onClick={() => scrollTo('itinerary')}
          className="flex flex-col items-center justify-center py-1 px-3 text-[10px] font-cormorant uppercase tracking-wider text-[#0C223B]/80 hover:text-[#0C223B] transition-colors"
        >
          <Calendar className="w-3.5 h-3.5 text-[#B8A072] mb-0.5" />
          <span>Events</span>
        </button>

        <button
          onClick={() => scrollTo('venue-section')}
          className="flex flex-col items-center justify-center py-1 px-3 text-[10px] font-cormorant uppercase tracking-wider text-[#0C223B]/80 hover:text-[#0C223B] transition-colors"
        >
          <MapPin className="w-3.5 h-3.5 text-[#B8A072] mb-0.5" />
          <span>Venue</span>
        </button>

        <button
          onClick={() => scrollTo('blessings')}
          className="flex flex-col items-center justify-center py-1 px-3 text-[10px] font-cormorant uppercase tracking-wider text-[#0C223B]/80 hover:text-[#0C223B] transition-colors"
        >
          <Heart className="w-3.5 h-3.5 text-[#B8A072] mb-0.5" />
          <span>Blessings</span>
        </button>

        <button
          onClick={onOpenRsvp}
          className="flex items-center gap-1.5 py-1.5 px-4 rounded-full bg-[#C8A464] hover:bg-[#B59050] text-white text-[11px] font-sans uppercase tracking-wider font-medium shadow-sm transition-all"
        >
          <CheckCircle2 className="w-3 h-3 text-white" />
          <span>RSVP</span>
        </button>
      </nav>
    </div>
  );
}
