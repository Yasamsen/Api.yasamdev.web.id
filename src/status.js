import { esc, icon, refreshIcons } from './utils.js';
import { apiDefinitions, getCategories } from './apis/registry.js';

/* =========================================================
   HALAMAN STATUS SERVER
   Data diambil dari GET /api/stats tiap 3 detik, lalu DOM diperbarui di tempat
   (tanpa render ulang) supaya angka & grafik bergerak halus.
   ========================================================= */

const POLL_MS = 3000;
const HIST = 40;
const hist = { cpu: [], ram: [], ping: [] };
let last = null;
let failing = false;
let ping = null;
let updatedAt = null;
let timer = null;

const $ = (id) => document.getElementById(id);
const push = (arr, v) => { arr.push(v); if (arr.length > HIST) arr.shift(); };
const fmtNum = (n) => new Intl.NumberFormat('id-ID').format(Math.round(n));
const fmtBytes = (b) => (b >= 1073741824 ? `${(b / 1073741824).toFixed(1)} GB` : `${Math.round(b / 1048576)} MB`);
const fmtClock = (t) => new Date(t).toLocaleTimeString('id-ID', { hour12: false });
function fmtUptime(sec) {
  const d = Math.floor(sec / 86400); const h = Math.floor((sec % 86400) / 3600); const m = Math.floor((sec % 3600) / 60); const s = sec % 60;
  if (d) return `${d}h ${h}j`;
  if (h) return `${h}j ${m}m`;
  if (m) return `${m}m ${s}d`;
  return `${s} detik`;
}

/* ---------- grafik SVG ---------- */
function sparkline(values, max = 100) {
  if (values.length < 2) return '<div class="spark-empty">Mengumpulkan data…</div>';
  const w = 100; const h = 36;
  const pts = values.map((v, i) => `${((i * w) / (values.length - 1)).toFixed(1)},${(h - 3 - (Math.min(v, max) / max) * (h - 6)).toFixed(1)}`).join(' ');
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" class="spark" aria-hidden="true"><polygon points="0,${h} ${pts} ${w},${h}" style="fill:var(--c)" opacity=".16"/><polyline points="${pts}" fill="none" style="stroke:var(--c)" stroke-width="2.2" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
}
function bars(values) {
  const max = Math.max(1, ...values);
  const w = 100 / values.length;
  return `<svg viewBox="0 0 100 36" preserveAspectRatio="none" class="spark" aria-hidden="true">${values.map((v, i) => {
    const hh = v ? Math.max(2, (v / max) * 32) : 1;
    return `<rect x="${(i * w + w * 0.14).toFixed(2)}" y="${(36 - hh).toFixed(2)}" width="${(w * 0.72).toFixed(2)}" height="${hh.toFixed(2)}" rx="0.8" style="fill:var(--c)" opacity="${v ? 1 : 0.25}"/>`;
  }).join('')}</svg>`;
}

/* ---------- kerangka halaman ---------- */
function metricCard({ id, title, ic, color, bar = true, chart = true }) {
  return `<article class="card stcard p-5" style="--c:${color}">
    <div class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-3"><span class="iconbox h-10 w-10" style="--tile:${color};--tile-fg:#14102b">${icon(ic, 'h-5 w-5')}</span><h3 class="text-sm font-extrabold">${title}</h3></div>
    </div>
    <div class="mt-4 flex items-end gap-2"><span id="st-${id}" class="font-display text-[2.4rem] leading-none">—</span></div>
    ${bar ? `<div class="meter mt-4"><i id="st-${id}-bar" style="--p:0%"></i></div>` : ''}
    <p id="st-${id}-sub" class="mt-3 min-h-[2.5rem] text-xs leading-5 text-muted">Menunggu data…</p>
    ${chart ? `<div id="st-${id}-chart" class="mt-2 h-10"></div>` : ''}
  </article>`;
}

