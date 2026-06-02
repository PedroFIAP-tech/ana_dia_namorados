export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        rose:    '#e8829a',
        gold:    '#c9a96e',
        'gold-light': '#e8d5b0',
        dark:    '#0a0a0a',
        'dark-2': '#111111',
        'dark-wine': '#1a0a0f',
      },
      fontFamily: {
        serif:  ['Cormorant Garamond', 'serif'],
        sans:   ['DM Sans', 'sans-serif'],
      },
      animation: {
        'fade-up':    'fadeUp 0.8s cubic-bezier(0.25,0.46,0.45,0.94) forwards',
        'fade-in':    'fadeIn 1.2s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float':      'float 6s ease-in-out infinite',
        'scroll-hint':'scrollHint 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:     { from:{ opacity:'0', transform:'translateY(40px)' }, to:{ opacity:'1', transform:'translateY(0)' } },
        fadeIn:     { from:{ opacity:'0' }, to:{ opacity:'1' } },
        float:      { '0%,100%':{ transform:'translateY(0)' }, '50%':{ transform:'translateY(-12px)' } },
        scrollHint: { '0%,100%':{ opacity:'0.3', transform:'translateY(0)' }, '50%':{ opacity:'1', transform:'translateY(8px)' } },
      },
    },
  },
  plugins: [],
}
