import React from 'react';

/**
 * Lush Botanical White Jasmine & Baby's Breath Corner Cluster
 * Features 14-18 layered cream-white 5-petal blossoms with warm gold stamen centers,
 * tiny unopened pearl buds, and layered olive/sage foliage leaves with soft drop shadows.
 */
export function LushBotanicalCornerCluster({ className = "w-36 h-36" }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className}>
      <defs>
        <filter id="petalShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#1A2B1E" floodOpacity="0.18" />
        </filter>
        <radialGradient id="jasmineCenter" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="60%" stopColor="#C5A869" />
          <stop offset="100%" stopColor="#9E7E38" />
        </radialGradient>
      </defs>

      {/* Main cascading woody branches */}
      <path
        d="M20 180 C40 145, 65 110, 125 50 C145 30, 165 20, 185 15"
        stroke="#526857"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M55 125 C75 105, 95 120, 120 110 C140 102, 160 115, 175 105"
        stroke="#5C7362"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M100 70 C120 50, 140 70, 165 55"
        stroke="#5C7362"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M40 150 C25 135, 30 115, 45 100"
        stroke="#6B8270"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M135 42 C150 25, 160 38, 170 30"
        stroke="#6B8270"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Layered Sage & Olive Leaves (Deep background layers) */}
      <g opacity="0.95">
        <path d="M35 155 C22 138, 40 125, 50 138 C46 150, 38 158, 35 155 Z" fill="#4B6050" filter="url(#petalShadow)" />
        <path d="M60 118 C48 98, 70 88, 78 102 C72 116, 64 122, 60 118 Z" fill="#586E5D" filter="url(#petalShadow)" />
        <path d="M88 88 C76 68, 98 58, 106 72 C100 86, 92 92, 88 88 Z" fill="#657C6A" filter="url(#petalShadow)" />
        <path d="M115 58 C105 38, 128 30, 134 44 C128 56, 120 62, 115 58 Z" fill="#586E5D" filter="url(#petalShadow)" />
        <path d="M145 32 C135 15, 158 8, 164 22 C158 32, 150 36, 145 32 Z" fill="#4B6050" filter="url(#petalShadow)" />
        <path d="M172 16 C166 4, 185 2, 188 12 C184 18, 176 20, 172 16 Z" fill="#657C6A" />

        {/* Side branch foliage */}
        <path d="M105 115 C95 102, 115 92, 120 105 C116 114, 110 118, 105 115 Z" fill="#758B7A" opacity="0.9" />
        <path d="M140 108 C132 96, 150 88, 154 99 C150 107, 144 110, 140 108 Z" fill="#657C6A" opacity="0.9" />
        <path d="M150 58 C142 46, 160 38, 164 49 C160 57, 154 60, 150 58 Z" fill="#758B7A" opacity="0.9" />
      </g>

      {/* Layered White Jasmine Blossoms (14 detailed 5-petal blossoms + pearl buds) */}
      {/* Blossom 1 (Large - lower cluster) */}
      <g transform="translate(48, 140)" filter="url(#petalShadow)">
        {[0, 72, 144, 216, 288].map((angle, idx) => (
          <ellipse key={idx} cx="0" cy="-7" rx="4" ry="6.5" transform={`rotate(${angle} 0 0)`} fill="#FDFBF7" />
        ))}
        <circle cx="0" cy="0" r="2.8" fill="url(#jasmineCenter)" />
      </g>

      {/* Blossom 2 (Medium - lower stem) */}
      <g transform="translate(75, 112) scale(0.92)" filter="url(#petalShadow)">
        {[0, 72, 144, 216, 288].map((angle, idx) => (
          <ellipse key={idx} cx="0" cy="-6.5" rx="3.6" ry="6" transform={`rotate(${angle} 0 0)`} fill="#FFFFFF" />
        ))}
        <circle cx="0" cy="0" r="2.5" fill="url(#jasmineCenter)" />
      </g>

      {/* Blossom 3 (Medium - branch node) */}
      <g transform="translate(108, 82) scale(0.95)" filter="url(#petalShadow)">
        {[0, 72, 144, 216, 288].map((angle, idx) => (
          <ellipse key={idx} cx="0" cy="-7" rx="3.8" ry="6.2" transform={`rotate(${angle} 0 0)`} fill="#FDFBF7" />
        ))}
        <circle cx="0" cy="0" r="2.6" fill="url(#jasmineCenter)" />
      </g>

      {/* Blossom 4 (Large - upper mid cluster) */}
      <g transform="translate(136, 52) scale(1.05)" filter="url(#petalShadow)">
        {[0, 72, 144, 216, 288].map((angle, idx) => (
          <ellipse key={idx} cx="0" cy="-7.5" rx="4.2" ry="7" transform={`rotate(${angle} 0 0)`} fill="#FFFFFF" />
        ))}
        <circle cx="0" cy="0" r="3" fill="url(#jasmineCenter)" />
      </g>

      {/* Blossom 5 (Small - top terminal) */}
      <g transform="translate(165, 24) scale(0.8)" filter="url(#petalShadow)">
        {[0, 72, 144, 216, 288].map((angle, idx) => (
          <ellipse key={idx} cx="0" cy="-6" rx="3.2" ry="5.5" transform={`rotate(${angle} 0 0)`} fill="#FDFBF7" />
        ))}
        <circle cx="0" cy="0" r="2.2" fill="url(#jasmineCenter)" />
      </g>

      {/* Blossom 6 (Outer side branch blossom) */}
      <g transform="translate(126, 110) scale(0.85)" filter="url(#petalShadow)">
        {[0, 72, 144, 216, 288].map((angle, idx) => (
          <ellipse key={idx} cx="0" cy="-6.2" rx="3.4" ry="5.8" transform={`rotate(${angle} 0 0)`} fill="#FFFFFF" />
        ))}
        <circle cx="0" cy="0" r="2.3" fill="url(#jasmineCenter)" />
      </g>

      {/* Blossom 7 (Outer upper branch blossom) */}
      <g transform="translate(162, 58) scale(0.78)" filter="url(#petalShadow)">
        {[0, 72, 144, 216, 288].map((angle, idx) => (
          <ellipse key={idx} cx="0" cy="-6" rx="3.2" ry="5.2" transform={`rotate(${angle} 0 0)`} fill="#FDFBF7" />
        ))}
        <circle cx="0" cy="0" r="2.1" fill="url(#jasmineCenter)" />
      </g>

      {/* Blossom 8 (Lower left accent) */}
      <g transform="translate(30, 158) scale(0.74)" filter="url(#petalShadow)">
        {[0, 72, 144, 216, 288].map((angle, idx) => (
          <ellipse key={idx} cx="0" cy="-6" rx="3.2" ry="5.4" transform={`rotate(${angle} 0 0)`} fill="#FFFFFF" />
        ))}
        <circle cx="0" cy="0" r="2" fill="url(#jasmineCenter)" />
      </g>

      {/* Blossom 9 (Mid lower branch node) */}
      <g transform="translate(94, 130) scale(0.8)" filter="url(#petalShadow)">
        {[0, 72, 144, 216, 288].map((angle, idx) => (
          <ellipse key={idx} cx="0" cy="-6" rx="3.3" ry="5.5" transform={`rotate(${angle} 0 0)`} fill="#FDFBF7" />
        ))}
        <circle cx="0" cy="0" r="2.2" fill="url(#jasmineCenter)" />
      </g>

      {/* Blossom 10 (Central arch node) */}
      <g transform="translate(62, 94) scale(0.78)" filter="url(#petalShadow)">
        {[0, 72, 144, 216, 288].map((angle, idx) => (
          <ellipse key={idx} cx="0" cy="-5.8" rx="3.2" ry="5.2" transform={`rotate(${angle} 0 0)`} fill="#FFFFFF" />
        ))}
        <circle cx="0" cy="0" r="2.1" fill="url(#jasmineCenter)" />
      </g>

      {/* Blossom 11 (Mid right branch cluster) */}
      <g transform="translate(148, 86) scale(0.82)" filter="url(#petalShadow)">
        {[0, 72, 144, 216, 288].map((angle, idx) => (
          <ellipse key={idx} cx="0" cy="-6.2" rx="3.4" ry="5.6" transform={`rotate(${angle} 0 0)`} fill="#FDFBF7" />
        ))}
        <circle cx="0" cy="0" r="2.3" fill="url(#jasmineCenter)" />
      </g>

      {/* Blossom 12 (Upper canopy flower) */}
      <g transform="translate(118, 38) scale(0.84)" filter="url(#petalShadow)">
        {[0, 72, 144, 216, 288].map((angle, idx) => (
          <ellipse key={idx} cx="0" cy="-6.2" rx="3.4" ry="5.6" transform={`rotate(${angle} 0 0)`} fill="#FFFFFF" />
        ))}
        <circle cx="0" cy="0" r="2.3" fill="url(#jasmineCenter)" />
      </g>

      {/* Blossom 13 (Top right trailing bud-flower) */}
      <g transform="translate(178, 38) scale(0.7)" filter="url(#petalShadow)">
        {[0, 72, 144, 216, 288].map((angle, idx) => (
          <ellipse key={idx} cx="0" cy="-5.5" rx="3" ry="5" transform={`rotate(${angle} 0 0)`} fill="#FDFBF7" />
        ))}
        <circle cx="0" cy="0" r="1.9" fill="url(#jasmineCenter)" />
      </g>

      {/* Blossom 14 (Inner stem flower) */}
      <g transform="translate(104, 58) scale(0.76)" filter="url(#petalShadow)">
        {[0, 72, 144, 216, 288].map((angle, idx) => (
          <ellipse key={idx} cx="0" cy="-5.8" rx="3.2" ry="5.2" transform={`rotate(${angle} 0 0)`} fill="#FFFFFF" />
        ))}
        <circle cx="0" cy="0" r="2.1" fill="url(#jasmineCenter)" />
      </g>

      {/* Baby's breath pearl buds (Tiny delicate sphere clusters) */}
      <g fill="#FFFFFF" opacity="0.95" filter="url(#petalShadow)">
        {/* Cluster near bottom */}
        <circle cx="28" cy="165" r="2.6" />
        <circle cx="22" cy="172" r="2" />
        <circle cx="34" cy="172" r="2.2" />

        {/* Cluster near mid */}
        <circle cx="68" cy="132" r="2.2" />
        <circle cx="92" cy="98" r="2.4" />
        <circle cx="155" cy="115" r="2.3" />
        <circle cx="168" cy="108" r="1.9" />

        {/* Cluster near top */}
        <circle cx="148" cy="18" r="2.4" />
        <circle cx="178" cy="12" r="2.5" />
        <circle cx="184" cy="20" r="2" />
        <circle cx="178" cy="40" r="2.2" />
      </g>
    </svg>
  );
}