export function renderStatus() {
  const cats = getCategories();
  return `<main class="mx-auto max-w-7xl px-4 pb-24 pt-[calc(var(--nav-h)+40px)] sm:px-8 sm:pt-[calc(var(--nav-h)+64px)]">
    <div class="mb-8">
      <p class="sticker mb-5 text-sm"><i class="live-dot"></i>Live · diperbarui tiap ${POLL_MS / 1000} detik</p>
      <h1 class="text-balance text-[clamp(2.2rem,7vw,3.75rem)] leading-[1.05]">Status Server</h1>
      <p class="mt-5 max-w-xl text-[15px] leading-8 text-muted">Pantau kesehatan SamApi secara langsung: pemakaian CPU & RAM, jumlah request, dan waktu respons.</p>
    </div>

    <div id="st-banner" class="statbanner mb-6"><i class="live-dot"></i><div><p class="text-sm font-extrabold">Menghubungkan ke server…</p><p class="text-xs text-muted">Sebentar ya.</p></div></div>

    <div class="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2 lg:grid-cols-3">
      ${metricCard({ id: 'cpu', title: 'CPU', ic: 'Cpu', color: 'rgb(var(--gold2))' })}
      ${metricCard({ id: 'ram', title: 'RAM', ic: 'MemoryStick', color: 'rgb(var(--green))' })}
      ${metricCard({ id: 'req', title: 'Total request', ic: 'Activity', color: 'rgb(var(--yellow))', bar: false })}
      ${metricCard({ id: 'ms', title: 'Waktu respons', ic: 'Gauge', color: '#5bc0ff', bar: false })}
      ${metricCard({ id: 'up', title: 'Uptime', ic: 'Clock', color: '#ff7eb6', bar: false, chart: false })}
      ${metricCard({ id: 'err', title: 'Error server', ic: 'TriangleAlert', color: 'rgb(var(--red))', chart: false })}
    </div>

    <div class="mt-4 grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-2">
      <article class="card p-5 sm:p-6">
        <div class="mb-4 flex items-center gap-3"><span class="iconbox h-10 w-10" style="--tile:rgb(var(--yellow));--tile-fg:#14102b">${icon('Flame', 'h-5 w-5')}</span><div><h3 class="text-sm font-extrabold">Endpoint terpopuler</h3><p class="text-[11px] text-muted">Paling banyak diakses sejak server menyala</p></div></div>
        <div id="st-top" class="flex flex-col gap-3"><p class="py-6 text-center text-xs text-dim">Belum ada data.</p></div>
      </article>
      <article class="card p-5 sm:p-6">
        <div class="mb-4 flex items-center gap-3"><span class="iconbox h-10 w-10" style="--tile:rgb(var(--gold2))">${icon('Server', 'h-5 w-5')}</span><div><h3 class="text-sm font-extrabold">Informasi server</h3><p class="text-[11px] text-muted">Detail lingkungan yang menjalankan API</p></div></div>
        <dl id="st-info" class="stinfo">
          <div><dt>Endpoint terdaftar</dt><dd>${apiDefinitions.length} API · ${cats.length} kategori</dd></div>
          <div><dt>Runtime</dt><dd id="st-i-node">—</dd></div>
          <div><dt>Platform</dt><dd id="st-i-platform">—</dd></div>
          <div><dt>Wilayah</dt><dd id="st-i-region">—</dd></div>
          <div><dt>Prosesor</dt><dd id="st-i-cpu">—</dd></div>
          <div><dt>Memori proses</dt><dd id="st-i-proc">—</dd></div>
        </dl>
      </article>
    </div>

    <p class="mt-6 flex items-start gap-2 text-[11.5px] leading-5 text-dim">${icon('Info', 'mt-0.5 h-3.5 w-3.5 shrink-0')}<span>Angka berasal dari server yang sedang melayani kamu. Di hosting serverless (misalnya Vercel), tiap instance punya hitungan sendiri dan bisa mulai dari nol saat instance baru dibuat — jadi total request adalah sejak instance ini menyala, bukan seumur hidup situs.</span></p>
  </main>`;
}

/* ---------- pembaruan DOM ---------- */
const set = (id, text) => { const el = $(id); if (el && el.textContent !== text) el.textContent = text; };
const bar = (id, pct, tone) => {
  const el = $(id); if (!el) return;
  el.style.setProperty('--p', `${Math.max(1, Math.min(100, pct))}%`);
  el.dataset.tone = tone || '';
};
const tone = (pct) => (pct >= 90 ? 'bad' : pct >= 75 ? 'warn' : '');

function paintBanner() {
  const el = $('st-banner'); if (!el) return;
  let state = 'ok'; let title = 'Semua sistem normal'; let text = '';
  if (failing || !last) {
    state = last ? 'bad' : 'wait';
    title = last ? 'Tidak dapat terhubung ke server' : 'Menghubungkan ke server…';
    text = last ? `Menampilkan data terakhir (${fmtClock(updatedAt)}). Mencoba lagi otomatis.` : 'Sebentar ya.';
  } else {
    const r = last.requests;
    const errRate = r.total >= 20 ? (r.errors5xx / r.total) * 100 : 0;
    if (last.cpu.pct >= 90 || last.memory.pct >= 92 || errRate >= 10) {
      state = 'warn'; title = 'Beban server sedang tinggi';
    }
    text = `Ping ${ping ?? '—'} ms · diperbarui ${fmtClock(updatedAt)}`;
  }
  el.dataset.state = state;
  el.innerHTML = `${state === 'bad' ? icon('WifiOff', 'h-5 w-5 shrink-0') : state === 'warn' ? icon('TriangleAlert', 'h-5 w-5 shrink-0') : '<i class="live-dot"></i>'}<div><p class="text-sm font-extrabold">${title}</p><p class="text-xs text-muted">${text}</p></div>`;
  refreshIcons();
}

