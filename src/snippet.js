import { esc, icon, refreshIcons, copyText } from './utils.js';
import { uiState } from './categories.js';
import { observeReveals } from './motion.js';

/* =========================================================
   SNIPPET — perpustakaan kode (data dari /api/snippet/*)
   Rute: /snippet (daftar) dan /snippet/<slug> (detail).
   ========================================================= */

const SORTS = {
  new: ['Terbaru', (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)],
  pop: ['Terpopuler', (a, b) => b.views - a.views],
  copy: ['Terbanyak disalin', (a, b) => b.copies - a.copies],
  az: ['A–Z', (a, b) => a.title.localeCompare(b.title)],
};
const EXT = { javascript: 'js', typescript: 'ts', python: 'py', html: 'html', css: 'css', bash: 'sh', shell: 'sh', json: 'json', php: 'php', java: 'java', go: 'go', rust: 'rs', sql: 'sql', text: 'txt' };
const TILES = ['rgb(var(--yellow))', 'rgb(var(--green))', '#cdbfff', '#ff9fb1', '#9bd8ff', '#ffb8d9'];

const store = { list: null, loading: false, error: '', items: new Map() };

/* ---------- helpers ---------- */

const norm = (c) => ({ ...c, category: c.category || 'Lainnya', language: c.language || 'text', views: c.views || 0, copies: c.copies || 0, description: c.description || '', install: c.install || '' });
const keyOf = (c) => c.slug || c.id;
const rawUrl = (c) => `${window.location.origin}/raw/${keyOf(c)}`;
const curlCmd = (c) => `curl -sL ${rawUrl(c)}`;
const fmtDate = (s) => (s ? new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '');
const fmtNum = (n) => Number(n || 0).toLocaleString('id-ID');
const hue = (s) => { let h = 0; for (const ch of String(s).toLowerCase()) h = (h * 31 + ch.charCodeAt(0)) % 997; return h; };
const badge = (t) => `<span class="badge" style="background:${TILES[hue(t) % TILES.length]}">${esc(t)}</span>`;
const flash = (btn, html, ms = 1600) => {
  if (btn.dataset.busy) return;
  btn.dataset.busy = '1';
  const old = btn.innerHTML;
  btn.innerHTML = html;
  refreshIcons();
  setTimeout(() => { btn.innerHTML = old; delete btn.dataset.busy; refreshIcons(); }, ms);
};

async function api(path, opt = {}) {
  let r;
  try { r = await fetch(path, opt); } catch { throw new Error('Tidak dapat menghubungi server. Periksa koneksi internetmu.'); }
  const raw = await r.text();
  let d = {};
  try { d = raw ? JSON.parse(raw) : {}; } catch { throw new Error(`Server mengirim respons yang tidak terbaca (HTTP ${r.status}).`); }
  if (!r.ok || d.status === false) throw new Error(d.message || `Permintaan gagal (HTTP ${r.status})`);
  return d.data;
}

const track = (id, event) => fetch(`/api/snippet/event?id=${encodeURIComponent(id)}&event=${event}`, { method: 'POST', keepalive: true }).catch(() => {});

async function fetchItem(id) {
  if (store.items.has(id)) return store.items.get(id);
  const c = norm(await api(`/api/snippet/item?id=${encodeURIComponent(id)}`));
  store.items.set(id, c);
  return c;
}

/* =========================================================
   DAFTAR /snippet
   ========================================================= */

const S = () => uiState.snippet;

function filtered() {
  const { q, cat, lang, sort } = S();
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  return (store.list || [])
    .filter((c) => (!cat || c.category === cat) && (!lang || c.language === lang)
      && words.every((w) => `${c.title} ${c.description} ${c.language} ${c.category} ${c.install}`.toLowerCase().includes(w)))
    .sort(SORTS[sort][1]);
}

