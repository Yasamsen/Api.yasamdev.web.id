// Lapisan animasi saja — tidak menyentuh data, endpoint, atau metadata.
const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const SEL = '#page main > section:not(:first-child) > *, #api-grid > *, #docs-cards > *, #page main > div > *';

const io = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
}), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

function scan() {
  document.querySelectorAll(SEL).forEach((el) => {
    if (el.dataset.rv) return;
    el.dataset.rv = '1';
    const idx = [...el.parentElement.children].indexOf(el);
    const inGrid = el.matches('#api-grid > *, #docs-cards > *');
    el.style.setProperty('--d', (inGrid ? (idx % 3) * 90 : Math.min(idx, 5) * 80) + 'ms');
    el.classList.add('rv');
    if (inGrid) el.classList.add('glow-card');
    if (reduce || root.classList.contains('no-anim')) el.classList.add('is-in'); else io.observe(el);
  });
}

let queued = false;
new MutationObserver(() => {
  if (queued) return; queued = true;
  requestAnimationFrame(() => { queued = false; scan(); });
}).observe(document.body, { childList: true, subtree: true });
scan();

// Ganti tema: render ulang tanpa memutar ulang animasi
document.addEventListener('click', (e) => {
  if (!e.target.closest?.('#theme-btn, #mobile-theme-btn')) return;
  root.classList.add('no-anim');
  setTimeout(() => root.classList.remove('no-anim'), 120);
}, true);

// Bayangan header saat scroll
addEventListener('scroll', () => root.classList.toggle('scrolled', scrollY > 8), { passive: true });

// Kilau kartu mengikuti kursor (desktop)
document.addEventListener('pointermove', (e) => {
  if (e.pointerType === 'touch') return;
  const c = e.target.closest?.('.glow-card');
  if (!c) return;
  const r = c.getBoundingClientRect();
  c.style.setProperty('--mx', e.clientX - r.left + 'px');
  c.style.setProperty('--my', e.clientY - r.top + 'px');
}, { passive: true });