/**
 * Backward-compatible alias for LushBotanicalCornerCluster
 */
export const BotanicalCornerSprig = LushBotanicalCornerCluster;

/**
 * High-Precision Vector SVG Fallback for Custom "त-S" Floral Monogram
 * Accurately replicates the gold calligraphy Devanagari 'त' intertwining with Roman 'S'
 * adorned with detailed blush-crimson & sage floral clusters.
 */
export function TSFloralLogoSVG({ className = "w-full h-full" }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className}>
      <defs>
        <linearGradient id="goldMonogramGrad" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#F5DC9A" />
          <stop offset="30%" stopColor="#D8BA74" />
          <stop offset="65%" stopColor="#B39043" />
          <stop offset="100%" stopColor="#7A5A1B" />
        </linearGradient>
        <filter id="monogramEmboss" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0.5" dy="1.2" stdDeviation="0.8" floodColor="#3B2A08" floodOpacity="0.6" />
        </filter>
        <radialGradient id="blushPetalGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#F8D3CE" />
          <stop offset="50%" stopColor="#E28E84" />
          <stop offset="100%" stopColor="#A8443E" />
        </radialGradient>
      </defs>

      {/* Background warm gold tone */}
      <rect width="200" height="200" fill="transparent" />

      {/* Monogram Group */}
      <g filter="url(#monogramEmboss)">
        {/* Roman 'S' Calligraphy (Ascending on top right) */}
        <path
          d="M130 18 C115 18, 98 28, 98 44 C98 58, 110 66, 126 74 C144 82, 150 90, 150 102 C150 118, 134 126, 115 126 C100 126, 88 120, 84 116 L88 108 C94 112, 104 118, 116 118 C128 118, 140 112, 140 102 C140 92, 130 84, 115 76 C98 68, 88 58, 88 44 C88 24, 106 10, 130 10 C142 10, 152 14, 156 18 L150 26 C145 22, 138 18, 130 18 Z"
          fill="url(#goldMonogramGrad)"
        />

        {/* Devanagari 'त' Calligraphy (Shirorekha bar + stem + sweeping tail flourish) */}
        {/* Top Shirorekha Bar with serif beveled left edge */}
        <path
          d="M32 72 L38 66 L112 66 L108 72 Z"
          fill="url(#goldMonogramGrad)"
        />

        {/* Central vertical stem of 'त' */}
        <path
          d="M84 68 L94 68 L94 138 C94 142, 88 146, 84 142 Z"
          fill="url(#goldMonogramGrad)"
        />

        {/* Curving arm and dramatic sweeping tail flourish of 'त' */}
        <path
          d="M92 84 C76 84, 42 86, 38 106 C34 126, 44 148, 62 168 C80 188, 108 196, 135 188 C144 185, 148 180, 142 176 C115 186, 86 178, 70 158 C54 138, 48 122, 50 108 C52 96, 72 92, 92 92 Z"
          fill="url(#goldMonogramGrad)"
        />
      </g>

      {/* Central Floral Blossom Bouquet in crux of 'त' and 'S' */}
      <g transform="translate(94, 94)">
        {/* Deep sage leaves */}
        <path d="M-12 -22 C-22 -32, -8 -36, -4 -26 C-6 -22, -9 -21, -12 -22 Z" fill="#4B6050" />
        <path d="M14 -20 C24 -30, 10 -34, 6 -24 C8 -20, 11 -19, 14 -20 Z" fill="#586E5D" />
        <path d="M-20 6 C-32 8, -26 -6, -16 -2 C-17 2, -18 5, -20 6 Z" fill="#657C6A" />
        <path d="M18 10 C30 12, 24 -2, 14 2 C15 6, 16 9, 18 10 Z" fill="#4B6050" />

        {/* Main 8-petal Blush-Crimson Blossom */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <ellipse
            key={i}
            cx="0"
            cy="-11"
            rx="4.5"
            ry="7.5"
            transform={`rotate(${angle} 0 0)`}
            fill="url(#blushPetalGrad)"
          />
        ))}

        {/* Inner cream petals */}
        {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, i) => (
          <ellipse
            key={`inner-${i}`}
            cx="0"
            cy="-7"
            rx="2.6"
            ry="4.8"
            transform={`rotate(${angle} 0 0)`}
            fill="#FFF5EE"
          />
        ))}

        {/* Blossom Center Gold Core */}
        <circle cx="0" cy="0" r="4.2" fill="#D4AF37" />
        <circle cx="0" cy="0" r="2.2" fill="#8B2621" />
      </g>

      {/* Tail Floral Accent on bottom sweeping curve of 'त' */}
      <g transform="translate(132, 178) scale(0.68)">
        {/* Tiny leaves */}
        <path d="M-8 -14 C-16 -20, -6 -24, -2 -16 Z" fill="#4B6050" />
        <path d="M10 -12 C18 -18, 8 -22, 4 -14 Z" fill="#586E5D" />
        {/* Small 6-petal blossom */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <ellipse
            key={`tail-${i}`}
            cx="0"
            cy="-8"
            rx="3.5"
            ry="6"
            transform={`rotate(${angle} 0 0)`}
            fill="url(#blushPetalGrad)"
          />
        ))}
        <circle cx="0" cy="0" r="3" fill="#D4AF37" />
      </g>
    </svg>
  );
}