function chipsHtml() {
  const all = store.list || [];
  const s = S();
  const cats = [...new Set(all.map((c) => c.category))].sort();
  const base = s.cat ? all.filter((c) => c.category === s.cat) : all;
  const langs = [...new Set(base.map((c) => c.language))].sort();
  if (s.lang && !langs.includes(s.lang)) s.lang = '';
  const chip = (attr, val, label, n, on) => `<button data-${attr}="${esc(val)}" class="chip ${on ? 'is-active' : ''}" aria-pressed="${on}">${esc(label)}${n === undefined ? '' : `<span class="chipn">${n}</span>`}</button>`;
  return {
    cats: chip('sn-cat', '', 'Semua', all.length, !s.cat) + cats.map((k) => chip('sn-cat', k, k, all.filter((c) => c.category === k).length, s.cat === k)).join(''),
    langs: chip('sn-lang', '', 'Semua bahasa', undefined, !s.lang) + langs.map((l) => chip('sn-lang', l, l, undefined, s.lang === l)).join(''),
  };
}

function snippetCard(c, i) {
  const k = encodeURIComponent(keyOf(c));
  return `<div class="reveal" style="--d:${(i % 3) * 70}ms"><article class="card flex h-full flex-col p-5 sm:p-6">
    <div class="mb-4 flex items-start justify-between gap-3">
      <div class="flex min-w-0 flex-wrap items-center gap-1.5">${badge(c.category)}${badge(c.language)}</div>
      <button data-sn-copy="${esc(keyOf(c))}" class="iconbtn !h-9 !w-9 shrink-0" aria-label="Salin kode ${esc(c.title)}" title="Salin kode">${icon('Copy', 'h-4 w-4')}</button>
    </div>
    <h3 class="mb-1.5 text-base font-bold tracking-[-0.01em]"><button data-nav="/snippet/${k}" class="text-left transition-colors hover:text-gold">${esc(c.title)}</button></h3>
    <p class="mb-5 min-h-[48px] text-sm leading-6 text-muted line-clamp-2">${esc(c.description || 'Source code tersimpan di Snippet SamApi.')}</p>
    <div class="code-url mb-3 flex items-center gap-2 py-2 pl-3 pr-2">
      ${icon('Terminal', 'h-3.5 w-3.5 shrink-0 text-[#a79fcb]')}
      <code class="min-w-0 flex-1 truncate">${esc(curlCmd(c))}</code>
      <button data-copy="${esc(curlCmd(c))}" class="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[#a79fcb] transition-colors hover:bg-white/10 hover:text-white" aria-label="Salin perintah curl">${icon('Copy', 'h-3.5 w-3.5')}</button>
    </div>
    ${c.install ? `<div class="mb-3 truncate rounded-xl border-2 border-dashed border-ink/40 px-3 py-1.5 font-mono text-[11px] text-muted"><b class="text-gold">$</b> ${esc(c.install)}</div>` : ''}
    <div class="mt-auto flex items-center justify-between gap-2 border-t hair pt-4">
      <div class="flex items-center gap-3 text-xs font-bold text-dim"><span class="inline-flex items-center gap-1" title="Dilihat">${icon('Eye', 'h-3.5 w-3.5')}${fmtNum(c.views)}</span><span class="inline-flex items-center gap-1" title="Disalin">${icon('Copy', 'h-3.5 w-3.5')}${fmtNum(c.copies)}</span></div>
      <button data-nav="/snippet/${k}" class="btn btn-gold btn-sm">Lihat kode ${icon('ArrowRight', 'arr h-3.5 w-3.5')}</button>
    </div>
  </article></div>`;
}

const skeletonCard = () => `<div class="card p-6"><div class="skeleton !bg-fg/10 mb-4 h-5 w-1/2"></div><div class="skeleton !bg-fg/10 mb-2 h-4 w-3/4"></div><div class="skeleton !bg-fg/10 mb-6 h-4 w-2/3"></div><div class="skeleton !bg-fg/10 h-10 w-full"></div></div>`;

