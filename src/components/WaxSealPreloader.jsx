import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { BotanicalCornerSprig, HandDrawnArrow } from './BespokeIcons';
import { royalAudioEngine } from './AudioPlayer';

export default function WaxSealPreloader({ onOpenInvitation }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [cardRising, setCardRising] = useState(false);

  const handleSealClick = () => {
    if (isOpening || isOpen) return;
    setIsOpening(true);

    // 1. Soothing ambient flute & shehnai audio
    try {
      royalAudioEngine.start();
    } catch (e) {
      console.warn('Audio auto-start:', e);
    }

    // 2. Trigger golden & ivory botanical flower shower
    triggerBotanicalShower();

    // 3. Card rises out of envelope
    setTimeout(() => {
      setCardRising(true);
    }, 450);

    // 4. Smooth transition into main wedding experience
    setTimeout(() => {
      setIsOpen(true);
      if (onOpenInvitation) {
        onOpenInvitation();
      }
    }, 1600);
  };

  const triggerBotanicalShower = () => {
    const end = Date.now() + 1200;
    // Champagne gold, warm paper, soft eucalyptus, antique ivory, muted rose
    const colors = ['#C3A56B', '#F5F0E5', '#EAE2D3', '#A4B3A1', '#A76D6B', '#E2CA94'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.72 },
        colors: colors,
        shapes: ['circle'],
        scalar: 1.15
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.72 },
        colors: colors,
        shapes: ['circle'],
        scalar: 1.15
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
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-between p-4 sm:p-8 bg-heritage-atmosphere overflow-hidden select-none"
        >
          {/* Subtle Handmade Cotton Paper Texture Overlay */}
          <div className="absolute inset-0 bg-paper-texture opacity-20 pointer-events-none" />
          
          {/* Soft Central Illumination & Vignette */}
          <div className="absolute -top-32 -left-32 w-[34rem] h-[34rem] rounded-full bg-[#527060]/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-[34rem] h-[34rem] rounded-full bg-[#1B2821]/50 blur-3xl pointer-events-none" />

          {/* Faint Botanical Corner Silhouettes */}
          <div className="absolute top-4 left-4 pointer-events-none opacity-20 transform rotate-12 scale-90">
            <BotanicalCornerSprig className="w-36 h-36 text-[#A4B3A1]" />
          </div>
          <div className="absolute bottom-4 right-4 pointer-events-none opacity-20 transform -rotate-[165deg] scale-90">
            <BotanicalCornerSprig className="w-36 h-36 text-[#A4B3A1]" />
          </div>

          {/* 1. TOP TYPOGRAPHY GROUP (Culturally authentic & editorial) */}
          <div className="relative z-10 pt-3 sm:pt-6 text-center max-w-xl mx-auto flex flex-col items-center">
            
            {/* Sacred Hindi Invocation in Pure Devanagari */}
            <div className="flex items-center justify-center gap-2 mb-1.5">
              <span className="w-6 h-[1px] bg-gradient-to-r from-transparent to-[#C3A56B]/60" />
              <h2 className="font-devanagari text-xs sm:text-sm font-normal text-[#C3A56B] tracking-normal leading-relaxed drop-shadow-sm">
                ॥ श्री गणेशाय नमः ॥
              </h2>
              <span className="w-6 h-[1px] bg-gradient-to-l from-transparent to-[#C3A56B]/60" />
            </div>

            {/* Editorial Eyebrow Subtitle */}
            <p className="font-cormorant uppercase text-[11px] sm:text-xs tracking-[0.28em] text-[#F5F0E5]/80 font-normal mt-0.5">
              A Love Story Begins
            </p>

            {/* Romantic Calligraphic Couple Names */}
            <h1
              style={{ fontFamily: "'Pinyon Script', 'Great Vibes', cursive" }}
              className="text-5xl sm:text-7xl md:text-8xl text-[#F5F0E5] font-normal leading-tight drop-shadow-md py-1"
            >
              Tanishq <span className="font-cormorant italic text-3xl sm:text-4xl text-[#C3A56B] font-light">&amp;</span> Shivangee
            </h1>
          </div>

          {/* 2. CENTER HERO ENVELOPE WITH CUSTOM MONOGRAM WAX SEAL */}
          <div className="relative z-10 my-auto w-full max-w-md sm:max-w-lg aspect-[1.48/1] flex items-center justify-center">
            
            {/* Delicate Botanical Sprigs Draping over the envelope corners */}
            <div className="absolute -top-8 -right-8 sm:-top-10 sm:-right-10 z-30 pointer-events-none transform rotate-12 scale-100 sm:scale-110 drop-shadow-md">
              <BotanicalCornerSprig className="w-32 h-32 sm:w-40 sm:h-40" />
            </div>
            <div className="absolute -bottom-8 -left-8 sm:-bottom-10 sm:-left-10 z-30 pointer-events-none transform -rotate-[165deg] scale-100 sm:scale-110 drop-shadow-md">
              <BotanicalCornerSprig className="w-32 h-32 sm:w-40 sm:h-40" />
            </div>

            {/* Main Envelope Body */}
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-full rounded-2xl shadow-envelope overflow-hidden bg-[#EAE2D3] border border-[#C3A56B]/25"
            >
              {/* Paper Grain on Envelope */}
              <div className="absolute inset-0 bg-[#EAE2D3] opacity-95" />
              <div className="absolute inset-0 bg-paper-texture opacity-35 pointer-events-none" />

              {/* Lower Flaps & Creases (Triangular Geometry) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                {/* Left side triangle */}
                <polygon points="0,0 0,100 50,56" fill="#E4DBCB" opacity="0.95" />
                {/* Right side triangle */}
                <polygon points="100,0 100,100 50,56" fill="#DFD6C5" opacity="0.95" />
                {/* Bottom flap triangle */}
                <polygon points="0,100 100,100 50,56" fill="#E8DFD0" />
                {/* Crease line shadows */}
                <line x1="0" y1="0" x2="50%" y2="56%" stroke="rgba(52,63,53,0.06)" strokeWidth="1" />
                <line x1="100%" y1="0" x2="50%" y2="56%" stroke="rgba(52,63,53,0.07)" strokeWidth="1" />
                <line x1="0" y1="100%" x2="50%" y2="56%" stroke="rgba(52,63,53,0.06)" strokeWidth="1.2" />
                <line x1="100%" y1="100%" x2="50%" y2="56%" stroke="rgba(52,63,53,0.08)" strokeWidth="1.2" />
              </svg>

              {/* RISING INVITATION CARD (Revealed when flap opens) */}
              <motion.div
                initial={{ y: '25%', opacity: 0 }}
                animate={cardRising ? { y: '-42%', opacity: 1 } : { y: '25%', opacity: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-x-5 top-4 bottom-4 rounded-xl bg-[#FDFBF7] border border-[#C3A56B]/40 shadow-xl p-5 text-center flex flex-col items-center justify-center z-15 pointer-events-none"
              >
                <div className="w-full h-full border border-[#C3A56B]/30 rounded-lg p-3 flex flex-col items-center justify-center bg-paper-texture">
                  <span className="font-devanagari text-[10px] text-[#A78343] tracking-normal mb-1">
                    ॥ श्री गणेशाय नमः ॥
                  </span>
                  
                  {/* Monogram crest on card */}
                  <img
                    src="/monogram_gold_transparent.png"
                    alt="Tanishq &amp; Shivangee Crest"
                    className="w-12 h-16 object-contain my-1 drop-shadow-sm"
                  />
                  
                  <span
                    style={{ fontFamily: "'Pinyon Script', cursive" }}
                    className="text-2xl sm:text-3xl text-[#343F35] block"
                  >
                    Tanishq &amp; Shivangee
                  </span>
                  <span className="font-cormorant uppercase text-[9px] sm:text-[10px] tracking-[0.25em] text-[#657968] mt-1 font-semibold">
                    14th – 15th February 2027
                  </span>
                  <span className="font-cormorant italic text-[10px] sm:text-[11px] text-[#A78343]">
                    The Waterstone Resort • Chhindwara
                  </span>
                </div>
              </motion.div>

              {/* TOP FLAP (Folds open upward in 3D perspective) */}
              <motion.div
                animate={isOpening ? { rotateX: -175, zIndex: 5 } : { rotateX: 0 }}
                transition={{ duration: 0.85, ease: 'easeInOut' }}
                style={{ transformOrigin: 'top center', perspective: 1200 }}
                className="absolute top-0 inset-x-0 h-[62%] pointer-events-none z-20 flap-shadow"
              >
                <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="w-full h-full drop-shadow-md">
                  <polygon
                    points="0,0 100,0 50,59"
                    fill="#EFE8DB"
                    stroke="rgba(195, 165, 107, 0.25)"
                    strokeWidth="0.5"
                  />
                </svg>
              </motion.div>

              {/* BESPOKE ANTIQUE GOLD WAX SEAL (Centered at flap's apex) */}
              <div className="absolute top-[56%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
                <motion.button
                  onClick={handleSealClick}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  className="relative group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C3A56B]/50 rounded-full"
                  aria-label="Click to Open Wedding Invitation Envelope"
                >
                  {/* The Bespoke Antique Gold Wax Seal with Custom Monogram */}
                  <motion.div
                    animate={isOpening ? { scale: [1, 1.14, 0.95], rotate: [0, -3, 3, 0] } : {}}
                    transition={{ duration: 0.5 }}
                    className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center drop-shadow-2xl"
                  >
                    <img
                      src="/wax_seal_custom.png"
                      alt="Tanishq &amp; Shivangee Custom Antique Gold Wax Seal"
                      className="w-full h-full object-contain filter drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Subtle pulsing aura ring on hover */}
                    <motion.div
                      animate={{ scale: [1, 1.25, 1], opacity: [0.55, 0.05, 0.55] }}
                      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inset-0 -m-2 rounded-full border border-[#C3A56B]/60 pointer-events-none"
                    />
                  </motion.div>
                </motion.button>
              </div>

            </motion.div>
          </div>

          {/* 3. BOTTOM CALL-TO-ACTION & HAND-DRAWN ARROW */}
          <div className="relative z-10 pb-3 sm:pb-6 text-center flex flex-col items-center">
            <div className="relative inline-flex items-center justify-center">
              <motion.button
                onClick={handleSealClick}
                whileHover={{ y: -2 }}
                className="font-cormorant uppercase text-xs sm:text-sm tracking-[0.25em] text-[#F5F0E5] hover:text-[#C3A56B] transition-colors py-2 px-5 rounded-full border border-[#C3A56B]/30 bg-white/5 backdrop-blur-sm shadow-sm"
              >
                Click to Open Invitation
              </motion.button>

              {/* Hand-drawn curved arrow pointing up at the seal */}
              <div className="absolute -right-10 sm:-right-14 bottom-1 pointer-events-none opacity-85">
                <HandDrawnArrow className="w-8 h-8 sm:w-10 sm:h-10 text-[#C3A56B]" />
              </div>
            </div>

            <p className="text-[10px] font-sans tracking-widest uppercase text-[#F5F0E5]/65 mt-2">
              14th – 15th February 2027 • The Waterstone Resort, Chhindwara
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
