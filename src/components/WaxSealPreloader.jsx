import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BotanicalCornerSprig, HandDrawnArrow } from './BespokeIcons';
import { royalAudioEngine } from './AudioPlayer';
import { triggerFloralShower } from './FloralPetalsEngine';

export default function WaxSealPreloader({ onOpenInvitation, initialOpen = false }) {
  const [isOpen, setIsOpen] = useState(initialOpen);
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

    // 2. Trigger romantic floral petal shower (white jasmine, ivory, blush petals & sage leaves)
    try {
      triggerFloralShower();
    } catch (e) {
      console.warn('Floral shower animation:', e);
    }

    // 3. Card rises smoothly out of envelope
    setTimeout(() => {
      setCardRising(true);
    }, 400);

    // 4. Smooth transition into main wedding experience
    setTimeout(() => {
      setIsOpen(true);
      if (onOpenInvitation) {
        onOpenInvitation();
      }
    }, 1600);
  };

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          key="botanical-envelope-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 h-[100dvh] max-h-[100dvh] w-screen overflow-hidden flex flex-col items-center justify-between py-2 sm:py-3.5 px-3 sm:px-4 bg-heritage-atmosphere select-none box-border"
        >
          {/* Background Ambient Glow & Paper Texture (Strictly Clipped Within Viewport) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-paper-texture opacity-20" />
            <div className="absolute -top-32 -left-32 w-[34rem] h-[34rem] rounded-full bg-[#527060]/20 blur-3xl" />
            <div className="absolute -bottom-32 -right-32 w-[34rem] h-[34rem] rounded-full bg-[#1B2821]/50 blur-3xl" />

            {/* Faint Botanical Corner Silhouettes */}
            <div className="absolute top-3 left-3 opacity-20 transform rotate-12 scale-75 sm:scale-90">
              <BotanicalCornerSprig className="w-32 h-32 sm:w-36 sm:h-36 text-[#A4B3A1]" />
            </div>
            <div className="absolute bottom-3 right-3 opacity-20 transform -rotate-[165deg] scale-75 sm:scale-90">
              <BotanicalCornerSprig className="w-32 h-32 sm:w-36 sm:h-36 text-[#A4B3A1]" />
            </div>
          </div>

          {/* 1. TOP TYPOGRAPHY GROUP (Culturally authentic & editorial) */}
          <div className="relative z-10 pt-1 sm:pt-2 text-center max-w-2xl mx-auto flex flex-col items-center flex-shrink-0">
            
            {/* Sacred Hindi Invocation in Pure Devanagari */}
            <div className="flex items-center justify-center gap-2 mb-0.5 sm:mb-1">
              <span className="w-5 sm:w-8 h-[1px] bg-gradient-to-r from-transparent to-[#C3A56B]/70" />
              <h2 className="font-devanagari text-xs sm:text-sm font-normal text-[#C3A56B] tracking-normal leading-relaxed drop-shadow-sm">
                ॥ श्री गणेशाय नमः ॥
              </h2>
              <span className="w-5 sm:w-8 h-[1px] bg-gradient-to-l from-transparent to-[#C3A56B]/70" />
            </div>

            {/* Editorial Eyebrow Subtitle */}
            <p className="font-cormorant uppercase text-[9px] sm:text-[11px] tracking-[0.3em] text-[#F5F0E5]/80 font-normal">
              A Love Story Begins
            </p>

            {/* Romantic Calligraphic Couple Names - One Single Horizontal Line */}
            <h1
              style={{ fontFamily: "'Pinyon Script', 'Great Vibes', cursive" }}
              className="text-2xl sm:text-4xl md:text-5xl lg:text-[3.75rem] text-[#F5F0E5] font-normal leading-tight drop-shadow-md py-0.5 whitespace-nowrap tracking-wide"
            >
              Tanishq <span className="font-cormorant italic text-xl sm:text-2xl md:text-3xl text-[#C3A56B] mx-1 sm:mx-2 font-light">&amp;</span> Shivangee
            </h1>
          </div>

          {/* 2. CENTER HERO ENVELOPE WITH CUSTOM MONOGRAM WAX SEAL */}
          <div className="relative z-10 my-auto w-[92vw] max-w-[490px] aspect-[1.54/1] flex items-center justify-center flex-shrink">
            
            {/* Delicate Botanical Sprigs Draping over the envelope corners */}
            <div className="absolute -top-6 -right-6 sm:-top-8 sm:-right-8 z-30 pointer-events-none transform rotate-12 scale-90 sm:scale-105 drop-shadow-md">
              <BotanicalCornerSprig className="w-28 h-28 sm:w-36 sm:h-36" />
            </div>
            <div className="absolute -bottom-6 -left-6 sm:-bottom-8 sm:-left-8 z-30 pointer-events-none transform -rotate-[165deg] scale-90 sm:scale-105 drop-shadow-md">
              <BotanicalCornerSprig className="w-28 h-28 sm:w-36 sm:h-36" />
            </div>

            {/* Main Envelope Body */}
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-full rounded-2xl shadow-envelope overflow-hidden bg-[#EAE2D3] border border-[#C3A56B]/25"
            >
              {/* Envelope Back Interior Lining */}
              <div className="absolute inset-0 bg-[#EFE8DC]" />
              <div className="absolute inset-0 bg-paper-texture opacity-30 pointer-events-none" />

              {/* RISING INVITATION CARD (Revealed when flap opens) */}
              <motion.div
                initial={{ y: '25%', opacity: 0 }}
                animate={cardRising ? { y: '-44%', opacity: 1 } : { y: '25%', opacity: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-x-4 top-3 bottom-3 rounded-xl bg-[#FDFBF7] border border-[#C3A56B]/40 shadow-xl p-4 sm:p-5 text-center flex flex-col items-center justify-center z-10 pointer-events-none"
              >
                <div className="w-full h-full border border-[#C3A56B]/30 rounded-lg p-2.5 sm:p-3 flex flex-col items-center justify-center bg-paper-texture">
                  <span className="font-devanagari text-[9px] sm:text-[10px] text-[#A78343] tracking-normal mb-0.5">
                    ॥ श्री गणेशाय नमः ॥
                  </span>
                  
                  {/* Monogram crest on card */}
                  <img
                    src="/monogram_gold_transparent.png"
                    alt="Tanishq &amp; Shivangee Crest"
                    className="w-10 h-14 sm:w-12 sm:h-16 object-contain my-0.5 sm:my-1 drop-shadow-sm"
                  />
                  
                  <span
                    style={{ fontFamily: "'Pinyon Script', cursive" }}
                    className="text-xl sm:text-2xl md:text-3xl text-[#343F35] block"
                  >
                    Tanishq &amp; Shivangee
                  </span>
                  <span className="font-cormorant uppercase text-[8px] sm:text-[10px] tracking-[0.25em] text-[#657968] mt-0.5 font-semibold">
                    14th – 15th February 2027
                  </span>
                  <span className="font-cormorant italic text-[9px] sm:text-[11px] text-[#A78343]">
                    The Waterstone Resort • Chhindwara
                  </span>
                </div>
              </motion.div>

              {/* Lower Pocket Flaps & Creases (Scaled with viewBox="0 0 100 100") */}
              <svg 
                viewBox="0 0 100 100" 
                preserveAspectRatio="none" 
                className="absolute inset-0 w-full h-full pointer-events-none z-20"
              >
                {/* Left side pocket flap */}
                <polygon points="0,0 0,100 50,56" fill="#E4DBCB" opacity="0.95" />
                {/* Right side pocket flap */}
                <polygon points="100,0 100,100 50,56" fill="#DFD6C5" opacity="0.95" />
                {/* Bottom flap joining both sides */}
                <polygon points="0,100 100,100 50,56" fill="#E8DFD0" />
                
                {/* Subtle natural paper crease shadows */}
                <line x1="0" y1="0" x2="50" y2="56" stroke="rgba(52,63,53,0.08)" strokeWidth="0.8" />
                <line x1="100" y1="0" x2="50" y2="56" stroke="rgba(52,63,53,0.08)" strokeWidth="0.8" />
                <line x1="0" y1="100" x2="50" y2="56" stroke="rgba(52,63,53,0.09)" strokeWidth="0.9" />
                <line x1="100" y1="100" x2="50" y2="56" stroke="rgba(52,63,53,0.09)" strokeWidth="0.9" />
              </svg>

              {/* TOP FLAP (Folds open upward in 3D perspective) */}
              <motion.div
                animate={isOpening ? { rotateX: -175, zIndex: 5 } : { rotateX: 0 }}
                transition={{ duration: 0.85, ease: 'easeInOut' }}
                style={{ transformOrigin: 'top center', perspective: 1200 }}
                className="absolute top-0 inset-x-0 h-[56%] pointer-events-none z-25 flap-shadow"
              >
                <svg viewBox="0 0 100 56" preserveAspectRatio="none" className="w-full h-full drop-shadow-md">
                  <polygon
                    points="0,0 100,0 50,56"
                    fill="#EFE8DB"
                    stroke="rgba(195, 165, 107, 0.25)"
                    strokeWidth="0.6"
                  />
                </svg>
              </motion.div>

              {/* BESPOKE ANTIQUE GOLD WAX SEAL (Delicate luxury stationery proportions) */}
              <div className="absolute top-[56%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
                <motion.button
                  onClick={handleSealClick}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  className="relative group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C3A56B]/50 rounded-full"
                  aria-label="Click to Open Wedding Invitation Envelope"
                >
                  {/* The Bespoke Antique Gold Wax Seal with Custom Monogram */}
                  <motion.div
                    animate={isOpening ? { scale: [1, 1.12, 0.96], rotate: [0, -3, 3, 0] } : {}}
                    transition={{ duration: 0.5 }}
                    className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-[4.6rem] md:h-[4.6rem] rounded-full flex items-center justify-center drop-shadow-[0_4px_12px_rgba(30,45,37,0.32)]"
                  >
                    <img
                      src="/wax_seal_custom.png"
                      alt="Tanishq &amp; Shivangee Custom Antique Gold Wax Seal"
                      className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Subtle delicate pulsing aura ring */}
                    <motion.div
                      animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0.05, 0.4] }}
                      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inset-0 -m-1 rounded-full border border-[#C3A56B]/50 pointer-events-none"
                    />
                  </motion.div>
                </motion.button>
              </div>

            </motion.div>
          </div>

          {/* 3. BOTTOM CALL-TO-ACTION & HAND-DRAWN ARROW */}
          <div className="relative z-10 pb-1.5 sm:pb-3 text-center flex flex-col items-center flex-shrink-0">
            <div className="relative inline-flex items-center justify-center">
              <motion.button
                onClick={handleSealClick}
                whileHover={{ y: -2 }}
                className="font-cormorant uppercase text-xs sm:text-sm tracking-[0.25em] text-[#F5F0E5] hover:text-[#C3A56B] transition-colors py-1.5 px-4 sm:px-5 rounded-full border border-[#C3A56B]/30 bg-white/5 backdrop-blur-sm shadow-sm"
              >
                Click to Open Invitation
              </motion.button>

              {/* Hand-drawn curved arrow pointing up at the seal */}
              <div className="absolute -right-8 sm:-right-11 bottom-0.5 pointer-events-none opacity-85">
                <HandDrawnArrow className="w-6 h-6 sm:w-8 sm:h-8 text-[#C3A56B]" />
              </div>
            </div>

            <p className="text-[9px] sm:text-[10px] font-sans tracking-widest uppercase text-[#F5F0E5]/65 mt-1">
              14th – 15th February 2027 • The Waterstone Resort, Chhindwara
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
