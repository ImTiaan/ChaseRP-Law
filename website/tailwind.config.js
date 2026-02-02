/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'chase-dark': '#050a08',
        'chase-green': '#0f2e26',
        'chase-accent': '#ff6b00', // Approximate orange from screenshot
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'glass-gradient': 'radial-gradient(circle at center, #0f2e26 0%, #050a08 100%)',
      }
    },
  },
  plugins: [],
}
