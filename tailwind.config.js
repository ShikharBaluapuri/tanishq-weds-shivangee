/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        botanical: {
          forest: '#354F3B',
          forestDark: '#2A3F2F',
          forestDeep: '#1E2F23',
          cypress: '#16241B',
          sage: '#7A917F',
          sageLight: '#DDE5DE',
          sageMist: '#EAEee8',
          alabaster: '#F4F6F3',
          ivory: '#FDFBF7',
          stone: '#E8E6DF',
          stoneDark: '#DCD9D0',
          cream: '#E8E4D8',
          brass: '#C5A869',
          brassDark: '#9E7E38',
          brassLight: '#E2CA94',
        },
        // Graceful aliases for existing components
        royal: {
          ivory: '#F4F6F3',
          cream: '#EAEee8',
          parchment: '#E8E6DF',
          gold: '#C5A869',
          goldLight: '#E8E4D8',
          goldDark: '#9E7E38',
          bronze: '#7A917F',
          maroon: '#1E2F23',
          maroonDark: '#16241B',
          crimson: '#2A3F2F',
          emerald: '#354F3B',
          indigo: '#1E2F23',
          haldi: '#C5A869',
          vermilion: '#B08D44',
        }
      },
      fontFamily: {
        script: ['"Pinyon Script"', '"Great Vibes"', '"Alex Brush"', 'cursive'],
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
        'envelope': '0 25px 50px -12px rgba(22, 36, 27, 0.25), 0 0 0 1px rgba(197, 168, 105, 0.2)',
        'wax-seal': '0 6px 16px rgba(0,0,0,0.25), inset 0 1px 2px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.3)',
        'botanical': '0 20px 40px -15px rgba(30, 47, 35, 0.08), 0 0 0 1px rgba(197, 168, 105, 0.2)',
        'brass-glow': '0 0 30px rgba(197, 168, 105, 0.25)',
      }
    },
  },
  plugins: [],
}