function paintTop(r) {
  const el = $('st-top'); if (!el) return;
  if (!r.top.length) { el.innerHTML = '<p class="py-6 text-center text-xs text-dim">Belum ada request tercatat.</p>'; return; }
  const max = r.top[0].count;
  el.innerHTML = r.top.map((t) => {
    const api = apiDefinitions.find((a) => a.endpoint === `/api/${t.route}`);
    return `<div><div class="mb-1 flex items-center justify-between gap-3 text-xs"><span class="min-w-0 truncate font-bold">${esc(api?.name || t.route)} <code class="ml-1 font-mono text-[10px] font-medium text-dim">${esc(`/api/${t.route}`.replace('/api/(', '('))}</code></span><span class="shrink-0 font-extrabold">${fmtNum(t.count)}</span></div><div class="meter meter-sm"><i style="--p:${Math.max(3, (t.count / max) * 100)}%"></i></div></div>`;
  }).join('');
}

function paint() {
  if (!$('st-banner')) return;
  paintBanner();
  if (!last) return;
  const { cpu, memory: m, requests: r, runtime: rt } = last;

  set('st-cpu', `${cpu.pct.toFixed(0)}%`);
  bar('st-cpu-bar', cpu.pct, tone(cpu.pct));
  set('st-cpu-sub', `${cpu.cores} core · load ${cpu.load[0].toFixed(2)} · proses Node ${cpu.processPct.toFixed(1)}%`);
  if ($('st-cpu-chart')) $('st-cpu-chart').innerHTML = sparkline(hist.cpu, 100);

  set('st-ram', `${m.pct.toFixed(0)}%`);
  bar('st-ram-bar', m.pct, tone(m.pct));
  set('st-ram-sub', `${fmtBytes(m.used)} dari ${fmtBytes(m.total)} terpakai`);
  if ($('st-ram-chart')) $('st-ram-chart').innerHTML = sparkline(hist.ram, 100);

  set('st-req', fmtNum(r.total));
  set('st-req-sub', `${fmtNum(r.lastMinute)} request menit ini · ${fmtNum(r.last5Min)} dalam 5 menit. Grafik: 30 menit terakhir.`);
  if ($('st-req-chart')) $('st-req-chart').innerHTML = bars(r.perMinute);

  set('st-ms', `${fmtNum(r.avgMs)} ms`);
  set('st-ms-sub', `Rata-rata server · p95 ${fmtNum(r.p95Ms)} ms · ping kamu ${ping ?? '—'} ms`);
  if ($('st-ms-chart')) $('st-ms-chart').innerHTML = sparkline(hist.ping, Math.max(100, ...hist.ping) * 1.15);

  set('st-up', fmtUptime(last.uptimeSec));
  set('st-up-sub', `Menyala sejak ${new Date(last.since).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}`);

  const rate = r.total ? (r.errors5xx / r.total) * 100 : 0;
  set('st-err', `${rate.toFixed(rate && rate < 10 ? 1 : 0)}%`);
  bar('st-err-bar', rate, rate >= 10 ? 'bad' : rate >= 3 ? 'warn' : '');
  set('st-err-sub', `${fmtNum(r.errors5xx)} error server · ${fmtNum(r.errors4xx)} error dari sisi pemanggil (4xx)`);

  paintTop(r);
  set('st-i-node', rt.node);
  set('st-i-platform', rt.platform);
  set('st-i-region', [rt.region, rt.env].filter(Boolean).join(' · ') || '—');
  set('st-i-cpu', cpu.model ? `${cpu.model}` : `${cpu.cores} core`);
  set('st-i-proc', `RSS ${fmtBytes(m.rss)} · heap ${fmtBytes(m.heapUsed)}/${fmtBytes(m.heapTotal)}`);
}

async function tick() {
  if (document.hidden || !$('st-banner')) return;
  const t0 = performance.now();
  try {
    const res = await fetch('/api/stats', { cache: 'no-store', headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json?.data) throw new Error('bad payload');
    ping = Math.round(performance.now() - t0);
    last = json.data;
    updatedAt = Date.now();
    failing = false;
    push(hist.cpu, last.cpu.pct);
    push(hist.ram, last.memory.pct);
    push(hist.ping, ping);
  } catch {
    failing = true;
  }
  paint();
}

export function stopStatus() {
  if (timer) { clearInterval(timer); timer = null; }
}

export function bindStatus() {
  stopStatus();
  paint();
  tick();
  timer = setInterval(tick, POLL_MS);
}

document.addEventListener('visibilitychange', () => { if (!document.hidden && timer) tick(); });
