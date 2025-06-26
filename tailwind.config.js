/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        retro: {
          pink: '#ff69b4',
          blue: '#00ffff',
          green: '#00ff00',
          yellow: '#ffff00',
          purple: '#ff00ff',
        }
      },
      fontFamily: {
        'retro': ['"Press Start 2P"', '"VT323"', 'Courier New', 'Courier', 'monospace'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-glow': 'pulse-glow 1.5s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #ff69b4, 0 0 10px #ff69b4, 0 0 15px #ff69b4' },
          '100%': { boxShadow: '0 0 10px #ff69b4, 0 0 20px #ff69b4, 0 0 30px #ff69b4' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px #00ffff, 0 0 10px #00ffff' },
          '50%': { boxShadow: '0 0 20px #00ffff, 0 0 30px #00ffff' },
        },
      },
    },
  },
  plugins: [],
} 