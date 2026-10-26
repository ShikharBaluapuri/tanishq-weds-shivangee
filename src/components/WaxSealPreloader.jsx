import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DelicateBotanicalSprig, HandDrawnArrow } from './BespokeIcons';
import BlendedWaxSeal from './BlendedWaxSeal';
import { triggerFlowerPetals } from '../services/flowerPetalEngine';
import { royalAudioEngine } from './AudioPlayer';

export default function WaxSealPreloader({ onOpenInvitation }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleSealClick = () => {
    if (isOpening || isOpen) return;
    setIsOpening(true);

    // 1. Play soothing ambient wedding music (Din Shagna Da / Shehnai)
    try {
      royalAudioEngine.start();
    } catch (e) {
      console.warn('Audio auto-start on gesture:', e);
    }

    // 2. Trigger gentle romantic falling botanical flower petals
    triggerFlowerPetals('royal', 65);

    // 3. Complete opening transition
    setTimeout(() => {
      setIsOpen(true);
      if (onOpenInvitation) {
        onOpenInvitation();
      }
    }, 1100);
  };

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          key="everafter-envelope-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 h-screen w-screen overflow-hidden flex flex-col items-center justify-between py-8 sm:py-10 px-6 select-none text-[#FAF8F5] bg-[#120E0B]"
        >
          {/* Full-Bleed Dimmed Engagement Hands & Ring Photo */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img
              src="/couple-hands.jpg"
              onError={(e) => {
                if (!e.target.dataset.tried) {
                  e.target.dataset.tried = '1';
                  e.target.src = '/IMG_8814.JPG.jpg';
                }
              }}
              alt="Tanishq & Shivangee Engagement"
              className="w-full h-full object-cover object-[50%_70%] scale-[1.08]"
              style={{ filter: 'brightness(0.46) contrast(1.08) saturate(0.85) sepia(0.12)' }}
            />
          </div>

          {/* 3-Layer Cinematic Blending Overlays */}
          {/* Overlay 1: Top Vignette Mask */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_65%,transparent_15%,rgba(14,11,9,0.75)_85%)] pointer-events-none" />
          
          {/* Overlay 2: Vertical Warm Espresso Dimmer */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#120E0B]/80 via-[#1A1410]/45 to-[#120E0B]/85 pointer-events-none" />

          {/* Depth of Field Blur */}
          <div className="absolute inset-0 backdrop-blur-[3px] pointer-events-none" />

          {/* Ultra-subtle fine cotton-rag paper grain overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.035]"
            style={{
              backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px)`,
              backgroundSize: '18px 18px'
            }}
          />

          {/* Gentle warm ambient candlelight glow behind the envelope */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] rounded-full bg-[#D6B476]/10 blur-[130px] pointer-events-none" />

          {/* 1. TOP TWO-TONE EDITORIAL TYPOGRAPHY (Above Envelope) */}
          <div className="relative z-20 text-center max-w-2xl mx-auto flex flex-col items-center flex-shrink-0 pt-2 sm:pt-4">
            {/* Sacred Invocation & Date Kicker */}
            <span className="font-cormorant uppercase text-[10px] md:text-[11px] tracking-[0.38em] text-[#E8DFD1]/80 mb-3 block text-center font-normal">
              ।। श्री गणेशाय नमः ।।   •   14TH – 15TH FEBRUARY 2027
            </span>

            {/* Signature "EverAfter" Two-Tone Headline (Tanishq & Shivangee) */}
            <div className="flex items-baseline justify-center whitespace-nowrap mb-5 sm:mb-7">
              <span className="font-cormorant font-normal text-[clamp(2.5rem,5vw,4.25rem)] text-[#FAF8F5] tracking-[0.02em] drop-shadow-[0_4px_20px_rgba(0,0,0,0.45)]">
                Tanishq
              </span>
              <span className="font-cormorant italic font-light text-[clamp(2.2rem,4.2vw,3.6rem)] text-[#D6B476] mx-3 select-none">
                &amp;
              </span>
              <span className="font-cormorant italic font-normal text-[clamp(2.5rem,5vw,4.25rem)] text-[#D6B476] tracking-[0.02em] drop-shadow-[0_4px_20px_rgba(0,0,0,0.45)]">
                Shivangee
              </span>
            </div>
          </div>

          {/* 2. MINIMALIST TACTILE ENVELOPE (Pure Paper Shadows & Candlelight Glow) */}
          <div className="relative z-20 w-[86vw] max-w-[440px] aspect-[1.48/1] mx-auto my-auto flex items-center justify-center">
            
            {/* Delicate Botanical Gypsophila & Olive/Eucalyptus Sprig (Top-Right Flap Edge) */}
            <div className="absolute -top-7 -right-7 sm:-top-9 sm:-right-9 z-25 pointer-events-none transform rotate-[8deg] scale-95 sm:scale-105 drop-shadow-md">
              <DelicateBotanicalSprig className="w-28 h-28 sm:w-34 sm:h-34" />
            </div>

            {/* Delicate Botanical Gypsophila & Olive/Eucalyptus Sprig (Bottom-Left Corner) */}
            <div className="absolute -bottom-7 -left-7 sm:-bottom-9 sm:-left-9 z-25 pointer-events-none transform -rotate-[168deg] scale-95 sm:scale-105 drop-shadow-md">
              <DelicateBotanicalSprig className="w-28 h-28 sm:w-34 sm:h-34" isFlipped />
            </div>

            {/* Envelope Main Elevation Candlelight Shadow & Tactile Paper Base */}
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="w-full h-full rounded-2xl overflow-hidden relative bg-[#F2EFE9] border border-[#FAF8F5]/60 shadow-[0_35px_70px_-15px_rgba(0,0,0,0.75),0_0_40px_rgba(214,180,118,0.12)]"
            >
              {/* Deep Royal Sapphire Blue Inner Velvet Liner */}
              <div className="absolute inset-0 bg-[#0C223B] opacity-95" />

              {/* Rising Warm Ivory Physical Invitation Card */}
              <motion.div
                initial={{ y: 0, opacity: 0 }}
                animate={isOpening ? { y: -76, opacity: 1, scale: 1.02 } : { y: 0, opacity: 0 }}
                transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                className="absolute inset-x-3 sm:inset-x-5 top-2 bottom-3 rounded-xl bg-[#FAF8F5] p-5 flex flex-col items-center justify-center text-center z-10 pointer-events-none shadow-[0_18px_40px_rgba(12,34,59,0.35)] border border-[#E4DEC9]"
              >
                <span className="font-devanagari text-[9.5px] tracking-[0.3em] text-[#9A8052] uppercase mb-1">
                  ।। श्री गणेशाय नमः ।।
                </span>
                <span className="font-cormorant italic text-xs text-[#4A6278] tracking-wider mb-1">
                  Together with their families
                </span>
                <div className="flex items-baseline gap-2 text-xl sm:text-2xl text-[#0C223B] leading-tight">
                  <span className="font-cormorant italic font-medium">Tanishq</span>
                  <span className="font-pinyon text-[#B8A072] text-xl">&amp;</span>
                  <span className="font-cormorant italic font-medium">Shivangee</span>
                </div>
                <div className="w-12 h-[1px] bg-[#B8A072]/40 my-2" />
                <span className="font-cormorant uppercase text-[9px] tracking-[0.25em] text-[#9A8052] font-semibold">
                  14 • 15 FEBRUARY 2027 • THE WATERSTONE RESORT
                </span>
              </motion.div>

              {/* Lower Pocket: Warm Handmade Cotton Flaps defined ONLY by soft natural shadows */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-15">
                <svg 
                  viewBox="0 0 100 100" 
                  preserveAspectRatio="none" 
                  className="w-full h-full"
                >
                  <defs>
                    <filter id="naturalFlapShadowLeft" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="3" dy="2" stdDeviation="3" floodColor="#0C223B" floodOpacity="0.16" />
                    </filter>
                    <filter id="naturalFlapShadowRight" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="-3" dy="2" stdDeviation="3" floodColor="#0C223B" floodOpacity="0.16" />
                    </filter>
                    <filter id="naturalFlapShadowBottom" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="-3" stdDeviation="4" floodColor="#0C223B" floodOpacity="0.18" />
                    </filter>
                  </defs>

                  {/* Left flap */}
                  <polygon points="0,0 50,50 0,100" fill="#EAE6DC" filter="url(#naturalFlapShadowLeft)" />
                  {/* Right flap */}
                  <polygon points="100,0 50,50 100,100" fill="#E6E2D8" filter="url(#naturalFlapShadowRight)" />
                  {/* Bottom pocket flap */}
                  <polygon points="0,100 50,48 100,100" fill="#F2EFE9" filter="url(#naturalFlapShadowBottom)" />
                </svg>
              </div>

              {/* Top Triangular Flap (Softly Rounded Vertex, Natural Paper Shadow, Folds Open in 3D) */}
              <motion.div
                animate={isOpening ? { rotateX: -180, zIndex: 1 } : { rotateX: 0, zIndex: 18 }}
                transition={{ duration: 0.95, ease: [0.4, 0, 0.2, 1] }}
                style={{ transformOrigin: 'top center', perspective: 1200 }}
                className="absolute top-0 inset-x-0 h-[56%] pointer-events-none"
              >
                <svg 
                  viewBox="0 0 100 58" 
                  preserveAspectRatio="none" 
                  className="w-full h-full"
                  style={{ filter: 'drop-shadow(0 10px 16px rgba(12,34,59,0.22))' }}
                >
                  <path
                    d="M0 0 L100 0 L52 56 Q50 58 48 56 L0 0 Z"
                    fill="#F7F5EF"
                  />
                  <path
                    d="M0 0 L100 0 L52 55 Q50 57 48 55 L0 0 Z"
                    fill="none"
                    stroke="rgba(12,34,59,0.06)"
                    strokeWidth="0.5"
                  />
                </svg>
              </motion.div>
            </motion.div>

            {/* 3. PROGRAMMATIC CANVAS-BLENDED WAX SEAL (Zero Cropping, Zero Paper Box) */}
            <div className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 z-30">
              <BlendedWaxSeal onClick={handleSealClick} />
            </div>

          </div>

          {/* 4. BOTTOM FOOTER PROMPT (Understated Editorial Typography) */}
          <div className="relative z-20 text-center flex flex-col items-center flex-shrink-0">
            <div className="relative inline-flex items-center justify-center">
              <button
                type="button"
                onClick={handleSealClick}
                className="font-cormorant uppercase text-[11px] tracking-[0.35em] text-[#FAF8F5]/85 hover:text-white transition-colors py-1 cursor-pointer focus:outline-none"
              >
                CLICK SEAL TO OPEN INVITATION
              </button>

              {/* Delicate Curved Arrow */}
              <div className="absolute -right-8 -top-1 pointer-events-none opacity-80">
                <HandDrawnArrow className="w-7 h-7 text-[#D6B476]" />
              </div>
            </div>

            <span className="text-[9.5px] tracking-[0.28em] text-[#D6B476]/85 mt-1.5 font-sans uppercase">
              THE WATERSTONE RESORT, CHHINDWARA
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
