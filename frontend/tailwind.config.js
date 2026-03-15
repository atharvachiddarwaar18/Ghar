/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FBF7F0',
        'cream-dark': '#F3EBD8',
        brown: {
          DEFAULT: '#8B4513',
          light: '#A0522D',
          dark: '#6B3410',
        },
        gold: {
          DEFAULT: '#D4A574',
          light: '#E8C9A0',
          dark: '#B8864A',
        },
        dark: '#1C0A00',
        amber: '#C17F24',
        textbrown: '#4A3728',
        softgray: '#F5F1EB',
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero': "url('/images/background image.png')",
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
      animation: {
        'scroll-left': 'scrollLeft 40s linear infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        scrollLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'card': '0 4px 20px rgba(139, 69, 19, 0.1)',
        'card-hover': '0 8px 32px rgba(139, 69, 19, 0.2)',
        'nav': '0 2px 20px rgba(28, 10, 0, 0.08)',
      },
    },
  },
  plugins: [],
}
