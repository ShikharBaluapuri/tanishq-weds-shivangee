/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Master Ultra-Luxury Heritage Palette
        heritage: {
          sage: '#41584C',         // Deep Heritage Sage
          sageDark: '#2C3E34',     // Darkened Heritage Sage
          sageDeep: '#1E2D25',     // Forest Night Sage
          botanical: '#657968',    // Muted Botanical Green
          eucalyptus: '#A4B3A1',   // Soft Eucalyptus
          ivory: '#F5F0E5',        // Antique Ivory
          paper: '#EAE2D3',        // Warm Handmade Paper
          gold: '#C3A56B',         // Champagne Gold
          brass: '#A78343',        // Antique Brass
          olive: '#343F35',        // Dark Olive Ink
          rose: '#A76D6B',         // Muted Floral Rose
        },
        // Graceful aliases for backwards compatibility
        botanical: {
          forest: '#41584C',
          forestDark: '#2C3E34',
          forestDeep: '#1E2D25',
          cypress: '#343F35',
          sage: '#657968',
          sageLight: '#A4B3A1',
          sageMist: '#EAE2D3',
          alabaster: '#F5F0E5',
          ivory: '#FDFBF7',
          stone: '#EAE2D3',
          stoneDark: '#D8CFBF',
          cream: '#F5F0E5',
          brass: '#C3A56B',
          brassDark: '#A78343',
          brassLight: '#E0CB9B',
        },
        royal: {
          ivory: '#F5F0E5',
          cream: '#EAE2D3',
          parchment: '#EAE2D3',
          gold: '#C3A56B',
          goldLight: '#E0CB9B',
          goldDark: '#A78343',
          bronze: '#657968',
          maroon: '#343F35',
          maroonDark: '#1E2D25',
          crimson: '#2C3E34',
          emerald: '#41584C',
          indigo: '#1E2D25',
          haldi: '#C3A56B',
          vermilion: '#A78343',
        }
      },
      fontFamily: {
        script: ['"Pinyon Script"', '"Great Vibes"', 'cursive'],
        pinyon: ['"Pinyon Script"', 'cursive'],
        greatvibes: ['"Great Vibes"', 'cursive'],
        cormorant: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        devanagari: ['"Tiro Devanagari Sanskrit"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 50s linear infinite',
        'pulse-subtle': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-gentle': 'float-gentle 6s ease-in-out infinite',
      },
      keyframes: {
        'float-gentle': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      },
      boxShadow: {
        'envelope': '0 25px 60px -15px rgba(26, 38, 30, 0.4), 0 0 0 1px rgba(195, 165, 107, 0.25)',
        'wax-seal': '0 12px 28px -4px rgba(22, 34, 26, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.5), inset 0 -3px 6px rgba(50, 36, 12, 0.5)',
        'botanical': '0 20px 45px -15px rgba(32, 45, 36, 0.08), 0 0 0 1px rgba(195, 165, 107, 0.2)',
        'brass-glow': '0 0 35px rgba(195, 165, 107, 0.3)',
      }
    },
  },
  plugins: [],
}
