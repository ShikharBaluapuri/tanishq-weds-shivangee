import React, { useEffect, useRef, useState } from 'react';

/**
 * BlendedWaxSeal
 * Programmatic HTML5 Canvas background-stripping wax seal component.
 * Removes the beige/parchment paper background from /ts-logo.jpg in real-time,
 * leaving ONLY the authentic gold त-S calligraphy and crimson/rose floral flourishes
 * with 100% transparent background, seamlessly embedded into a 3D tactile wax seal.
 */
export default function BlendedWaxSeal({ onClick, className = '' }) {
  const canvasRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/ts-logo.jpg';

    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      const width = img.naturalWidth || img.width || 400;
      const height = img.naturalHeight || img.height || 400;

      canvas.width = width;
      canvas.height = height;

      // Draw original image
      ctx.drawImage(img, 0, 0, width, height);

      // Get pixel data
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      // Sample average paper color from outer corners to be immune to JPEG noise
      let cornerR = 0, cornerG = 0, cornerB = 0;
      const samplePoints = [
        [4, 4],
        [width - 5, 4],
        [4, height - 5],
        [width - 5, height - 5],
        [8, 8]
      ];

      samplePoints.forEach(([x, y]) => {
        const idx = (y * width + x) * 4;
        cornerR += data[idx];
        cornerG += data[idx + 1];
        cornerB += data[idx + 2];
      });

      const bgR = cornerR / samplePoints.length;
      const bgG = cornerG / samplePoints.length;
      const bgB = cornerB / samplePoints.length;

      // Process all pixels
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Euclidean color distance from paper background
        const dist = Math.sqrt(
          (r - bgR) ** 2 +
          (g - bgG) ** 2 +
          (b - bgB) ** 2
        );

        // Standard luminance
        const luma = 0.299 * r + 0.587 * g + 0.114 * b;

        // If pixel matches paper background or is light beige paper
        if (dist < 42 || (luma > 185 && r > g && g > b && (r - b) < 65)) {
          data[i + 3] = 0; // 100% Transparent
        } else if (dist < 64) {
          // Smooth anti-aliased edge feathering
          const alphaRatio = Math.max(0, Math.min(1, (dist - 42) / 22));
          data[i + 3] = Math.round(alphaRatio * 255);
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setIsLoaded(true);
    };

    img.onerror = (e) => {
      console.warn('Could not load /ts-logo.jpg for canvas blending:', e);
      setIsLoaded(true);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open Royal Wedding Invitation"
      className={`group relative flex items-center justify-center cursor-pointer select-none focus:outline-none transition-transform duration-500 ease-out hover:scale-105 active:scale-95 ${className}`}
    >
      {/* 1. Realistic Organic Poured Wax Coin Body (Antique Champagne Pewter / Suede Gold) */}
      <div 
        className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center transition-all duration-500"
        style={{
          borderRadius: '49% 51% 50% 50% / 50% 49% 51% 50%',
          background: 'radial-gradient(circle at 35% 28%, #D8C7A3 0%, #B8A072 38%, #967E52 72%, #68532F 100%)',
          boxShadow: `
            0 16px 32px -8px rgba(12, 34, 59, 0.32),
            0 4px 12px rgba(12, 34, 59, 0.14),
            inset 0 2px 4px rgba(255, 250, 235, 0.65),
            inset 0 -3px 6px rgba(60, 45, 20, 0.55)
          `
        }}
      >
        {/* Subtle Ambient Hover Glow */}
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[#B8A072]/20 blur-md pointer-events-none" />

        {/* 2. Middle Hand-Stamped Beaded Ring */}
        <div 
          className="absolute inset-2 sm:inset-2.5 rounded-full border border-[#8C7449]/40 pointer-events-none"
          style={{
            boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.3), 0 1px 2px rgba(0, 0, 0, 0.15)'
          }}
        />

        {/* 3. Recessed Inner Wax Well */}
        <div 
          className="relative w-[76%] h-[76%] rounded-full flex items-center justify-center overflow-hidden"
          style={{
            background: 'radial-gradient(circle at 45% 40%, #BBA478 0%, #A48B5C 60%, #856E42 100%)',
            boxShadow: 'inset 0 3px 8px rgba(45, 32, 12, 0.45), 0 1px 1px rgba(255, 255, 255, 0.35)'
          }}
        >
          {/* Subtle Warm Underglow for the Monogram */}
          <div className="absolute inset-0 bg-[#E6C8C3]/10 mix-blend-overlay pointer-events-none" />

          {/* 4. Canvas with 100% Background-Stripped त-S Calligraphy & Flowers */}
          <canvas
            ref={canvasRef}
            className={`w-[88%] h-[88%] object-contain transition-opacity duration-500 filter drop-shadow-[0_2px_4px_rgba(40,28,10,0.35)] ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Graceful fallback if canvas is rendering */}
          {!isLoaded && (
            <div className="text-[#3A2C14] font-cormorant italic text-sm tracking-widest animate-pulse">
              त-S
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
