// Motion layer: scroll reveal, counters, sticky nav state.
// Purely visual; it never touches routing or API data.

const root = document.documentElement;
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let io = null;
let bound = false;

function ensureObserver() {
  if (io) return io;
  io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('in');
        if (el.dataset.count !== undefined) countUp(el);
        io.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
  );
  return io;
}

export function observeReveals() {
  if (!root.classList.contains('ready')) return;
  const obs = ensureObserver();
  document.querySelectorAll('.reveal:not(.in), [data-count]:not([data-done])').forEach((el) => obs.observe(el));
}

function countUp(el) {
  if (el.dataset.done) return;
  el.dataset.done = '1';
  const target = parseFloat(el.dataset.count);
  const dec = parseInt(el.dataset.dec || '0', 10);
  const pre = el.dataset.prefix || '';
  const suf = el.dataset.suffix || '';
  const fmt = (v) => `${pre}${v.toFixed(dec)}${suf}`;
  if (reduced() || !isFinite(target)) { el.textContent = fmt(target || 0); return; }
  const dur = 1800;
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min(1, (now - start) / dur);
    const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    el.textContent = fmt(target * eased);
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function bindGlobal() {
  if (bound) return;
  bound = true;

  // sticky nav state only
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      root.classList.toggle('scrolled', window.scrollY > 8);
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();
}

export function initMotion() {
  bindGlobal();
  observeReveals();
}

// No curtain: content simply becomes ready, then the hero animates in once.
export function runBoot() {
  return new Promise((resolve) => {
    root.classList.add('ready');
    observeReveals();
    resolve();
  });
}
