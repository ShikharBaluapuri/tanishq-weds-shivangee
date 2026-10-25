import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ChevronDown, CheckCircle2 } from 'lucide-react';
import { GaneshaIcon, BotanicalDivider } from './BespokeIcons';

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
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-20 px-6 bg-[#F4F6F3] overflow-hidden bg-paper-texture">
      {/* Background Soft Vignette */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[#EAEee8]/80 to-transparent pointer-events-none" />

      {/* Main Editorial Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-3xl bg-white/90 backdrop-blur-md rounded-3xl p-8 sm:p-14 text-center border border-[#C5A869]/30 shadow-botanical"
      >
        {/* Subtle Line Art Ganesha & Invocation */}
        <div className="flex flex-col items-center justify-center space-y-1.5 mb-6">
          <GaneshaIcon className="w-9 h-9 text-[#C5A869]" />
          <span className="font-devanagari text-[#8C7443] text-xs tracking-[0.25em] font-medium">
            ।। श्री गणेशाय नमः ।।
          </span>
          <span className="font-cormorant uppercase text-[11px] tracking-[0.3em] text-[#7A917F]">
            शुभविवाह • Auspicious Union
          </span>
        </div>

        {/* Grandparents & Host Lineage (Airy & understated) */}
        <div className="max-w-xl mx-auto my-4 text-[#1E2F23]">
          <p className="font-cormorant italic text-sm sm:text-base text-[#7A917F]">
            With the divine blessings of
          </p>
          <p className="font-cormorant uppercase tracking-[0.2em] text-xs sm:text-sm font-semibold text-[#1E2F23] mt-1">
            Smt. Saroj &amp; Shri G.P. Baluapuri
          </p>
          <p className="font-cormorant uppercase tracking-[0.2em] text-xs sm:text-sm font-semibold text-[#1E2F23]">
            Smt. Ranjana &amp; Late Shri Lalit Mohan Verma
          </p>
          <p className="font-cormorant italic text-xs sm:text-sm text-[#7A917F] mt-1">
            we invite you to celebrate the wedding of our beloved grandson
          </p>
        </div>

        <BotanicalDivider className="w-full max-w-xs mx-auto my-5 text-[#C5A869]" />

        {/* Couple Names Centerpiece */}
        <div className="my-6 space-y-2">
          <h2
            style={{ fontFamily: "'Pinyon Script', 'Great Vibes', 'Alex Brush', cursive" }}
            className="text-6xl sm:text-7xl md:text-8xl text-[#1E2F23] leading-none py-2"
          >
            Tanishq &amp; Shivangee
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-xs font-cormorant uppercase tracking-[0.2em] text-[#7A917F] pt-2">
            <span>Son of Dr. Nidhi &amp; Mr. Manish Baluapuri</span>
            <span className="hidden sm:inline text-[#C5A869]">•</span>
            <span>Daughter of Mrs. Shweta &amp; Mr. Tarun Kushwah</span>
          </div>
        </div>

        {/* Date & Location Pill Badge */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 px-6 py-2.5 rounded-full bg-[#F4F6F3] border border-[#C5A869]/40 text-[#1E2F23] shadow-sm my-6 text-xs sm:text-sm font-cormorant uppercase tracking-[0.2em]">
          <div className="flex items-center gap-1.5 font-medium">
            <Calendar className="w-3.5 h-3.5 text-[#C5A869]" />
            <span>14th – 15th February 2027</span>
          </div>
          <span className="hidden sm:inline text-[#C5A869]">•</span>
          <div className="flex items-center gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#354F3B]" />
            <span>The Waterstone Resort, Chhindwara</span>
          </div>
        </div>

        {/* Live Countdown in Stone-Linen Cards */}
        <div className="mt-4 mb-8">
          <div className="text-[10px] font-cormorant uppercase tracking-[0.25em] text-[#7A917F] font-semibold mb-3 flex items-center justify-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#C5A869]" />
            <span>Counting Down to the Shubh Vivah</span>
          </div>

          <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-sm mx-auto">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Mins', value: timeLeft.minutes },
              { label: 'Secs', value: timeLeft.seconds }
            ].map((unit, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#E8E6DF]/70 border border-[#C5A869]/30 shadow-sm"
              >
                <span className="text-2xl sm:text-3xl font-cormorant font-bold text-[#1E2F23]">
                  {String(unit.value).padStart(2, '0')}
                </span>
                <span className="text-[9px] font-sans tracking-widest uppercase text-[#7A917F] mt-0.5">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Minimalist Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
          <button
            onClick={onOpenRsvp}
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#354F3B] text-[#E8E4D8] font-cormorant uppercase tracking-[0.2em] text-xs font-semibold shadow-md hover:bg-[#2A3F2F] hover:scale-105 transition-all border border-[#C5A869]/50 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A869]" />
            <span>RSVP Joyfully</span>
          </button>

          <button
            onClick={onScrollToItinerary}
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-white text-[#1E2F23] font-cormorant uppercase tracking-[0.2em] text-xs font-semibold border border-[#C5A869]/40 hover:bg-[#F4F6F3] transition-all flex items-center justify-center gap-2"
          >
            <span>The Celebrations</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#7A917F]" />
          </button>
        </div>
      </motion.div>

      {/* Gentle Scroll Prompt */}
      <motion.div
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        className="mt-8 flex flex-col items-center text-[#7A917F] text-xs cursor-pointer"
        onClick={onScrollToItinerary}
      >
        <span className="font-cormorant uppercase tracking-[0.2em] text-[11px]">Explore Itinerary</span>
        <ChevronDown className="w-4 h-4 mt-1 text-[#C5A869]" />
      </motion.div>
    </section>
  );
}
