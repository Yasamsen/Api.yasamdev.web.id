// Efek "hidup" untuk hero: hujan karakter samar + terminal demo yang mengetik bergantian.
// Murni visual. Semua timer dibersihkan lewat stopHeroFx() setiap kali halaman dirender ulang.

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

let timers = [];
let rainStop = null;
let runId = 0;

const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.push(t); return t; };

export function stopHeroFx() {
  runId++;
  timers.forEach(clearTimeout);
  timers = [];
  if (rainStop) { rainStop(); rainStop = null; }
}

/* ---------- hujan karakter ---------- */
function startRain(canvas) {
  const ctx = canvas.getContext('2d');
  const glyphs = '01{}[]<>/$#&*+=;:'.split('');
  const size = 15;
  let w = 0, h = 0, drops = [], visible = true, timer = null;

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.max(1, Math.floor(r.width)); h = Math.max(1, Math.floor(r.height));
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drops = Array.from({ length: Math.ceil(w / size) }, () => -Math.random() * (h / size));
  };
  const frame = () => {
    if (!visible || !document.documentElement.classList.contains('dark')) return;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';
    ctx.font = `${size - 2}px "IBM Plex Mono", monospace`;
    drops.forEach((y, i) => {
      const x = i * size;
      ctx.fillStyle = 'rgba(190,255,215,0.95)';
      ctx.fillText(glyphs[(Math.random() * glyphs.length) | 0], x, y * size);
      ctx.fillStyle = 'rgba(61,255,138,0.55)';
      ctx.fillText(glyphs[(Math.random() * glyphs.length) | 0], x, (y - 1) * size);
      drops[i] = y * size > h && Math.random() > 0.975 ? 0 : y + 0.5;
    });
  };

  resize();
  timer = setInterval(frame, 70);
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
  io.observe(canvas);
  const onResize = () => resize();
  window.addEventListener('resize', onResize, { passive: true });
  return () => { clearInterval(timer); io.disconnect(); window.removeEventListener('resize', onResize); };
}

/* ---------- terminal demo ---------- */
const K = (t) => `<span class="tk-p">"${t}"</span>`;
const S = (t) => `<span class="tk-s">"${esc(t)}"</span>`;
const N = (t) => `<span class="tk-n">${t}</span>`;
const B = (t) => `<span class="tk-k">${t}</span>`;

const DEMOS = [
  {
    req: '/api/instagram?url=https://instagram.com/p/Cx1a', ms: 118,
    res: ['{', `  ${K('success')}: ${B('true')},`, `  ${K('data')}: {`, `    ${K('media')}: [{ ${K('url')}: ${S('https://…/video.mp4')} }]`, '  }', '}'],
  },
  {
    req: '/api/weather?city=Jakarta', ms: 96,
    res: ['{', `  ${K('success')}: ${B('true')},`, `  ${K('data')}: {`, `    ${K('city')}: ${S('Jakarta')},`, `    ${K('temperature')}: { ${K('celsius')}: ${N('30')} },`, `    ${K('condition')}: ${S('Partly cloudy')}`, '  }', '}'],
  },
  {
    req: '/api/npmstalk?package=axios', ms: 104,
    res: ['{', `  ${K('status')}: ${B('true')},`, `  ${K('source')}: ${S('NPM Registry')},`, `  ${K('data')}: {`, `    ${K('name')}: ${S('axios')},`, `    ${K('versionLatest')}: ${S('1.x.x')}`, '  }', '}'],
  },
];

export function startHeroFx() {
  stopHeroFx();
  const id = runId;
  const live = () => id === runId;

  const canvas = document.getElementById('rain');
  if (canvas && !reduced()) rainStop = startRain(canvas);

  const reqEl = document.getElementById('demo-req');
  const resEl = document.getElementById('demo-res');
  const stEl = document.getElementById('demo-status');
  if (!reqEl || !resEl) return;

  const paint = (demo, typed, lines, done) => {
    reqEl.textContent = demo.req.slice(0, typed);
    resEl.innerHTML = lines.join('\n');
    if (stEl) stEl.textContent = done ? `200 · ${demo.ms}ms` : '…';
  };

  // reduced motion / theme-switch (silent): tampilkan hasil akhir saja, tanpa loop
  if (reduced() || document.documentElement.classList.contains('silent')) {
    const d = DEMOS[0];
    paint(d, d.req.length, d.res, true);
    return;
  }

  let n = 0;
  const run = () => {
    if (!live()) return;
    const demo = DEMOS[n++ % DEMOS.length];
    paint(demo, 0, [], false);
    let i = 0;
    const typeNext = () => {
      if (!live()) return;
      if (i <= demo.req.length) { paint(demo, i++, [], false); later(typeNext, 22 + Math.random() * 34); return; }
      later(() => showRes(demo, 0), 380);
    };
    const showRes = (d, k) => {
      if (!live()) return;
      if (k <= d.res.length) { paint(d, d.req.length, d.res.slice(0, k), k === d.res.length); later(() => showRes(d, k + 1), 120); return; }
      later(run, 3600);
    };
    // jeda awal agar urutan masuk hero selesai dulu pada kunjungan pertama
    later(typeNext, n === 1 ? 900 : 250);
  };
  run();
}
