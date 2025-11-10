/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        spacefont: ['spacefont', 'sans-serif'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#00F5FF", // Cyan glow
          hover: "#33F7FF",
          active: "#00D6DB",
        },
        secondary: {
          DEFAULT: "#8B5CF6", // Violet glow
          hover: "#A78BFA",
          active: "#7C3AED",
        },
        dark: {
          DEFAULT: "#0A0A0A",
          100: "#121212",
          200: "#1A1A1A",
          300: "#2A2A2A",
        },
        card: {
          DEFAULT: "var(--background)",
          foreground: "var(--foreground)",
        },
      },
      animation: {
        spotlight: "spotlight 2s ease .75s 1 forwards",
        'float': "float 6s ease-in-out infinite",
        'pulse-glow': "pulse-glow 2s ease-in-out infinite",
        'slide-up-fade': "slide-up-fade 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        'slide-down-fade': "slide-down-fade 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        'slide-left-fade': "slide-left-fade 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        'slide-right-fade': "slide-right-fade 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        spotlight: {
          "0%": {
            opacity: 0,
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: 1,
            transform: "translate(-50%,-40%) scale(1)",
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { 
            opacity: 1,
            boxShadow: '0 0 10px 2px rgba(0, 245, 255, 0.5), 0 0 20px 4px rgba(139, 92, 246, 0.3)'
          },
          '50%': { 
            opacity: 0.8,
            boxShadow: '0 0 15px 3px rgba(0, 245, 255, 0.7), 0 0 30px 6px rgba(139, 92, 246, 0.5)'
          },
        },
        'slide-up-fade': {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'slide-down-fade': {
          '0%': { opacity: 0, transform: 'translateY(-20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'slide-left-fade': {
          '0%': { opacity: 0, transform: 'translateX(20px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        'slide-right-fade': {
          '0%': { opacity: 0, transform: 'translateX(-20px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'circuit-pattern': "url('/images/circuit-pattern.svg')",
        'hero-gradient': 'linear-gradient(to bottom right, rgba(0, 245, 255, 0.15), rgba(139, 92, 246, 0.15))',
      },
      boxShadow: {
        'neon-cyan': '0 0 5px rgba(0, 245, 255, 0.5), 0 0 20px rgba(0, 245, 255, 0.3)',
        'neon-violet': '0 0 5px rgba(139, 92, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3)',
        'neon-glow': '0 0 10px rgba(0, 245, 255, 0.5), 0 0 20px rgba(139, 92, 246, 0.3)',
      },
    },
  },
  plugins: [
     require('@tailwindcss/typography'),
  ],
}