/**
 * Hand-Drawn Delicate Curved Arrow pointing toward the envelope
 */
export function HandDrawnArrow({ className = "w-10 h-10 text-[#EAE6DF]/70" }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" className={className}>
      {/* Hand-drawn sweeping curve arching from right of prompt up toward envelope */}
      <path
        d="M25 80 C 68 76, 82 45, 42 16"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeDasharray="3 1.5"
      />
      {/* Arrowhead pointing up-left toward bottom-right corner of envelope */}
      <path
        d="M58 13 L 42 16 L 46 32"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Minimalist Line-Art Ganesha (Quiet elegance)
 */
export function GaneshaIcon({ className = "w-8 h-8 text-botanical-brass" }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" className={className}>
      {/* Crown */}
      <path d="M40 10 L45 22 L35 22 Z" strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="40" cy="16" r="1.5" fill="currentColor" />
      {/* Tilak */}
      <path d="M38 26 C38 24, 42 24, 42 26 C42 30, 38 30, 38 26 Z" fill="currentColor" />
      {/* Ears & Trunk */}
      <path d="M30 28 C20 28, 16 36, 20 46 C24 52, 30 52, 32 46" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M50 28 C60 28, 64 36, 60 46 C56 52, 50 52, 48 46" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M32 30 C36 36, 37 42, 37 48 C37 58, 42 66, 48 68 C54 70, 58 66, 58 60 C58 56, 54 54, 52 56" strokeWidth="1.6" strokeLinecap="round" />
      {/* Modak */}
      <circle cx="56" cy="50" r="2.5" fill="currentColor" />
    </svg>
  );
}

