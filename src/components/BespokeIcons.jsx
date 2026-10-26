import React from 'react';

/**
 * Delicate White Jasmine Flowers & Olive / Sage Leaves Sprig
 * Used for draping organically over the envelope corners
 */
export function BotanicalCornerSprig({ className = "w-28 h-28 text-botanical-sage" }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" className={className}>
      {/* Curved organic stem */}
      <path
        d="M20 140 C45 110, 70 80, 135 25"
        stroke="#6B8270"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M50 105 C65 95, 80 115, 95 110"
        stroke="#6B8270"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M85 65 C105 50, 120 70, 135 60"
        stroke="#6B8270"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Sage Green Leaves */}
      <path d="M40 115 C30 100, 45 90, 52 102 C48 112, 42 118, 40 115 Z" fill="#7A917F" opacity="0.9" />
      <path d="M68 85 C60 70, 78 62, 82 74 C78 84, 72 88, 68 85 Z" fill="#6B8270" opacity="0.95" />
      <path d="M96 55 C90 40, 108 34, 112 46 C108 55, 100 58, 96 55 Z" fill="#7A917F" opacity="0.9" />
      <path d="M125 32 C120 18, 138 12, 142 24 C138 32, 130 35, 125 32 Z" fill="#5F7564" opacity="0.95" />

      {/* Secondary branch leaves */}
      <path d="M85 108 C80 98, 92 90, 96 100 C92 106, 88 110, 85 108 Z" fill="#8FA494" opacity="0.85" />
      <path d="M125 62 C120 52, 132 44, 136 54 C132 60, 128 64, 125 62 Z" fill="#8FA494" opacity="0.85" />

      {/* White Jasmine Flower 1 */}
      <g transform="translate(60, 92)">
        <ellipse cx="0" cy="-6" rx="3.5" ry="5.5" fill="#FFFFFF" opacity="0.95" />
        <ellipse cx="6" cy="-2" rx="3.5" ry="5.5" transform="rotate(72 6 -2)" fill="#FFFFFF" opacity="0.95" />
        <ellipse cx="4" cy="5" rx="3.5" ry="5.5" transform="rotate(144 4 5)" fill="#FFFFFF" opacity="0.95" />
        <ellipse cx="-4" cy="5" rx="3.5" ry="5.5" transform="rotate(216 -4 5)" fill="#FFFFFF" opacity="0.95" />
        <ellipse cx="-6" cy="-2" rx="3.5" ry="5.5" transform="rotate(288 -6 -2)" fill="#FFFFFF" opacity="0.95" />
        <circle cx="0" cy="1" r="2.2" fill="#D6BC7E" />
      </g>

      {/* White Jasmine Flower 2 */}
      <g transform="translate(105, 48) scale(0.9)">
        <ellipse cx="0" cy="-6" rx="3.5" ry="5.5" fill="#FFFFFF" opacity="0.95" />
        <ellipse cx="6" cy="-2" rx="3.5" ry="5.5" transform="rotate(72 6 -2)" fill="#FFFFFF" opacity="0.95" />
        <ellipse cx="4" cy="5" rx="3.5" ry="5.5" transform="rotate(144 4 5)" fill="#FFFFFF" opacity="0.95" />
        <ellipse cx="-4" cy="5" rx="3.5" ry="5.5" transform="rotate(216 -4 5)" fill="#FFFFFF" opacity="0.95" />
        <ellipse cx="-6" cy="-2" rx="3.5" ry="5.5" transform="rotate(288 -6 -2)" fill="#FFFFFF" opacity="0.95" />
        <circle cx="0" cy="1" r="2.2" fill="#D6BC7E" />
      </g>

      {/* Delicate Baby's breath buds */}
      <circle cx="45" cy="122" r="2" fill="#FFFFFF" opacity="0.9" />
      <circle cx="32" cy="130" r="1.5" fill="#FFFFFF" opacity="0.8" />
      <circle cx="140" cy="18" r="2.2" fill="#FFFFFF" opacity="0.9" />
      <circle cx="150" cy="24" r="1.6" fill="#FFFFFF" opacity="0.85" />
    </svg>
  );
}

/**
 * Hand-Drawn Delicate Curved Arrow pointing toward the envelope
 */
export function HandDrawnArrow({ className = "w-12 h-12 text-botanical-cream" }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" className={className}>
      <path
        d="M20 80 C 45 85, 75 75, 75 35 C 75 25, 72 20, 68 18"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="2 0.5"
      />
      {/* Arrowhead */}
      <path
        d="M58 24 L 68 18 L 74 28"
        strokeWidth="1.5"
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
