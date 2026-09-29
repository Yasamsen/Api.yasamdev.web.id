const c = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  // utility Tailwind (hidden, md:hidden, dst) harus selalu menang atas class komponen di index.css
  important: true,
  content: ['./index.html', './src/**/*.{js,html}'],
  theme: {
    extend: {
      colors: {
        bg: c('bg'),
        surface: c('surface'),
        fg: c('fg'),
        muted: c('muted'),
        dim: c('dim'),
        gold: c('gold'),
        gold2: c('gold2'),
        ok: c('ok'),
        warn: c('warn'),
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
