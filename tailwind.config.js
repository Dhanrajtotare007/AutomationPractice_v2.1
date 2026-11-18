/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        burgundy: {
          50: '#fdf2f4',
          100: '#fbe3e7',
          200: '#f6c6ce',
          300: '#ee9aa9',
          400: '#e1657e',
          500: '#d13c5c',
          600: '#b22a49',
          700: '#8f1f3a',
          800: '#761a31',
          900: '#5c1226',
          950: '#3b0a17',
        },
        cyan: {
          50: '#ecfeff',
          100: '#cffafd',
          200: '#a4f3fa',
          300: '#66e6f3',
          400: '#22d0e5',
          500: '#06b1c9',
          600: '#0891a6',
          700: '#0e7287',
          800: '#155c6e',
          900: '#164c5c',
          950: '#07323e',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16, 24, 40, 0.04), 0 8px 24px -12px rgba(16, 24, 40, 0.16)',
        lift: '0 10px 30px -12px rgba(92, 18, 38, 0.35)',
      },
      borderRadius: {
        xl2: '1.125rem',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateX(16px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 180ms ease-out both',
        'slide-in': 'slide-in 200ms ease-out both',
      },
    },
  },
  plugins: [],
};
