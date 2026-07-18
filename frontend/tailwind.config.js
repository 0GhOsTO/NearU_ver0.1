/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['var(--font-dm-sans)',  'system-ui', 'sans-serif'],
        display: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
      colors: {
        nu: {
          bg:         '#F8FAFC',   // body background — very light slate-white
          surface:    '#FFFFFF',   // card surface — pure white
          elevated:   '#F1F5F9',   // hover/input fill — light slate
          border:     '#E2E8F0',   // borders — slate-200
          blue:       '#2563EB',   // primary trust blue
          'blue-dark':'#1D4ED8',   // hover state
          'blue-light':'#EFF6FF',  // tint backgrounds
          coral:      '#EF4444',   // danger / alerts
          mint:       '#059669',   // success / money in
          text:       '#0F172A',   // primary text — slate-900
          muted:      '#475569',   // secondary text — slate-600
          dim:        '#94A3B8',   // placeholder / timestamps — slate-400
        },
      },
      animation: {
        'fade-up':    'fadeUp 0.5s ease-out both',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'nu-grid': "linear-gradient(rgba(37,99,235,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        'nu-grid': '40px 40px',
      },
      boxShadow: {
        'card':    '0 1px 3px 0 rgba(15,23,42,0.08), 0 1px 2px -1px rgba(15,23,42,0.06)',
        'card-md': '0 4px 12px 0 rgba(15,23,42,0.10), 0 2px 4px -2px rgba(15,23,42,0.06)',
        'blue':    '0 4px 14px 0 rgba(37,99,235,0.25)',
      },
    },
  },
  plugins: [],
};
