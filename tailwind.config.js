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
        accent: c('accent'),
        accent2: c('accent2'),
        cyan: c('cyan'),
        ok: c('ok'),
        warn: c('warn'),
      },
      fontFamily: {
        display: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
        sans: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
