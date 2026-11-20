/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /** Primary – deep indigo (Automation Practice brand). */
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        /** Accent – teal, used for highlights, badges and success states. */
        accent: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        /** Secondary – dark navy, used for the hero surface and dark UI. */
        navy: {
          50: '#f5f7fa',
          100: '#e7ebf3',
          200: '#c9d2e3',
          300: '#a3b0c9',
          400: '#6f80a1',
          500: '#4b5b7a',
          600: '#36435c',
          700: '#222c40',
          800: '#161e2e',
          900: '#111827',
          950: '#0a0f1a',
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
        card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 12px 32px -18px rgba(15, 23, 42, 0.22)',
        lift: '0 18px 40px -24px rgba(30, 27, 75, 0.45)',
        glow: '0 24px 70px -30px rgba(79, 70, 229, 0.55)',
      },
      borderRadius: {
        xl2: '1rem',
        xl3: '1.5rem',
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
        'rise-in': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 180ms ease-out both',
        'slide-in': 'slide-in 200ms ease-out both',
        'rise-in': 'rise-in 420ms cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
};
