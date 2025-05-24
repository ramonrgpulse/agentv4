/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Cores brutais
        'brutal': {
          red: 'hsl(0, 84%, 60%)',
          orange: 'hsl(25, 95%, 53%)',
          yellow: 'hsl(45, 93%, 47%)',
          dark: 'hsl(240, 10%, 14%)',
          darker: 'hsl(240, 10%, 10%)',
          paper: 'hsl(54, 23%, 93%)',
          oldpaper: 'hsl(48, 38%, 92%)',
        },
        // Cores de texto
        'text': {
          primary: 'hsl(240, 10%, 10%)',
          secondary: 'hsl(240, 10%, 30%)',
          muted: 'hsl(240, 10%, 50%)',
          invert: 'hsl(0, 0%, 100%)',
        },
        // Cores de fundo
        'background': {
          DEFAULT: 'hsl(0, 0%, 100%)',
          paper: 'hsl(0, 0%, 98%)',
          muted: 'hsl(240, 10%, 96%)',
        },
        // Cores de borda
        'border': {
          DEFAULT: 'hsl(240, 10%, 85%)',
          hover: 'hsl(240, 10%, 70%)',
          focus: 'hsl(0, 84%, 60%)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'Oswald', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'pulse-brutal': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'pulse-brutal': 'pulse-brutal 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      boxShadow: {
        'brutal': '8px 8px 0px rgba(0, 0, 0, 0.2)',
        'brutal-sm': '4px 4px 0px rgba(0, 0, 0, 0.2)',
        'brutal-lg': '12px 12px 0px rgba(0, 0, 0, 0.2)',
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-brutal': 'linear-gradient(135deg, hsl(0, 84%, 60%) 0%, hsl(25, 95%, 53%) 100%)',
      },
      transitionProperty: {
        'width': 'width',
        'height': 'height',
        'spacing': 'margin, padding',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
        '10xl': '104rem',
      },
      zIndex: {
        '1': '1',
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),
  ],
}
