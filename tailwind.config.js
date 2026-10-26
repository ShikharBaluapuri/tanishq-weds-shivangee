/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F7F4EE',
          canvas: '#FBF9F5',
          alabaster: '#EFECE4',
          warm: '#FAF8F5',
          deep: '#E8E1D3',
          border: '#E2DAC8',
        },
        sapphire: {
          DEFAULT: '#0C223B',
          light: '#143256',
          deep: '#081729',
          velvet: '#102845',
          navy: '#0D2B4E',
          card: '#0C223B',
        },
        champagne: {
          DEFAULT: '#B8A072',
          light: '#D5C4A1',
          dark: '#9A8052',
          bronze: '#7A643E',
          subtle: '#C8B58F',
        },
        rose: {
          blush: '#C48B83',
          light: '#E6C8C3',
          soft: '#F4E8E5',
        },
        // Backward-compatible semantic bridges
        ivory: {
          DEFAULT: '#FAF8F5',
          cream: '#EFECE4',
          silk: '#F7F4EE',
          dark: '#E2DAC8',
        },
        gold: {
          foil: '#B8A072',
          light: '#D5C4A1',
          champagne: '#B8A072',
          antique: '#9A8052',
          dark: '#9A8052',
          bronze: '#7A643E',
        },
        royal: {
          blue: '#0C223B',
          navy: '#143256',
          midnight: '#081729',
          sapphire: '#102845',
          ivory: '#FAF8F5',
          cream: '#EFECE4',
          gold: '#B8A072',
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
        'envelope': '0 28px 60px -15px rgba(12,34,59,0.22), 0 4px 16px -2px rgba(12,34,59,0.08)',
        'wax-seal': '0 16px 32px -8px rgba(12,34,59,0.32), inset 0 2px 4px rgba(255,250,235,0.65)',
        'quiet-card': '0 20px 48px -12px rgba(12,34,59,0.1), 0 2px 8px rgba(12,34,59,0.04)',
      }
    },
  },
  plugins: [],
}