function resultHtml() {
  if (store.error) {
    return `<div class="rounded-3xl border-2 border-dashed border-ink px-4 py-16 text-center">${icon('CloudOff', 'mx-auto h-9 w-9 text-dim')}<p class="mt-4 text-sm font-extrabold">Snippet tidak bisa dimuat</p><p class="mx-auto mt-1 max-w-sm text-xs leading-5 text-muted">${esc(store.error)}</p><button data-sn-retry class="btn btn-gold btn-sm mt-6">${icon('RotateCcw', 'h-3.5 w-3.5')} Coba lagi</button></div>`;
  }
  if (!store.list) return `<div class="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">${Array(6).fill(skeletonCard()).join('')}</div>`;
  const list = filtered();
  if (!list.length) {
    return `<div class="rounded-3xl border-2 border-dashed border-ink px-4 py-16 text-center">${icon('SearchX', 'mx-auto h-9 w-9 text-dim')}<p class="mt-4 text-sm font-extrabold">${store.list.length ? 'Tidak ada snippet yang cocok' : 'Belum ada snippet'}</p><p class="mt-1 text-xs text-dim">${store.list.length ? 'Coba kata kunci lain atau pilih kategori yang berbeda.' : 'Snippet pertama akan muncul di sini setelah ditambahkan lewat halaman admin.'}</p>${store.list.length ? `<button data-sn-reset class="btn btn-ghost btn-sm mt-6">${icon('RotateCcw', 'h-3.5 w-3.5')} Reset filter</button>` : ''}</div>`;
  }
  return `<div class="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">${list.map(snippetCard).join('')}</div>`;
}

function metaHtml() {
  if (!store.list) return store.error ? 'Gagal memuat' : 'Memuat snippet…';
  const n = filtered().length;
  const total = store.list.length;
  return n === total ? `<b class="text-fg">${total}</b> snippet` : `Menampilkan <b class="text-fg">${n}</b> dari ${total} snippet`;
}

function statsHtml() {
  const l = store.list || [];
  const box = (v, label) => `<div class="stat-box"><div class="font-display text-2xl sm:text-4xl">${store.list ? fmtNum(v) : '–'}</div><div class="mt-1 text-[11px] font-bold sm:text-xs">${label}</div></div>`;
  return box(l.length, 'Snippet aktif') + box(l.reduce((s, c) => s + c.copies, 0), 'Kali disalin') + box(l.reduce((s, c) => s + c.views, 0), 'Kali dilihat');
}