/**
 * Minimalist Botanical Branch Divider
 */
export function BotanicalDivider({ className = "w-full max-w-xs my-6 text-botanical-brass/50" }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-current opacity-40" />
      <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M12 2 C13 7, 16 10, 22 12 C16 14, 13 17, 12 22 C11 17, 8 14, 2 12 C8 10, 11 7, 12 2 Z" />
      </svg>
      <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-current opacity-40" />
    </div>
  );
}

/**
 * Sacred Lotus Motif (For The Royal Wedding Card)
 */
export function SacredLotus({ className = "w-6 h-6 text-botanical-brass" }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.4" className={className}>
      <path d="M20 8 C17 14, 15 22, 20 28 C25 22, 23 14, 20 8 Z" fill="currentColor" fillOpacity="0.15" />
      <path d="M14 14 C12 20, 14 26, 20 28 C16 26, 11 22, 14 14 Z" />
      <path d="M26 14 C28 20, 26 26, 20 28 C24 26, 29 22, 26 14 Z" />
      <path d="M9 20 C8 25, 12 28, 20 28" />
      <path d="M31 20 C32 25, 28 28, 20 28" />
      <path d="M10 32 C15 30, 25 30, 30 32" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Marigold Flower Motif (For Haldi Carnival Card)
 */
export function MarigoldSprig({ className = "w-6 h-6 text-botanical-brass" }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.3" className={className}>
      <circle cx="20" cy="20" r="12" strokeDasharray="3 2" />
      <circle cx="20" cy="20" r="7" strokeDasharray="2 1.5" />
      <circle cx="20" cy="20" r="2.5" fill="currentColor" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((ang) => (
        <line
          key={ang}
          x1="20"
          y1="8"
          x2="20"
          y2="12"
          transform={`rotate(${ang} 20 20)`}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

/**
 * Crescent Moon & Evening Star (For Sangeet)
 */
export function CrescentMoonStar({ className = "w-6 h-6 text-botanical-brass" }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.3" className={className}>
      <path d="M22 10 C16 12, 12 18, 14 26 C16 32, 22 36, 28 34 C20 36, 12 28, 16 18 C18 13, 20 11, 22 10 Z" fill="currentColor" fillOpacity="0.15" />
      {/* Little Star */}
      <path d="M28 12 L29 15 L32 16 L29 17 L28 20 L27 17 L24 16 L27 15 Z" fill="currentColor" />
    </svg>
  );
}

/**
 * Backwards compatibility alias for components that import VintageCornerFiligree or RoyalFloralDivider
 */
export const VintageCornerFiligree = BotanicalCornerSprig;
export const RoyalFloralDivider = BotanicalDivider;
export const MandalaWatermark = ({ className }) => null;

/**
 * Royal Gold Foil Viewport Corner Filigree (For double gold frame corners)
 */
export function GoldFoilFiligreeCorner({ className = "w-10 h-10 text-[#D4AF37]" }) {
  return (
    <svg viewBox="0 0 60 60" fill="none" className={className}>
      <defs>
        <linearGradient id="goldFiligreeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FCF6BA" />
          <stop offset="40%" stopColor="#D4AF37" />
          <stop offset="80%" stopColor="#AA8229" />
          <stop offset="100%" stopColor="#6E5011" />
        </linearGradient>
      </defs>
      {/* Outer corner L-brackets */}
      <path d="M4 24 L4 4 L24 4" stroke="url(#goldFiligreeGrad)" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M8 18 L8 8 L18 8" stroke="url(#goldFiligreeGrad)" strokeWidth="0.8" strokeLinecap="round" opacity="0.8" />
      {/* Ornate scrolling flourish */}
      <path
        d="M6 6 C14 12, 18 20, 22 32 C24 38, 30 42, 36 38 C42 34, 38 24, 30 22 C20 20, 12 14, 6 6 Z"
        stroke="url(#goldFiligreeGrad)"
        strokeWidth="1.1"
        fill="url(#goldFiligreeGrad)"
        fillOpacity="0.12"
      />
      {/* Counter scroll */}
      <path
        d="M6 6 C12 14, 20 18, 32 22 C38 24, 42 30, 38 36 C34 42, 24 38, 22 30"
        stroke="url(#goldFiligreeGrad)"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {/* Corner bead accent */}
      <circle cx="6" cy="6" r="1.8" fill="url(#goldFiligreeGrad)" />
      <circle cx="16" cy="16" r="1.2" fill="url(#goldFiligreeGrad)" />
      <circle cx="36" cy="38" r="1.5" fill="url(#goldFiligreeGrad)" />
      <circle cx="38" cy="36" r="1.5" fill="url(#goldFiligreeGrad)" />
    </svg>
  );
}

/**
 * Metallic Gold Foil Stamped Botanical Branches with 3D Cream Baby's Breath (Gypsophila)
 * Layered ON TOP (z-20) of envelope corners, matching the physical card's gold foil stamping.
 */
export function GoldFoilStampedBotanicalCorner({ className = "w-36 h-36" }) {
  return (
    <svg viewBox="0 0 220 220" fill="none" className={className}>
      <defs>
        <linearGradient id="stampedGoldGrad" x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#FFF2B2" />
          <stop offset="25%" stopColor="#E5C77D" />
          <stop offset="60%" stopColor="#C9A458" />
          <stop offset="85%" stopColor="#9E7B32" />
          <stop offset="100%" stopColor="#7A5914" />
        </linearGradient>
        <filter id="goldStampGleam" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#020814" floodOpacity="0.45" />
        </filter>
        <radialGradient id="gypsophilaCenter" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FCF6BA" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#8A6820" />
        </radialGradient>
      </defs>

      {/* 1. Stamped Gold Foil Branches (Main graceful curves) */}
      <g filter="url(#goldStampGleam)">
        <path
          d="M15 195 C35 155, 70 120, 130 55 C155 30, 180 18, 205 12"
          stroke="url(#stampedGoldGrad)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M50 135 C75 112, 105 125, 135 115 C155 108, 180 120, 195 108"
          stroke="url(#stampedGoldGrad)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M105 78 C128 55, 152 75, 182 58"
          stroke="url(#stampedGoldGrad)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M35 165 C20 148, 25 125, 42 108"
          stroke="url(#stampedGoldGrad)"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <path
          d="M145 46 C162 26, 175 42, 188 32"
          stroke="url(#stampedGoldGrad)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Stamped Gold Foil Leaf Foliage with Beveled Edges */}
        <path d="M30 170 C16 150, 36 135, 48 150 C44 164, 34 172, 30 170 Z" fill="url(#stampedGoldGrad)" opacity="0.9" />
        <path d="M58 126 C44 104, 68 92, 78 108 C70 124, 62 130, 58 126 Z" fill="url(#stampedGoldGrad)" opacity="0.9" />
        <path d="M88 94 C74 72, 98 62, 108 78 C100 94, 92 100, 88 94 Z" fill="url(#stampedGoldGrad)" opacity="0.95" />
        <path d="M120 62 C108 40, 134 30, 142 46 C134 60, 126 66, 120 62 Z" fill="url(#stampedGoldGrad)" opacity="0.95" />
        <path d="M155 35 C144 16, 168 8, 176 24 C168 36, 160 40, 155 35 Z" fill="url(#stampedGoldGrad)" opacity="0.95" />
        <path d="M188 16 C180 2, 202 0, 206 12 C200 20, 192 22, 188 16 Z" fill="url(#stampedGoldGrad)" opacity="0.9" />

        {/* Side leaf sprigs */}
        <path d="M112 122 C100 108, 122 96, 128 110 C124 120, 118 125, 112 122 Z" fill="url(#stampedGoldGrad)" opacity="0.85" />
        <path d="M152 114 C142 100, 164 90, 168 104 C164 112, 158 116, 152 114 Z" fill="url(#stampedGoldGrad)" opacity="0.85" />
        <path d="M165 62 C155 48, 176 38, 180 52 C176 60, 170 64, 165 62 Z" fill="url(#stampedGoldGrad)" opacity="0.85" />
      </g>

      {/* 2. 3D Cream Baby's Breath (Gypsophila) Sprigs Layered ON TOP with Warm Gold Stamens */}
      <g filter="url(#goldStampGleam)">
        {/* Blossom 1 */}
        <g transform="translate(48, 148)">
          {[0, 72, 144, 216, 288].map((angle, idx) => (
            <ellipse key={idx} cx="0" cy="-6.5" rx="3.8" ry="6.2" transform={`rotate(${angle} 0 0)`} fill="#FAF7F0" />
          ))}
          <circle cx="0" cy="0" r="2.5" fill="url(#gypsophilaCenter)" />
        </g>

        {/* Blossom 2 */}
        <g transform="translate(78, 118) scale(0.92)">
          {[0, 72, 144, 216, 288].map((angle, idx) => (
            <ellipse key={idx} cx="0" cy="-6" rx="3.5" ry="5.8" transform={`rotate(${angle} 0 0)`} fill="#FFFFFF" />
          ))}
          <circle cx="0" cy="0" r="2.3" fill="url(#gypsophilaCenter)" />
        </g>

        {/* Blossom 3 */}
        <g transform="translate(112, 86) scale(0.95)">
          {[0, 72, 144, 216, 288].map((angle, idx) => (
            <ellipse key={idx} cx="0" cy="-6.5" rx="3.6" ry="6" transform={`rotate(${angle} 0 0)`} fill="#FAF7F0" />
          ))}
          <circle cx="0" cy="0" r="2.4" fill="url(#gypsophilaCenter)" />
        </g>

        {/* Blossom 4 */}
        <g transform="translate(142, 54) scale(1.05)">
          {[0, 72, 144, 216, 288].map((angle, idx) => (
            <ellipse key={idx} cx="0" cy="-7" rx="4" ry="6.6" transform={`rotate(${angle} 0 0)`} fill="#FFFFFF" />
          ))}
          <circle cx="0" cy="0" r="2.8" fill="url(#gypsophilaCenter)" />
        </g>

        {/* Blossom 5 */}
        <g transform="translate(175, 26) scale(0.8)">
          {[0, 72, 144, 216, 288].map((angle, idx) => (
            <ellipse key={idx} cx="0" cy="-5.5" rx="3" ry="5.2" transform={`rotate(${angle} 0 0)`} fill="#FAF7F0" />
          ))}
          <circle cx="0" cy="0" r="2" fill="url(#gypsophilaCenter)" />
        </g>

        {/* Blossom 6 */}
        <g transform="translate(132, 114) scale(0.82)">
          {[0, 72, 144, 216, 288].map((angle, idx) => (
            <ellipse key={idx} cx="0" cy="-5.8" rx="3.2" ry="5.5" transform={`rotate(${angle} 0 0)`} fill="#FFFFFF" />
          ))}
          <circle cx="0" cy="0" r="2.2" fill="url(#gypsophilaCenter)" />
        </g>

        {/* Blossom 7 */}
        <g transform="translate(172, 62) scale(0.78)">
          {[0, 72, 144, 216, 288].map((angle, idx) => (
            <ellipse key={idx} cx="0" cy="-5.6" rx="3" ry="5" transform={`rotate(${angle} 0 0)`} fill="#FAF7F0" />
          ))}
          <circle cx="0" cy="0" r="2" fill="url(#gypsophilaCenter)" />
        </g>

        {/* Baby's breath pearl buds with golden glow */}
        <g fill="#FAF7F0">
          <circle cx="26" cy="172" r="2.6" />
          <circle cx="20" cy="180" r="2" />
          <circle cx="34" cy="182" r="2.2" />
          <circle cx="70" cy="138" r="2.2" />
          <circle cx="96" cy="102" r="2.4" />
          <circle cx="160" cy="120" r="2.3" />
          <circle cx="174" cy="112" r="1.9" />
          <circle cx="154" cy="20" r="2.4" />
          <circle cx="186" cy="14" r="2.5" />
          <circle cx="194" cy="22" r="2" />
          <circle cx="188" cy="44" r="2.2" />
        </g>
      </g>
    </svg>
  );
}

/**
 * Delicate Baby's Breath Sprig Tucked Behind the Wax Seal
 */
export function WaxSealBabyBreathSprig({ className = "w-20 h-16" }) {
  return (
    <svg viewBox="0 0 100 80" fill="none" className={className}>
      <defs>
        <linearGradient id="twineGoldSprig" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FCF6BA" />
          <stop offset="50%" stopColor="#C9A458" />
          <stop offset="100%" stopColor="#9E7B32" />
        </linearGradient>
      </defs>
      {/* Soft stems arching up behind the seal */}
      <path d="M50 75 C45 50, 30 35, 18 20" stroke="url(#twineGoldSprig)" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M50 75 C52 48, 65 32, 82 18" stroke="url(#twineGoldSprig)" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M50 75 C48 42, 48 25, 50 10" stroke="url(#twineGoldSprig)" strokeWidth="1.3" strokeLinecap="round" />
      {/* Tender leaf shoots */}
      <path d="M35 42 C28 36, 26 28, 32 32 Z" fill="url(#twineGoldSprig)" opacity="0.8" />
      <path d="M62 40 C70 34, 72 26, 66 30 Z" fill="url(#twineGoldSprig)" opacity="0.8" />
      {/* Tiny cream pearls */}
      <g fill="#FAF7F0" opacity="0.95">
        <circle cx="18" cy="20" r="2.4" />
        <circle cx="12" cy="16" r="1.8" />
        <circle cx="24" cy="14" r="2" />
        <circle cx="50" cy="10" r="2.5" />
        <circle cx="44" cy="6" r="1.8" />
        <circle cx="56" cy="6" r="2" />
        <circle cx="82" cy="18" r="2.4" />
        <circle cx="88" cy="14" r="1.8" />
        <circle cx="76" cy="12" r="2.1" />
      </g>
    </svg>
  );
}

/**
 * 3-Strand Metallic Gold Twine (Crisscrossing horizontally behind wax seal)
 */
export function GoldTwineThreads({ className = "w-full" }) {
  return (
    <div className={`relative h-6 flex flex-col justify-center pointer-events-none ${className}`}>
      {/* Strand 1 (Top subtle wave) */}
      <div 
        className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-[#F7E5A9] to-transparent shadow-[0_1px_3px_rgba(0,0,0,0.5)] transform -rotate-[0.6deg] mb-1" 
        style={{
          backgroundImage: 'linear-gradient(90deg, rgba(158,123,50,0) 0%, #9E7B32 15%, #F7E5A9 50%, #9E7B32 85%, rgba(158,123,50,0) 100%)'
        }}
      />
      {/* Strand 2 (Middle taut thread) */}
      <div 
        className="h-[1.8px] w-full shadow-[0_1px_4px_rgba(0,0,0,0.6)]" 
        style={{
          backgroundImage: 'linear-gradient(90deg, rgba(158,123,50,0) 0%, #B38728 12%, #FFF3B3 48%, #B38728 88%, rgba(158,123,50,0) 100%)'
        }}
      />
      {/* Strand 3 (Bottom subtle wave) */}
      <div 
        className="h-[1.5px] w-full transform rotate-[0.8deg] mt-1 shadow-[0_1px_3px_rgba(0,0,0,0.5)]" 
        style={{
          backgroundImage: 'linear-gradient(90deg, rgba(158,123,50,0) 0%, #9E7B32 18%, #F7E5A9 52%, #9E7B32 82%, rgba(158,123,50,0) 100%)'
        }}
      />
    </div>
  );
}

/**
 * Delicate Botanical Gypsophila (Baby's Breath) & Olive/Eucalyptus Sprig
 * Refined watercolor/ink quiet luxury aesthetic:
 * Soft ivory blossoms (#FAF8F5), muted champagne stems (#B8A072),
 * and dusty slate-blue/sage eucalyptus leaves (#4A6278).
 */
export function DelicateBotanicalSprig({ className = "w-32 h-32", isFlipped = false }) {
  return (
    <svg 
      viewBox="0 0 160 160" 
      fill="none" 
      className={className}
      style={{ transform: isFlipped ? 'scaleX(-1) scaleY(-1)' : undefined }}
    >
      <defs>
        <radialGradient id="delicateBlushCenter" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E6C8C3" />
          <stop offset="60%" stopColor="#C48B83" />
          <stop offset="100%" stopColor="#9A8052" />
        </radialGradient>
        <filter id="delicateSprigShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#0C223B" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* 1. Muted Champagne Arching Branches */}
      <g stroke="#B8A072" strokeWidth="1.2" strokeLinecap="round" opacity="0.9">
        <path d="M10 150 C30 115, 60 85, 115 35 C130 22, 145 15, 155 10" />
        <path d="M45 102 C65 85, 90 95, 115 88" strokeWidth="1.0" />
        <path d="M85 60 C105 45, 125 58, 140 48" strokeWidth="0.9" />
        <path d="M28 128 C18 115, 22 98, 35 88" strokeWidth="0.9" />
      </g>

      {/* 2. Dusty Slate-Blue & Sage Eucalyptus Leaves */}
      <g filter="url(#delicateSprigShadow)" opacity="0.92">
        <path d="M30 132 C18 116, 32 105, 42 116 C38 128, 32 134, 30 132 Z" fill="#4A6278" />
        <path d="M52 98 C40 82, 58 72, 66 84 C60 96, 54 100, 52 98 Z" fill="#5A7389" />
        <path d="M78 72 C66 56, 84 48, 92 60 C86 70, 80 74, 78 72 Z" fill="#4A6278" />
        <path d="M106 48 C96 34, 114 26, 120 38 C116 46, 110 50, 106 48 Z" fill="#6B849A" />
        <path d="M132 25 C124 12, 140 6, 145 18 C140 24, 134 27, 132 25 Z" fill="#5A7389" />
        
        {/* Secondary branch foliage */}
        <path d="M96 92 C88 80, 102 72, 106 82 C102 88, 98 92, 96 92 Z" fill="#758E9F" opacity="0.85" />
        <path d="M125 55 C118 45, 130 38, 134 46 C130 52, 126 55, 125 55 Z" fill="#5A7389" opacity="0.85" />
      </g>

      {/* 3. Soft Ivory Gypsophila (Baby's Breath) Blossoms with Soft Blush Stamens */}
      <g filter="url(#delicateSprigShadow)">
        {/* Blossom A */}
        <g transform="translate(42, 115) scale(0.85)">
          {[0, 72, 144, 216, 288].map((angle, idx) => (
            <ellipse key={idx} cx="0" cy="-5" rx="3" ry="5" transform={`rotate(${angle} 0 0)`} fill="#FAF8F5" />
          ))}
          <circle cx="0" cy="0" r="1.8" fill="url(#delicateBlushCenter)" />
        </g>

        {/* Blossom B */}
        <g transform="translate(68, 88) scale(0.92)">
          {[0, 72, 144, 216, 288].map((angle, idx) => (
            <ellipse key={idx} cx="0" cy="-5.5" rx="3.2" ry="5.2" transform={`rotate(${angle} 0 0)`} fill="#FAF8F5" />
          ))}
          <circle cx="0" cy="0" r="2.0" fill="url(#delicateBlushCenter)" />
        </g>

        {/* Blossom C */}
        <g transform="translate(98, 62) scale(0.95)">
          {[0, 72, 144, 216, 288].map((angle, idx) => (
            <ellipse key={idx} cx="0" cy="-5.8" rx="3.4" ry="5.5" transform={`rotate(${angle} 0 0)`} fill="#FFFFFF" />
          ))}
          <circle cx="0" cy="0" r="2.1" fill="url(#delicateBlushCenter)" />
        </g>

        {/* Blossom D */}
        <g transform="translate(126, 36) scale(0.8)">
          {[0, 72, 144, 216, 288].map((angle, idx) => (
            <ellipse key={idx} cx="0" cy="-4.8" rx="2.8" ry="4.8" transform={`rotate(${angle} 0 0)`} fill="#FAF8F5" />
          ))}
          <circle cx="0" cy="0" r="1.7" fill="url(#delicateBlushCenter)" />
        </g>

        {/* Blossom E (Side) */}
        <g transform="translate(118, 85) scale(0.75)">
          {[0, 72, 144, 216, 288].map((angle, idx) => (
            <ellipse key={idx} cx="0" cy="-4.5" rx="2.6" ry="4.5" transform={`rotate(${angle} 0 0)`} fill="#FAF8F5" />
          ))}
          <circle cx="0" cy="0" r="1.6" fill="url(#delicateBlushCenter)" />
        </g>

        {/* Delicate Gypsophila Pearl Buds */}
        <g fill="#FAF8F5" opacity="0.95">
          <circle cx="20" cy="138" r="2.0" />
          <circle cx="15" cy="146" r="1.6" />
          <circle cx="62" cy="106" r="1.8" />
          <circle cx="88" cy="78" r="1.9" />
          <circle cx="138" cy="82" r="1.7" />
          <circle cx="146" cy="40" r="1.8" />
          <circle cx="154" cy="12" r="2.0" />
        </g>
      </g>
    </svg>
  );
}

