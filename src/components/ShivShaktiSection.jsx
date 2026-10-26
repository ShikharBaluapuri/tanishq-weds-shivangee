import React from 'react';
import { motion } from 'framer-motion';
import { BotanicalDivider, BotanicalCornerSprig, SacredLotus, CrescentMoonStar } from './BespokeIcons';

/**
 * Shiv–Shakti Sacred Union Section
 * Architecture:
 * - Lord Shiva and Goddess Parvati
 * - Beautiful muted sage-green tones (#1F2C24 / #28382E)
 * - Antique-gold circular linework & halo detailing
 * - Subtle ivory floating petals & delicate botanical vines
 * - Ceremonial Devanagari typography ("शिव और शक्ति")
 * - English subtitle ("A Sacred Union") & poetic supporting contemplation
 * - Mahakavi Kalidasa's Raghuvamsham (1.1) Sanskrit verse
 * - Respects prefers-reduced-motion
 */
export default function ShivShaktiSection() {
  const EASE = [0.16, 1, 0.3, 1];

  return (
    <section 
      id="divine-union"
      aria-label="Divine Union of Shiva and Shakti"
      className="relative py-24 sm:py-32 px-4 sm:px-6 bg-[#1F2C24] text-[#F5F0E5] overflow-hidden bg-paper-texture border-y border-[#C3A56B]/30"
      style={{ backgroundColor: '#1F2C24' }}
    >
      {/* 1. SECTION BACKGROUND AMBIENCE & GOLD RADIAL GLOW */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Soft Radial Gold Ambient Lighting */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[48rem] h-[48rem] rounded-full pointer-events-none opacity-40 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(195, 165, 107, 0.22) 0%, rgba(65, 88, 76, 0.15) 45%, transparent 70%)'
          }}
        />

        {/* 2. FINE GOLD CIRCULAR ORNAMENT / MANDALA HAIRLINE (Reveals gently on scroll) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.88 }}
          whileInView={{ opacity: 0.25, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.4, delay: 0.2, ease: EASE }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        >
          <svg viewBox="0 0 600 600" className="w-[34rem] sm:w-[44rem] h-[34rem] sm:h-[44rem] text-[#C3A56B]">
            {/* Outer Concentric Celestial Circles */}
            <circle cx="300" cy="300" r="280" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" opacity="0.6" />
            <circle cx="300" cy="300" r="240" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.8" />
            <circle cx="300" cy="300" r="200" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="8 4" opacity="0.5" />
            <circle cx="300" cy="300" r="150" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />

            {/* Sacred Radial Rays of Grace */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <line
                key={deg}
                x1="300"
                y1="30"
                x2="300"
                y2="55"
                transform={`rotate(${deg} 300 300)`}
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.7"
              />
            ))}
          </svg>
        </motion.div>

        {/* 4. DELICATE BOTANICAL VINES (Appear softly) */}
        <motion.div 
          initial={{ opacity: 0, rotate: 6 }}
          whileInView={{ opacity: 0.35, rotate: 12 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 1.2, delay: 0.4, ease: EASE }}
          className="absolute top-6 left-6 sm:top-12 sm:left-12 pointer-events-none"
        >
          <BotanicalCornerSprig className="w-36 sm:w-48 h-36 sm:h-48 text-[#A4B3A1]" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, rotate: -155 }}
          whileInView={{ opacity: 0.35, rotate: -165 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 1.2, delay: 0.4, ease: EASE }}
          className="absolute bottom-6 right-6 sm:bottom-12 sm:right-12 pointer-events-none"
        >
          <BotanicalCornerSprig className="w-36 sm:w-48 h-36 sm:h-48 text-[#A4B3A1]" />
        </motion.div>

        {/* 7. FLOATING IVORY PETALS (Drifting gently through the composition) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            { top: '15%', left: '12%', size: 14, delay: 0, duration: 7 },
            { top: '28%', right: '14%', size: 18, delay: 2, duration: 8.5 },
            { top: '65%', left: '8%', size: 16, delay: 3.5, duration: 9 },
            { top: '78%', right: '10%', size: 15, delay: 1, duration: 7.5 },
            { top: '48%', left: '85%', size: 12, delay: 4, duration: 8 }
          ].map((petal, idx) => (
            <motion.div
              key={idx}
              initial={{ y: -10, opacity: 0, rotate: 0 }}
              animate={{ 
                y: [0, 25, 0], 
                x: [0, (idx % 2 === 0 ? 12 : -12), 0],
                rotate: [0, (idx % 2 === 0 ? 18 : -18), 0],
                opacity: [0.35, 0.75, 0.35]
              }}
              transition={{
                duration: petal.duration,
                delay: petal.delay,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="absolute pointer-events-none"
              style={{
                top: petal.top,
                left: petal.left,
                right: petal.right
              }}
            >
              <svg width={petal.size} height={petal.size * 1.3} viewBox="0 0 20 26" fill="none">
                <path
                  d="M10 0 C18 6, 20 18, 10 26 C0 18, 2 6, 10 0 Z"
                  fill="rgba(245, 240, 229, 0.75)"
                  stroke="rgba(195, 165, 107, 0.4)"
                  strokeWidth="0.5"
                />
              </svg>
            </motion.div>
          ))}
        </div>
      </div>

      {/* MAIN EDITORIAL CONTENT CONTAINER */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        
        {/* 5. CEREMONIAL VEDIC INVOCATION & 6. HINDI HEADING REVEAL */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          className="flex flex-col items-center justify-center mb-6"
        >
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#C3A56B]/35 backdrop-blur-md mb-3 shadow-xs">
            <CrescentMoonStar className="w-3.5 h-3.5 text-[#C3A56B]" />
            <span className="font-devanagari text-xs sm:text-sm text-[#E2CA94] tracking-normal font-normal">
              ॥ ॐ नमः शिवाय ॥
            </span>
            <SacredLotus className="w-3.5 h-3.5 text-[#C3A56B]" />
          </div>

          {/* Hindi Heading: "शिव और शक्ति" (Never split characters; authentic Devanagari typography) */}
          <h2 className="font-devanagari text-3xl sm:text-4xl md:text-5xl text-[#FAF6EE] font-normal tracking-wide drop-shadow-sm mt-1">
            शिव और शक्ति
          </h2>
          
          {/* English Subtitle: "A Sacred Union" */}
          <h3 className="font-cormorant uppercase text-sm sm:text-base md:text-lg tracking-[0.28em] text-[#C3A56B] font-medium mt-1.5">
            A Sacred Union
          </h3>

          {/* Suggested Supporting Text */}
          <p className="font-cormorant italic text-base sm:text-lg md:text-xl text-[#EAE2D3] mt-2 max-w-xl mx-auto leading-relaxed">
            &ldquo;Two souls, one journey, blessed by the eternal harmony of Shiv and Shakti.&rdquo;
          </p>
        </motion.div>

        {/* 3. SHIV–SHAKTI ARTWORK PRESENTATION CARD (Fades in with subtle upward movement) */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.0, delay: 0.25, ease: EASE }}
          className="relative bg-[#FAF8F2] text-[#343F35] rounded-3xl p-6 sm:p-10 md:p-14 border border-[#C3A56B]/40 shadow-2xl overflow-hidden bg-paper-texture"
        >
          {/* Delicate Double Gold Hairline Stationery Borders */}
          <div className="absolute inset-3 sm:inset-4 border border-[#C3A56B]/30 rounded-2xl pointer-events-none" />
          <div className="absolute inset-5 sm:inset-6 border border-[#C3A56B]/15 rounded-xl pointer-events-none" />

          {/* Central Artwork Presentation Altar */}
          <div className="max-w-md mx-auto mb-8 relative">
            {/* Luminous soft halo behind artwork */}
            <div className="absolute inset-0 rounded-2xl bg-[#C3A56B]/15 blur-xl -z-10 transform scale-105" />

            <div className="relative rounded-2xl overflow-hidden border border-[#C3A56B]/50 shadow-xl group bg-[#FAF6EE] p-2 sm:p-2.5">
              <img
                src="/shiv_shakti_union.jpg"
                alt="Lord Shiva and Goddess Parvati — Sacred Bond of Shiv-Shakti"
                className="w-full h-auto rounded-xl object-contain filter contrast-[1.02] transition-transform duration-700 group-hover:scale-[1.015]"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-[#FAF8F2]/30 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Subtle Editorial Caption */}
            <span className="font-cormorant uppercase text-[10px] sm:text-[11px] tracking-[0.25em] text-[#657968] font-semibold mt-3.5 block">
              Symbol of Inseparable Devotion &amp; Divine Harmony
            </span>
          </div>

          {/* Classical Kalidasa Shloka (Mahakavi Kalidasa's Raghuvamsham 1.1) */}
          <div className="my-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-[#C3A56B]/70" />
              <span className="font-devanagari text-xs text-[#A78343]">॥ श्लोक ॥</span>
              <span className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-[#C3A56B]/70" />
            </div>

            <p className="font-devanagari text-base sm:text-xl md:text-2xl text-[#343F35] font-normal leading-relaxed sm:leading-loose tracking-wide">
              वागर्थाविव सम्पृक्तौ वागर्थप्रतिपत्तये ।<br className="hidden sm:inline" />
              जगतः पितरौ वन्दे पार्वतीपरमेश्वरौ ॥
            </p>

            <span className="font-cormorant italic text-[11px] sm:text-xs text-[#A78343] block mt-2">
              — महाकवि कालिदास, रघुवंशम् (१.१)
            </span>
          </div>

          <BotanicalDivider className="w-full max-w-xs mx-auto my-6 text-[#C3A56B]" />

          {/* Poetic English Contemplation on Marriage */}
          <div className="max-w-xl mx-auto space-y-3 text-[#343F35]">
            <p className="font-cormorant italic text-base sm:text-lg leading-relaxed text-[#41584C]">
              &ldquo;Just as word and its meaning dwell in inseparable oneness, united to bring forth truth and understanding, so do two souls unite in the sacred bond of marriage.&rdquo;
            </p>
            
            <p className="font-sans text-xs sm:text-sm text-[#657968] leading-relaxed max-w-lg mx-auto">
              In celebrating Tanishq &amp; Shivangee, we honour this timeless union of strength and grace, stillness and movement, eternal devotion and unyielding companionship.
            </p>
          </div>

          {/* Symbolic Divine Harmony Triad */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-8 pt-6 border-t border-[#C3A56B]/25 max-w-2xl mx-auto">
            {/* Aspect 1: Shiva */}
            <div className="p-3.5 rounded-2xl bg-white/70 border border-[#C3A56B]/20 text-center">
              <CrescentMoonStar className="w-5 h-5 text-[#A78343] mx-auto mb-1.5" />
              <h4 className="font-cormorant uppercase tracking-[0.2em] text-xs font-semibold text-[#343F35]">
                Shiva • Consciousness
              </h4>
              <p className="text-[11px] font-cormorant italic text-[#657968] mt-0.5">
                The calm steadfast foundation of eternal truth &amp; serenity.
              </p>
            </div>

            {/* Aspect 2: Sacred Confluence */}
            <div className="p-3.5 rounded-2xl bg-[#EAE2D3]/40 border border-[#C3A56B]/30 text-center">
              <div className="w-5 h-5 rounded-full border border-[#C3A56B] mx-auto mb-1.5 flex items-center justify-center text-[10px] text-[#A78343] font-serif">
                ॐ
              </div>
              <h4 className="font-cormorant uppercase tracking-[0.2em] text-xs font-semibold text-[#343F35]">
                Ardhanarishvara
              </h4>
              <p className="text-[11px] font-cormorant italic text-[#657968] mt-0.5">
                The sublime union where two distinct paths become one destiny.
              </p>
            </div>

            {/* Aspect 3: Shakti */}
            <div className="p-3.5 rounded-2xl bg-white/70 border border-[#C3A56B]/20 text-center">
              <SacredLotus className="w-5 h-5 text-[#A78343] mx-auto mb-1.5" />
              <h4 className="font-cormorant uppercase tracking-[0.2em] text-xs font-semibold text-[#343F35]">
                Shakti • Prakriti
              </h4>
              <p className="text-[11px] font-cormorant italic text-[#657968] mt-0.5">
                The vibrant grace, warmth, creativity &amp; boundless love.
              </p>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