export function renderSnippetList() {
  const s = S();
  const ch = chipsHtml();
  return `<main>
  <section class="pb-10 pt-[calc(var(--nav-h)+40px)] sm:pb-14 sm:pt-[calc(var(--nav-h)+80px)]">
    <div class="mx-auto max-w-7xl px-4 sm:px-8">
      <div class="grid grid-cols-[minmax(0,1fr)] items-end gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p class="seq sticker mb-6 text-sm" style="--d:.1s">${icon('Code', 'h-4 w-4')} Library kode</p>
          <h1 class="text-balance text-[clamp(2.2rem,8vw,4.5rem)] leading-[1.02]">
            <span class="hl"><span style="--d:.2s">Script siap pakai.</span></span>
            <span class="hl"><span class="text-gold" style="--d:.34s">Tinggal salin.</span></span>
          </h1>
          <p class="seq mt-6 max-w-md text-base leading-8 text-muted" style="--d:.55s">Cari snippet, salin kodenya, atau ambil langsung lewat satu baris <code class="font-mono text-[0.9em] font-bold text-fg">curl</code>.</p>
          <div class="seq mt-8 flex flex-col gap-3 sm:flex-row" style="--d:.7s">
            <button data-scroll="sn-results" class="btn btn-gold">Jelajahi snippet ${icon('ArrowRight', 'arr h-4 w-4')}</button>
            <button data-nav="/docs" class="btn btn-ghost">${icon('BookOpen', 'h-4 w-4')} Lihat dokumentasi API</button>
          </div>
        </div>
        <div id="sn-stats" class="seq grid grid-cols-3 gap-2.5 sm:gap-4" style="--d:.5s">${statsHtml()}</div>
      </div>
    </div>
  </section>

  <section id="sn-results" class="mx-auto max-w-7xl scroll-mt-[calc(var(--nav-h)+8px)] px-4 pb-16 sm:px-8 sm:pb-24">
    <div class="mb-5 grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-[1fr_14rem]">
      <div class="relative">${icon('Search', 'pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dim')}<input id="sn-search" type="search" value="${esc(s.q)}" placeholder="Cari script, scraper, bot, atau kata kunci…" aria-label="Cari snippet" autocomplete="off" class="input !rounded-full !pl-11"></div>
      <select id="sn-sort" class="input !rounded-full" aria-label="Urutkan">${Object.entries(SORTS).map(([k, v]) => `<option value="${k}" ${s.sort === k ? 'selected' : ''}>${v[0]}</option>`).join('')}</select>
    </div>
    <div id="sn-cats" class="no-scrollbar -mx-1 mb-3 flex gap-2 overflow-x-auto px-1 pb-2 sm:flex-wrap sm:overflow-visible" role="group" aria-label="Kategori">${ch.cats}</div>
    <div class="mb-6 flex items-center gap-3"><span class="shrink-0 text-[11px] font-extrabold uppercase tracking-wider text-dim">Bahasa</span><div id="sn-langs" class="no-scrollbar -mx-1 flex min-w-0 gap-2 overflow-x-auto px-1 pb-2 sm:flex-wrap sm:overflow-visible" role="group" aria-label="Bahasa">${ch.langs}</div></div>
    <div id="sn-meta" class="mb-4 text-xs font-bold text-muted" aria-live="polite">${metaHtml()}</div>
    <div id="sn-grid" aria-live="polite">${resultHtml()}</div>
  </section>
</main>`;
}

async function loadList(force = false) {
  if (store.loading) return;
  if (store.list && !force) return;
  store.loading = true;
  store.error = '';
  try { store.list = (await api('/api/snippet/list')).map(norm); } catch (e) { store.error = e.message; store.list = null; }
  store.loading = false;
}

export function bindSnippetList() {
  const $ = (id) => document.getElementById(id);
  const s = S();

  const paint = ({ chips = true } = {}) => {
    if (!$('sn-grid')) return;
    if (chips) { const ch = chipsHtml(); $('sn-cats').innerHTML = ch.cats; $('sn-langs').innerHTML = ch.langs; }
    $('sn-stats').innerHTML = statsHtml();
    $('sn-meta').innerHTML = metaHtml();
    $('sn-grid').innerHTML = resultHtml();
    refreshIcons();
    observeReveals();
    // jika sudah di-reveal sebelumnya, pastikan kartu baru tidak tertahan transparan
    document.querySelectorAll('#sn-grid .reveal:not(.in)').forEach((el) => requestAnimationFrame(() => el.classList.add('in')));
  };

  const start = async (force = false) => {
    if (store.list && !force) { paint(); return; }
    paint();
    await loadList(force);
    paint();
  };

  $('sn-search')?.addEventListener('input', (e) => { s.q = e.target.value.trim(); paint(); });
  $('sn-sort')?.addEventListener('change', (e) => { s.sort = e.target.value; paint({ chips: false }); });

  $('sn-results')?.addEventListener('click', async (e) => {
    const cat = e.target.closest('[data-sn-cat]');
    if (cat) { s.cat = cat.dataset.snCat; paint(); return; }
    const lang = e.target.closest('[data-sn-lang]');
    if (lang) { s.lang = lang.dataset.snLang; paint(); return; }
    if (e.target.closest('[data-sn-reset]')) { s.q = ''; s.cat = ''; s.lang = ''; const i = $('sn-search'); if (i) i.value = ''; paint(); return; }
    if (e.target.closest('[data-sn-retry]')) { start(true); return; }

    const cp = e.target.closest('[data-sn-copy]');
    if (cp) {
      const id = cp.dataset.snCopy;
      try {
        const c = await fetchItem(id);
        await copyText(c.code);
        track(id, 'copy');
        const row = (store.list || []).find((x) => keyOf(x) === id);
        if (row) row.copies += 1;
        flash(cp, icon('Check', 'h-4 w-4 text-ok'));
      } catch { flash(cp, icon('X', 'h-4 w-4 text-red')); }
    }
  });

  start();
}

