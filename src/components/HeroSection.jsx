import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ChevronDown, CheckCircle2 } from 'lucide-react';
import { BotanicalDivider, BotanicalCornerSprig } from './BespokeIcons';

export default function HeroSection({ onOpenRsvp, onScrollToItinerary }) {
  // Live countdown to Monday, February 15, 2027 09:00:00 IST (The Wedding Day)
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
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-20 px-4 sm:px-6 bg-[#F5F0E5] overflow-hidden bg-paper-texture">
      {/* Background Soft Ambient Vignette */}
      <div className="absolute top-0 inset-x-0 h-72 bg-gradient-to-b from-[#EAE2D3]/70 to-transparent pointer-events-none" />

      {/* Main Luxury Printed Invitation Card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-3xl bg-[#FDFBF7] rounded-3xl p-7 sm:p-14 text-center border border-[#C3A56B]/35 shadow-botanical overflow-hidden"
      >
        {/* Delicate Inner Stationery Border Frame */}
        <div className="absolute inset-3 sm:inset-4 border border-[#C3A56B]/20 rounded-2xl pointer-events-none" />

        {/* Faint Botanical Corner Sprigs */}
        <div className="absolute -top-6 -right-6 sm:-top-8 sm:-right-8 pointer-events-none opacity-25 transform rotate-12 scale-90">
          <BotanicalCornerSprig className="w-28 h-28 text-[#A4B3A1]" />
        </div>
        <div className="absolute -bottom-6 -left-6 sm:-bottom-8 sm:-left-8 pointer-events-none opacity-25 transform -rotate-[165deg] scale-90">
          <BotanicalCornerSprig className="w-28 h-28 text-[#A4B3A1]" />
        </div>

        {/* Custom Monogram Heirloom Crest */}
        <div className="flex flex-col items-center justify-center mb-4">
          <img
            src="/monogram_gold_transparent.png"
            alt="Tanishq &amp; Shivangee Royal Crest"
            className="w-16 h-20 sm:w-20 sm:h-24 object-contain filter drop-shadow-sm mb-2"
          />
          <h3 className="font-devanagari text-[#A78343] text-xs sm:text-sm tracking-normal font-normal">
            ॥ श्री गणेशाय नमः ॥
          </h3>
          <p className="font-devanagari text-[11px] sm:text-xs text-[#657968] tracking-normal mt-0.5 max-w-md mx-auto leading-relaxed opacity-90">
            विघ्न हरण मंगल करण, गौरी पुत्र गणेश • प्रथम निमंत्रण आपको ब्रह्मा, विष्णु, महेश
          </p>
          <span className="font-devanagari text-xs text-[#A78343] font-medium mt-1">
            ॥ शुभविवाह ॥
          </span>
        </div>

        {/* Grandparents & Blessings Lineage */}
        <div className="max-w-xl mx-auto my-3 text-[#343F35]">
          <p className="font-cormorant italic text-xs sm:text-sm text-[#657968]">
            With the divine blessings of
          </p>
          <p className="font-cormorant uppercase tracking-[0.2em] text-xs sm:text-sm font-semibold text-[#343F35] mt-0.5">
            Smt. Saroj &amp; Shri G.P. Baluapuri
          </p>
          <p className="font-cormorant uppercase tracking-[0.2em] text-xs sm:text-sm font-semibold text-[#343F35]">
            Smt. Ranjana &amp; Late Shri Lalit Mohan Verma
          </p>
          <p className="font-cormorant italic text-xs sm:text-sm text-[#657968] mt-1">
            we invite you to celebrate the auspicious wedding of our beloved grandson
          </p>
        </div>

        <BotanicalDivider className="w-full max-w-xs mx-auto my-4 text-[#C3A56B]" />

        {/* Couple's Names Centerpiece */}
        <div className="my-5 space-y-1.5">
          <h2
            style={{ fontFamily: "'Pinyon Script', 'Great Vibes', cursive" }}
            className="text-6xl sm:text-7xl md:text-8xl text-[#343F35] leading-none py-1 drop-shadow-sm"
          >
            Tanishq <span className="font-cormorant italic text-3xl sm:text-5xl text-[#C3A56B] font-light">&amp;</span> Shivangee
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-6 text-xs font-cormorant uppercase tracking-[0.18em] text-[#657968] pt-1">
            <span>Son of Dr. Nidhi &amp; Mr. Manish Baluapuri</span>
            <span className="hidden sm:inline text-[#C3A56B]">•</span>
            <span>Daughter of Mrs. Shweta &amp; Mr. Tarun Kushwah</span>
          </div>
        </div>

        {/* Auspicious Date & Venue Pill Badge */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 px-6 py-2.5 rounded-full bg-[#EAE2D3]/60 border border-[#C3A56B]/35 text-[#343F35] shadow-sm my-5 text-xs sm:text-sm font-cormorant uppercase tracking-[0.18em]">
          <div className="flex items-center gap-1.5 font-medium">
            <Calendar className="w-3.5 h-3.5 text-[#C3A56B]" />
            <span>14th – 15th February 2027</span>
          </div>
          <span className="hidden sm:inline text-[#C3A56B]">•</span>
          <div className="flex items-center gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#41584C]" />
            <span>The Waterstone Resort, Chhindwara</span>
          </div>
        </div>

        {/* Live Wedding Countdown in Warm Paper Cards */}
        <div className="mt-3 mb-7">
          <div className="text-[10px] sm:text-[11px] font-cormorant uppercase tracking-[0.25em] text-[#657968] font-semibold mb-3 flex items-center justify-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#C3A56B]" />
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
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#EAE2D3]/80 border border-[#C3A56B]/30 shadow-sm"
              >
                <span className="text-2xl sm:text-3xl font-cormorant font-bold text-[#343F35]">
                  {String(unit.value).padStart(2, '0')}
                </span>
                <span className="text-[9px] font-sans tracking-widest uppercase text-[#657968] mt-0.5">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Minimalist Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-1">
          <button
            onClick={onOpenRsvp}
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#41584C] text-[#F5F0E5] font-cormorant uppercase tracking-[0.2em] text-xs font-semibold shadow-md hover:bg-[#2C3E34] hover:scale-105 transition-all border border-[#C3A56B]/40 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#C3A56B]" />
            <span>RSVP Joyfully</span>
          </button>

          <button
            onClick={onScrollToItinerary}
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-white text-[#343F35] font-cormorant uppercase tracking-[0.2em] text-xs font-semibold border border-[#C3A56B]/35 hover:bg-[#EAE2D3]/40 transition-all flex items-center justify-center gap-2"
          >
            <span>The Celebrations</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#657968]" />
          </button>
        </div>
      </motion.div>

      {/* Gentle Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        className="mt-8 flex flex-col items-center text-[#657968] text-xs cursor-pointer"
        onClick={onScrollToItinerary}
      >
        <span className="font-cormorant uppercase tracking-[0.2em] text-[11px]">Explore Itinerary</span>
        <ChevronDown className="w-4 h-4 mt-1 text-[#C3A56B]" />
      </motion.div>
    </section>
  );
}
