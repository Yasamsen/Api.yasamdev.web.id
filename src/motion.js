// Motion layer: preloader, scroll reveal, counters, spotlight, parallax, magnetic buttons.
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

  // progress bar + sticky nav state
  const bar = document.createElement('div');
  bar.id = 'progress';
  document.body.appendChild(bar);
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      root.style.setProperty('--p', max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : '0');
      root.classList.toggle('scrolled', window.scrollY > 24);
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  // spotlight on cards + global parallax + magnetic buttons
  let raf = 0;
  document.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    const spot = e.target.closest?.('.card');
    if (spot) {
      const r = spot.getBoundingClientRect();
      spot.style.setProperty('--mx', `${e.clientX - r.left}px`);
      spot.style.setProperty('--my', `${e.clientY - r.top}px`);
    }
    const mag = e.target.closest?.('[data-magnetic]');
    if (mag) {
      const r = mag.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      mag.style.transform = `translate(${dx * 10}px, ${dy * 8}px)`;
    }
    if (!raf) {
      raf = requestAnimationFrame(() => {
        raf = 0;
        root.style.setProperty('--px', ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3));
        root.style.setProperty('--py', ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3));
      });
    }
  });
  document.addEventListener('pointerout', (e) => {
    const mag = e.target.closest?.('[data-magnetic]');
    if (mag && !mag.contains(e.relatedTarget)) mag.style.transform = '';
  });
}

export function initMotion() {
  bindGlobal();
  observeReveals();
}

// Luxurious first-visit curtain (once per session). Resolves when content may animate in.
export function runBoot() {
  return new Promise((resolve) => {
    let seen = false;
    try { seen = sessionStorage.getItem('samapi-booted') === '1'; } catch { /* storage blocked */ }
    const finish = () => { root.classList.add('ready'); observeReveals(); resolve(); };

    if (seen || reduced()) { finish(); return; }

    const pre = document.createElement('div');
    pre.id = 'preloader';
    pre.innerHTML = `<div class="flex flex-col items-center gap-6">
      <svg width="74" height="74" viewBox="0 0 74 74" fill="none"><circle cx="37" cy="37" r="30" stroke="rgb(var(--gold))" stroke-width="1.4" class="ring" transform="rotate(-90 37 37)"/><path d="M40 20 28 39h8l-2 15 12-20h-8z" fill="rgb(var(--gold))"/></svg>
      <div class="word font-display text-3xl tracking-wide">Sam<span style="color:rgb(var(--gold))">Api</span></div>
    </div>`;
    document.body.appendChild(pre);

    setTimeout(() => {
      pre.classList.add('out');
      finish();
      try { sessionStorage.setItem('samapi-booted', '1'); } catch { /* ignore */ }
      setTimeout(() => pre.remove(), 1000);
    }, 1400);
  });
}