/* =========================================================
   DETAIL /snippet/<slug>
   ========================================================= */

export function renderSnippetView(path) {
  const id = decodeURIComponent(path.split('/')[2] || '');
  return `<main class="mx-auto max-w-5xl px-4 pb-20 pt-[calc(var(--nav-h)+28px)] sm:px-8 sm:pt-[calc(var(--nav-h)+48px)]">
    <button data-nav="/snippet" class="btn btn-ghost btn-sm mb-6">${icon('ArrowLeft', 'h-4 w-4')} Semua snippet</button>
    <div id="sn-detail" data-id="${esc(id)}">${detailSkeleton()}</div>
  </main>`;
}

const detailSkeleton = () => `<div class="card p-6 sm:p-8"><div class="skeleton !bg-fg/10 mb-4 h-5 w-40"></div><div class="skeleton !bg-fg/10 mb-3 h-9 w-2/3"></div><div class="skeleton !bg-fg/10 mb-8 h-4 w-1/2"></div><div class="skeleton !bg-fg/10 h-64 w-full"></div></div>`;

const cmdRow = (text, label) => `<div class="code-url flex items-center gap-2 py-2.5 pl-3.5 pr-2.5">
  <span class="shrink-0 font-bold text-[#ffc83d]">$</span><code class="min-w-0 flex-1 overflow-x-auto whitespace-nowrap">${esc(text)}</code>
  <button data-copy="${esc(text)}" class="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[#a79fcb] transition-colors hover:bg-white/10 hover:text-white" aria-label="${esc(label)}">${icon('Copy', 'h-4 w-4')}</button></div>`;

function detailHtml(c, rel) {
  const lines = c.code.split('\n');
  const numbered = lines.length <= 3000;
  const stat = (ic, v, l) => `<span class="inline-flex items-center gap-1.5">${icon(ic, 'h-4 w-4 text-gold')}<b class="text-fg" ${l === 'dilihat' ? 'id="sn-v"' : l === 'disalin' ? 'id="sn-c"' : ''}>${v}</b> ${l}</span>`;
  const relHtml = rel.length ? `<section class="mt-14"><h2 class="mb-4 text-2xl">Snippet lain di ${esc(c.category)}</h2><div class="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2 lg:grid-cols-3">${rel.map((r) => `<button data-nav="/snippet/${encodeURIComponent(keyOf(r))}" class="card flex h-full w-full flex-col gap-2 p-4 text-left"><span class="flex flex-wrap gap-1.5">${badge(r.language)}</span><span class="text-sm font-extrabold">${esc(r.title)}</span><span class="line-clamp-2 text-xs leading-5 text-muted">${esc(r.description)}</span></button>`).join('')}</div></section>` : '';

  return `<div class="page-enter">
    <div class="mb-6">
      <div class="mb-4 flex flex-wrap items-center gap-2">${badge(c.category)}${badge(c.language)}</div>
      <h1 class="text-balance text-[clamp(1.9rem,6vw,3.25rem)] leading-[1.05]">${esc(c.title)}</h1>
      ${c.description ? `<p class="mt-4 max-w-2xl text-[15px] leading-7 text-muted">${esc(c.description)}</p>` : ''}
      <div class="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold text-muted">${stat('Eye', fmtNum(c.views), 'dilihat')}${stat('Copy', fmtNum(c.copies), 'disalin')}<span>${lines.length} baris</span>${c.updatedAt ? `<span>Diperbarui ${fmtDate(c.updatedAt)}</span>` : ''}</div>
    </div>

    <div class="mb-6 grid gap-2.5">${cmdRow(curlCmd(c), 'Salin perintah curl')}${c.install ? cmdRow(c.install, 'Salin perintah install') : ''}</div>

    <div class="code">
      <div class="code-head flex-wrap gap-2">
        <span class="font-mono text-[11px] font-bold text-[#a79fcb]">${esc(c.language)}</span>
        <div class="flex flex-wrap items-center gap-2">
          <a href="/raw/${encodeURIComponent(keyOf(c))}" target="_blank" rel="noopener" class="sn-act">${icon('ExternalLink', 'h-3.5 w-3.5')}Raw</a>
          <button id="sn-dl" class="sn-act">${icon('Download', 'h-3.5 w-3.5')}Unduh</button>
          <button id="sn-cp" class="sn-act sn-act-pri">${icon('Copy', 'h-3.5 w-3.5')}Salin kode</button>
        </div>
      </div>
      <pre class="snip-code max-h-[70vh] p-4 text-[12px] leading-6 sm:p-5 sm:text-[13px]"><code>${numbered ? lines.map((l) => `<span class="l">${esc(l) || ' '}</span>`).join('') : esc(c.code)}</code></pre>
    </div>
    ${relHtml}
  </div>`;
}

