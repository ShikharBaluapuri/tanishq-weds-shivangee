import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { BotanicalCornerSprig, HandDrawnArrow } from './BespokeIcons';
import { royalAudioEngine } from './AudioPlayer';

export default function WaxSealPreloader({ onOpenInvitation }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleSealClick = () => {
    if (isOpening || isOpen) return;
    setIsOpening(true);

    // 1. Play soothing ambient flute/shehnai
    try {
      royalAudioEngine.start();
    } catch (e) {
      console.warn('Audio auto-start on gesture:', e);
    }

    // 2. Trigger delicate gold and white flower petal shower
    triggerBotanicalShower();

    // 3. Complete opening transition
    setTimeout(() => {
      setIsOpen(true);
      if (onOpenInvitation) {
        onOpenInvitation();
      }
    }, 1100);
  };

  const triggerBotanicalShower = () => {
    const end = Date.now() + 1100;
    // Antique gold, champagne cream, soft sage, and ivory
    const colors = ['#C5A869', '#E8E4D8', '#F4F6F3', '#7A917F', '#E2CA94'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 50,
        origin: { x: 0, y: 0.75 },
        colors: colors,
        shapes: ['circle'],
        scalar: 1.1
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 50,
        origin: { x: 1, y: 0.75 },
        colors: colors,
        shapes: ['circle'],
        scalar: 1.1
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          key="botanical-envelope-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-between p-4 sm:p-8 bg-forest-gradient overflow-hidden select-none"
        >
          {/* Subtle Matte Paper Texture Overlay */}
          <div className="absolute inset-0 bg-paper-texture opacity-15 pointer-events-none" />
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#46664E]/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#1E2F23]/40 blur-3xl pointer-events-none" />

          {/* 1. TOP SECTION OUTSIDE THE ENVELOPE */}
          <div className="relative z-10 pt-4 sm:pt-6 text-center max-w-xl mx-auto flex flex-col items-center space-y-2">
            {/* Top Subtle Invocation */}
            <span className="font-devanagari text-[10px] sm:text-xs tracking-[0.3em] text-[#C5A869]/70 uppercase block">
              ।। श्री गणेशाय नमः ।।
            </span>

            {/* Subtitle Above Names */}
            <span className="font-cormorant uppercase text-xs sm:text-sm tracking-[0.3em] text-[#E8E4D8]/85 font-normal">
              A Love Story Begins
            </span>

            {/* Main Couple Title in Elegant Calligraphy Script */}
            <h1
              style={{ fontFamily: "'Pinyon Script', 'Great Vibes', 'Alex Brush', cursive" }}
              className="text-5xl sm:text-7xl md:text-8xl text-[#E8E4D8] font-normal tracking-wide drop-shadow-sm py-1"
            >
              Tanishq &amp; Shivangee
            </h1>
          </div>

          {/* 2. CENTER ENVELOPE OBJECT (ZERO TEXT INSIDE!) */}
          <div className="relative z-10 my-auto w-full max-w-md sm:max-w-lg aspect-[1.48/1] flex items-center justify-center">
            
            {/* Botanical White Jasmine Sprigs draping over corners */}
            {/* Top-Right Corner Floral Sprig */}
            <div className="absolute -top-7 -right-7 sm:-top-9 sm:-right-9 z-30 pointer-events-none transform rotate-12 scale-100 sm:scale-110 drop-shadow-md">
              <BotanicalCornerSprig className="w-32 h-32 sm:w-40 sm:h-40" />
            </div>

            {/* Bottom-Left Corner Floral Sprig */}
            <div className="absolute -bottom-7 -left-7 sm:-bottom-9 sm:-left-9 z-30 pointer-events-none transform -rotate-[165deg] scale-100 sm:scale-110 drop-shadow-md">
              <BotanicalCornerSprig className="w-32 h-32 sm:w-40 sm:h-40" />
            </div>

            {/* The Envelope Body */}
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="relative w-full h-full rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden bg-[#E8E6DF] border border-[#DCD9D0]"
              style={{
                boxShadow: '0 25px 60px -15px rgba(16, 28, 20, 0.5), 0 0 0 1px rgba(197, 168, 105, 0.25)'
              }}
            >
              {/* Envelope Paper Texture */}
              <div className="absolute inset-0 bg-[#E8E6DF] opacity-90" />
              <div className="absolute inset-0 bg-paper-texture opacity-30 pointer-events-none" />

              {/* Lower Flaps / Fold Lines (Left & Right triangles) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                {/* Left triangular flap */}
                <polygon points="0,0 0,100 50,55" fill="#E2DFD8" opacity="0.9" />
                {/* Right triangular flap */}
                <polygon points="100,0 100,100 50,55" fill="#DDD9D1" opacity="0.9" />
                {/* Bottom triangular flap */}
                <polygon points="0,100 100,100 50,55" fill="#E5E3DC" />
                {/* Natural crease shadows */}
                <line x1="0" y1="0" x2="50%" y2="55%" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
                <line x1="100%" y1="0" x2="50%" y2="55%" stroke="rgba(0,0,0,0.07)" strokeWidth="1" />
                <line x1="0" y1="100%" x2="50%" y2="55%" stroke="rgba(0,0,0,0.06)" strokeWidth="1.2" />
                <line x1="100%" y1="100%" x2="50%" y2="55%" stroke="rgba(0,0,0,0.08)" strokeWidth="1.2" />
              </svg>

              {/* Top Triangular Flap (Folds open on click) */}
              <motion.div
                animate={isOpening ? { rotateX: -170, zIndex: 1 } : { rotateX: 0 }}
                transition={{ duration: 0.9, ease: 'easeInOut' }}
                style={{ transformOrigin: 'top center', perspective: 1200 }}
                className="absolute top-0 inset-x-0 h-[62%] pointer-events-none z-20 flap-drop-shadow"
              >
                <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="w-full h-full drop-shadow-md">
                  {/* Top triangular flap with gentle rounded apex point */}
                  <polygon
                    points="0,0 100,0 50,58"
                    fill="#ECEAE4"
                    stroke="rgba(197, 168, 105, 0.2)"
                    strokeWidth="0.4"
                  />
                </svg>
              </motion.div>

              {/* CLEAN ANTIQUE GOLD WAX SEAL (Centered right at top flap's apex) */}
              <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
                <motion.button
                  onClick={handleSealClick}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  className="relative group cursor-pointer focus:outline-none focus:ring-0"
                  aria-label="Click to Open Wedding Invitation Envelope"
                >
                  {/* Organic Irregular Antique Wax Seal */}
                  <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full antique-wax-seal flex items-center justify-center p-1.5 transition-transform duration-300">
                    {/* Inner Beveled Ring */}
                    <div className="w-full h-full rounded-full border border-[#B08D44]/60 wax-seal-inner flex flex-col items-center justify-center bg-gradient-to-br from-[#C5A869] to-[#9E7E38]">
                      {/* Ultra-Clean Engraved Serif Monogram: T & S */}
                      <span className="font-cormorant italic text-lg sm:text-2xl font-semibold tracking-wider text-[#4A370E] drop-shadow-sm select-none">
                        T &amp; S
                      </span>
                    </div>
                  </div>

                  {/* Gentle pulsing aura ring */}
                  <motion.div
                    animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.05, 0.5] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-0 -m-2 rounded-full border border-[#C5A869]/70 pointer-events-none"
                  />
                </motion.button>
              </div>

            </motion.div>
          </div>

          {/* 3. BOTTOM PROMPT & HAND-DRAWN ARROW OUTSIDE THE ENVELOPE */}
          <div className="relative z-10 pb-4 sm:pb-6 text-center flex flex-col items-center">
            <div className="relative inline-flex items-center justify-center">
              <motion.button
                onClick={handleSealClick}
                whileHover={{ y: -2 }}
                className="font-cormorant uppercase text-xs sm:text-sm tracking-[0.25em] text-[#E8E4D8] hover:text-[#C5A869] transition-colors py-2 px-4 rounded-full"
              >
                Click to Open Envelope
              </motion.button>

              {/* Hand-drawn curved arrow on the bottom right pointing up */}
              <div className="absolute -right-10 sm:-right-14 bottom-1 pointer-events-none opacity-85">
                <HandDrawnArrow className="w-8 h-8 sm:w-10 sm:h-10 text-[#C5A869]" />
              </div>
            </div>

            <span className="text-[10px] font-sans tracking-widest uppercase text-[#E8E4D8]/60 mt-1">
              14th – 15th February 2027 • The Waterstone Resort
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
