/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#818cf8',
          DEFAULT: '#6366f1',
          dark: '#4f46e5',
          glow: 'rgba(99, 102, 241, 0.15)',
        },
        background: {
          deep: '#05070a',
          card: 'rgba(13, 17, 23, 0.6)',
        }
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 12px 40px 0 rgba(0, 0, 0, 0.4)',
        'brand': '0 10px 25px -5px rgba(99, 102, 241, 0.2)',
      },
      backgroundImage: {
        'noise': "url('https://grainy-gradients.vercel.app/noise.svg')",
      }
    },
  },
  plugins: [],
}