export async function bindSnippetView() {
  const box = document.getElementById('sn-detail');
  if (!box) return;
  const id = box.dataset.id;
  if (!id) { box.innerHTML = notFound('Link snippet tidak lengkap.'); refreshIcons(); return; }
  try {
    const [c] = await Promise.all([fetchItem(id), store.list ? null : loadList()]);
    if (document.getElementById('sn-detail')?.dataset.id !== id) return; // pengguna sudah pindah halaman
    const rel = (store.list || []).filter((x) => x.id !== c.id && x.category === c.category).slice(0, 3);
    document.title = `${c.title} — Snippet SamApi`;
    box.innerHTML = detailHtml(c, rel);
    refreshIcons();

    const seen = `sn_seen_${c.id}`;
    try {
      if (!sessionStorage.getItem(seen)) {
        sessionStorage.setItem(seen, '1');
        track(id, 'view');
        c.views += 1;
        const v = document.getElementById('sn-v'); if (v) v.textContent = fmtNum(c.views);
      }
    } catch { /* sessionStorage diblokir: lewati */ }

    document.getElementById('sn-cp')?.addEventListener('click', async (e) => {
      const btn = e.currentTarget;
      try { await copyText(c.code); } catch { flash(btn, `${icon('X', 'h-3.5 w-3.5')}Gagal`); return; }
      track(id, 'copy');
      c.copies += 1;
      const el = document.getElementById('sn-c'); if (el) el.textContent = fmtNum(c.copies);
      flash(btn, `${icon('Check', 'h-3.5 w-3.5')}Tersalin`);
    });
    document.getElementById('sn-dl')?.addEventListener('click', () => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([c.code], { type: 'text/plain;charset=utf-8' }));
      a.download = `${c.title.replace(/[^a-z0-9-_]+/gi, '_').slice(0, 60) || 'snippet'}.${EXT[c.language] || 'txt'}`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    });
  } catch (e) {
    box.innerHTML = notFound(e.message);
    refreshIcons();
  }
}

const notFound = (msg) => `<div class="rounded-3xl border-2 border-dashed border-ink px-4 py-16 text-center">${icon('FileX', 'mx-auto h-9 w-9 text-dim')}<p class="mt-4 text-sm font-extrabold">Snippet tidak bisa dibuka</p><p class="mx-auto mt-1 max-w-sm text-xs leading-5 text-muted">${esc(msg)}</p><button data-nav="/snippet" class="btn btn-gold btn-sm mt-6">Kembali ke daftar</button></div>`;

/** Dipanggil admin setelah menambah/mengubah/menghapus agar daftar publik memuat ulang. */
export function resetSnippetCache() { store.list = null; store.items.clear(); store.error = ''; }
