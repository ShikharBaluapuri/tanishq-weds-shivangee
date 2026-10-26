import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

export default function HeroSection({ onOpenRsvp, onScrollToItinerary }) {
  // Live ticking countdown to Monday, February 15, 2027 09:00:00 IST
  const TARGET_DATE = new Date('2027-02-15T09:00:00+05:30').getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = TARGET_DATE - now;

      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="relative min-h-[92vh] lg:min-h-screen flex flex-col items-center justify-center pt-24 pb-28 px-6 text-center select-none overflow-hidden bg-[#120E0B] text-[#FAF8F5]">
      {/* 1. Full-Bleed Dimmed Engagement Hands & Ring Photo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src="/couple-hands.jpg"
          onError={(e) => {
            if (!e.target.dataset.tried) {
              e.target.dataset.tried = '1';
              e.target.src = '/IMG_8814.JPG.jpg';
            }
          }}
          alt="Tanishq & Shivangee Engagement Hands"
          className="w-full h-full object-cover object-[50%_70%] scale-[1.08]"
          style={{ filter: 'brightness(0.46) contrast(1.08) saturate(0.85) sepia(0.12)' }}
        />
      </div>

      {/* 2. Three-Layer Cinematic Blending Overlays */}
      {/* Layer 1: Top Vignette Mask (Hides top background objects & frames header text) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_65%,transparent_15%,rgba(14,11,9,0.75)_85%)] pointer-events-none" />

      {/* Layer 2: Vertical Warm Espresso Dimmer */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#120E0B]/80 via-[#1A1410]/45 to-[#120E0B]/85 pointer-events-none" />

      {/* Layer 3: Bottom Edge Feather Blend (Smoothly melts photo into Warm Silk Cream below) */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#F7F4EE] via-[#F7F4EE]/60 to-transparent pointer-events-none z-10" />

      {/* 3. Centered "EverAfter" Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, ease: 'easeOut' }}
        className="relative z-20 max-w-4xl mx-auto flex flex-col items-center"
      >
        {/* Top Kicker */}
        <span className="font-cormorant text-[11px] md:text-xs tracking-[0.35em] uppercase text-[#E8DFD1]/85 mb-4 block font-normal">
          ।। श्री गणेशाय नमः ।।   •   SHUBH VIVAH   •   14 – 15 FEB 2027
        </span>

        {/* Two-Line Editorial Headline (Exact "EverAfter" Style) */}
        <h1 className="flex flex-col items-center text-center">
          <span className="font-cormorant font-normal text-4xl sm:text-6xl md:text-[68px] text-[#FAF8F5] leading-[1.08] block tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
            Celebrating the Union of
          </span>
          <span className="font-cormorant italic font-normal text-4xl sm:text-6xl md:text-[72px] text-[#D8B575] leading-[1.08] mt-1 block drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
            Tanishq &amp; Shivangee
          </span>
        </h1>

        {/* Poetic Two-Line Subtitle */}
        <p className="font-cormorant italic text-xs sm:text-sm md:text-[15px] text-[#FAF8F5]/80 font-light leading-relaxed max-w-xl mx-auto mt-5 mb-8">
          “With the divine blessings of Smt. Saroj – Shri G.P. Baluapuri &amp; Smt. Ranjana – Late Shri Lalit Mohan Verma, we invite you to celebrate love, tradition, and new beginnings at The Waterstone Resort, Chhindwara.”
        </p>

        {/* Dual Pill CTA Buttons (Side-by-Side, Centered) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto">
          {/* Primary Left Pill (Solid Champagne Gold) */}
          <button
            onClick={onOpenRsvp}
            className="w-full sm:w-auto bg-[#C8A464] hover:bg-[#B89352] text-[#FAF8F5] text-[11px] tracking-[0.22em] uppercase font-medium px-8 py-4 rounded-full shadow-[0_10px_25px_rgba(200,164,100,0.3)] hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
          >
            <span>RSVP YOUR ATTENDANCE</span>
            <span className="text-sm">→</span>
          </button>

          {/* Secondary Right Pill (Frosted Glass Outlined) */}
          <button
            onClick={onScrollToItinerary}
            className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md border border-[#FAF8F5]/40 text-[#FAF8F5] text-[11px] tracking-[0.22em] uppercase font-medium px-8 py-4 rounded-full transition-all flex items-center justify-center cursor-pointer focus:outline-none"
          >
            VIEW WEDDING ITINERARY
          </button>
        </div>

        {/* Sleek Frosted Live Countdown Timer */}
        <div className="mt-8 max-w-sm mx-auto">
          <div className="text-[9.5px] font-cormorant uppercase tracking-[0.25em] text-[#D8B575]/85 mb-2.5 flex items-center justify-center gap-1.5 font-normal">
            <Clock className="w-3 h-3 text-[#D8B575]" />
            <span>COUNTING DOWN TO THE CELEBRATIONS</span>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Mins', value: timeLeft.minutes },
              { label: 'Secs', value: timeLeft.seconds }
            ].map((unit, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center py-2 px-2.5 rounded-xl bg-black/35 backdrop-blur-md border border-[#FAF8F5]/15 shadow-sm text-[#FAF8F5]"
              >
                <span className="text-xl sm:text-2xl font-cormorant font-light text-[#FAF8F5]">
                  {String(unit.value).padStart(2, '0')}
                </span>
                <span className="text-[8px] font-sans tracking-widest uppercase text-[#D8B575] mt-0.5">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 4. Bottom Minimalist Scroll Indicator */}
      <div 
        onClick={onScrollToItinerary}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 cursor-pointer"
      >
        <span className="font-cormorant text-[9px] tracking-[0.35em] uppercase text-[#FAF8F5]/65">
          SCROLL
        </span>
        <div className="w-[1px] h-9 bg-gradient-to-b from-[#D8B575]/80 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
