import React from 'react';
import { motion } from 'framer-motion';
import { BotanicalDivider, BotanicalCornerSprig, SacredLotus, CrescentMoonStar } from './BespokeIcons';

/**
 * Shiv–Shakti Thematic Section — Celebrating the Divine Union of Shiva and Shakti
 * Concept: Royal Indian Wedding × Shiv-Shakti Symbolism × Luxury Botanical Stationery × Cinematic Editorial Design
 * Traditional Verse: Mahakavi Kalidasa's Raghuvamsham (Canto 1, Verse 1)
 */
export default function ShivShaktiSection() {
  return (
    <section 
      id="divine-union"
      aria-label="Divine Union of Shiva and Shakti"
      className="relative py-24 sm:py-32 px-4 sm:px-6 bg-[#FBF8F2] overflow-hidden bg-paper-texture border-y border-[#C3A56B]/25"
    >
      {/* Background Ambient Elements & Sacred Geometric Watermark */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-[42rem] rounded-full bg-[#EAE2D3]/40 blur-3xl opacity-60" />
        
        {/* Delicate Botanical Sprigs in Background */}
        <div className="absolute top-8 left-8 opacity-20 transform rotate-12 scale-90">
          <BotanicalCornerSprig className="w-36 h-36 text-[#A4B3A1]" />
        </div>
        <div className="absolute bottom-8 right-8 opacity-20 transform -rotate-[165deg] scale-90">
          <BotanicalCornerSprig className="w-36 h-36 text-[#A4B3A1]" />
        </div>

        {/* Sacred Concentric Mandala Hairline Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.045] pointer-events-none">
          <svg viewBox="0 0 500 500" className="w-[36rem] h-[36rem] text-[#343F35]">
            <circle cx="250" cy="250" r="230" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="250" cy="250" r="180" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <circle cx="250" cy="250" r="130" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="6 3" />
            <circle cx="250" cy="250" r="80" fill="none" stroke="currentColor" strokeWidth="0.8" />
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <line
                key={deg}
                x1="250"
                y1="20"
                x2="250"
                y2="50"
                transform={`rotate(${deg} 250 250)`}
                stroke="currentColor"
                strokeWidth="1"
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Main Section Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        
        {/* Editorial Eyebrow & Sacred Vedic Invocation */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center justify-center mb-5"
        >
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-white/70 border border-[#C3A56B]/30 backdrop-blur-sm mb-3 shadow-xs">
            <CrescentMoonStar className="w-3.5 h-3.5 text-[#A78343]" />
            <span className="font-devanagari text-[11px] sm:text-xs text-[#A78343] tracking-wider font-normal">
              ॥ शिव-शक्ति पावन संगम ॥
            </span>
            <SacredLotus className="w-3.5 h-3.5 text-[#A78343]" />
          </div>

          <h2 className="font-cormorant uppercase tracking-[0.22em] text-2xl sm:text-3xl md:text-4xl text-[#343F35] font-light">
            The Sacred Union
          </h2>
          
          <p className="font-cormorant italic text-sm sm:text-base text-[#657968] mt-1 max-w-lg mx-auto">
            Where consciousness meets grace, and two distinct souls unite into one eternal rhythm.
          </p>
        </motion.div>

        {/* Main Luxury Presentation Stationery Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-[#FDFBF7] rounded-3xl p-7 sm:p-12 md:p-16 border border-[#C3A56B]/35 shadow-botanical overflow-hidden"
        >
          {/* Delicate Stationery Double Hairline Frame */}
          <div className="absolute inset-3 sm:inset-4 border border-[#C3A56B]/25 rounded-2xl pointer-events-none" />
          <div className="absolute inset-5 sm:inset-6 border border-[#C3A56B]/15 rounded-xl pointer-events-none" />

          {/* Central Illustrated Composition */}
          <div className="max-w-md mx-auto mb-8 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#C3A56B]/40 shadow-md group bg-[#FAF6EE] p-2 sm:p-2.5">
              <img
                src="/shiv_shakti_union.jpg"
                alt="Divine Union of Shiva and Parvati — Sacred Bond of Shiv-Shakti"
                className="w-full h-auto rounded-xl object-contain filter contrast-[1.02] transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-[#FDFBF7]/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Subtle caption */}
            <span className="font-cormorant uppercase text-[10px] sm:text-[11px] tracking-[0.25em] text-[#657968] font-semibold mt-3 block">
              Symbol of Inseparable Devotion &amp; Divine Harmony
            </span>
          </div>

          {/* Classical Kalidasa Shloka (Mahakavi Kalidasa's Raghuvamsham) */}
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-8 pt-6 border-t border-[#C3A56B]/20 max-w-2xl mx-auto">
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
