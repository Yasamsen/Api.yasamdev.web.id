import { apiDefinitions, getApiBySlug, getCategories } from './apis/registry.js';
import { renderCreatorSection } from './creator.js';
import { esc, icon, refreshIcons, copyText } from './utils.js';
import { renderApiCard } from './components.js';
import { observeReveals } from './motion.js';
import { uiState, ALL, categoryById, catTile, matchApi, adultNotice } from './categories.js';
import { extractMedia, mediaFromBlob, renderResponse } from './response-view.js';

/* =========================================================
   HELPERS
   ========================================================= */

function getCurrentApiUrl(endpoint) {
  if (!endpoint) return '';
  try {
    const url = new URL(endpoint);
    return `${window.location.origin}${url.pathname}${url.search}${url.hash}`;
  } catch {
    return endpoint;
  }
}

const methodBadge = (m) => `<span class="badge ${m === 'GET' ? 'badge-get' : 'badge-post'}">${esc(m)}</span>`;

/** Typewriter span: width animates in `ch` steps, so it must be monospace. */
const typed = (text, delay, dur, cls = '') =>
  `<span class="tw ${cls}" style="--n:${text.length};--d:${delay}s;--dur:${dur}s">${esc(text)}</span>`;

const reveal = (html, d = 0, tag = 'div', cls = '') => `<${tag} class="reveal ${cls}" style="--d:${d}ms">${html}</${tag}>`;

/* =========================================================
   HOME — EXPLORER KATEGORI
   ========================================================= */

const homeList = () => {
  const { q, cat } = uiState.home;
  return apiDefinitions.filter((a) => (!cat || a.categoryId === cat) && matchApi(a, q));
};
const homeCount = (id) => apiDefinitions.filter((a) => (!id || a.categoryId === id) && matchApi(a, uiState.home.q)).length;

function catCardHtml(c, active, count) {
  return `<button type="button" data-cat-card="${esc(c.id)}" aria-pressed="${active}" class="catcard ${active ? 'is-active' : ''}" ${count === 0 ? 'data-empty' : ''}>
    ${catTile(c, 'h-11 w-11', 'h-5 w-5')}
    <span class="catbody min-w-0 flex-1">
      <span class="block text-[13px] font-extrabold leading-[1.15rem] sm:truncate sm:text-sm sm:leading-5">${esc(c.label)}</span>
      <span class="mt-0.5 line-clamp-2 text-[11px] leading-4 text-muted max-sm:hidden">${esc(c.short)}</span>
    </span>
    <span data-cat-count class="catcount">${count}</span>
  </button>`;
}

function bannerHtml() {
  const c = uiState.home.cat ? categoryById(uiState.home.cat) : null;
  if (!c) {
    return `<div class="catbanner flex items-start gap-3 !shadow-none">${icon('Lightbulb', 'mt-0.5 h-5 w-5 shrink-0 text-gold')}<p class="text-sm leading-6 text-muted"><b class="text-fg">Bingung mulai dari mana?</b> Pilih kategori sesuai kebutuhanmu di atas, atau ketik kata kunci seperti <button data-suggest="download" class="font-bold text-gold underline decoration-2 underline-offset-2">download</button>, <button data-suggest="background" class="font-bold text-gold underline decoration-2 underline-offset-2">background</button> atau <button data-suggest="cuaca" class="font-bold text-gold underline decoration-2 underline-offset-2">cuaca</button> di kolom pencarian.</p></div>`;
  }
  return `<div class="catbanner flex flex-col gap-4 sm:flex-row sm:items-center">
    <div class="flex min-w-0 flex-1 items-start gap-4">${catTile(c, 'h-12 w-12', 'h-5 w-5')}<div class="min-w-0">
      <h3 class="text-lg font-extrabold leading-tight">${esc(c.label)}</h3>
      <p class="mt-1 text-sm leading-6 text-muted">${esc(c.desc)}</p>
      ${c.hint ? `<p class="mt-1.5 text-xs font-bold text-gold">Cocok kalau ${esc(c.hint)}.</p>` : ''}
    </div></div>
    <div class="flex shrink-0 gap-2"><button data-scroll="cats" class="btn btn-ghost btn-sm">Ganti kategori</button><button data-cat-card="" class="btn btn-gold btn-sm">Lihat semua</button></div>
  </div>${c.adult ? `<div class="mt-4">${adultNotice}</div>` : ''}`;
}

function metaHtml(list) {
  const q = uiState.home.q.trim();
  return `<span>Menampilkan <b class="text-fg">${list.length}</b> dari ${apiDefinitions.length} API${q ? ` untuk “${esc(q)}”` : ''}</span>${q ? `<button data-clear-q class="inline-flex items-center gap-1 text-gold hover:underline">${icon('X', 'h-3.5 w-3.5')} Hapus pencarian</button>` : ''}`;
}

function emptyHtml() {
  const { q, cat } = uiState.home;
  const where = cat ? ` di kategori <b>${esc(categoryById(cat)?.label || '')}</b>` : '';
  const others = getCategories()
    .filter((c) => c.id !== cat)
    .map((c) => [c, c.apis.filter((a) => matchApi(a, q)).length])
    .filter(([, n]) => n > 0);
  return `${icon('SearchX', 'mx-auto h-9 w-9 text-dim')}
    <p class="mt-4 text-sm font-extrabold">Belum ada API yang cocok${q ? ` dengan “${esc(q.trim())}”` : ''}${where}</p>
    ${others.length ? `<p class="mt-3 text-xs text-muted">Tapi ada hasil di kategori lain:</p><div class="mt-3 flex flex-wrap justify-center gap-2">${others.map(([c, n]) => `<button data-cat-card="${esc(c.id)}" class="catlink">${catTile(c, 'h-5 w-5 !rounded-md', 'h-3 w-3')}${esc(c.label)} <span class="text-dim">${n}</span></button>`).join('')}</div>` : '<p class="mt-1 text-xs text-dim">Coba kata kunci lain, atau pilih kategori dari daftar di atas.</p>'}
    <button data-reset-filter class="btn btn-ghost btn-sm mt-6">${icon('RotateCcw', 'h-3.5 w-3.5')} Reset filter</button>`;
}

function renderExplorer() {
  const { q, cat } = uiState.home;
  const list = homeList();
  const cards = [ALL, ...getCategories()].map((c) => catCardHtml(c, c.id === cat, homeCount(c.id))).join('');
  return `<section class="mx-auto max-w-7xl scroll-mt-[calc(var(--nav-h)+8px)] px-4 py-16 sm:px-8 sm:py-24" id="apis">
    ${reveal(`<div class="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
      <div>
        <p class="text-sm font-bold text-gold">Mulai dari sini</p>
        <h2 class="text-balance mt-2 max-w-xl text-[2rem] leading-[1.1] sm:text-[2.75rem]">Kamu mau ngapain hari ini?</h2>
        <p class="mt-4 max-w-lg text-sm leading-7 text-muted">Pilih kategori sesuai kebutuhanmu. Setiap kategori berisi API yang sejenis, jadi kamu tidak perlu menebak-nebak.</p>
      </div>
      <div class="relative w-full lg:w-80">${icon('Search', 'pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dim')}<input id="home-search" value="${esc(q)}" placeholder="Cari: download, foto, cuaca…" aria-label="Cari API" autocomplete="off" class="input !rounded-full !pl-11"></div>
    </div>`)}
    ${reveal(`<div id="cats" class="mb-6 grid scroll-mt-[calc(var(--nav-h)+12px)] grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">${cards}</div>`, 60)}
    <div id="cat-banner" class="mb-8">${bannerHtml()}</div>
    <div id="results" class="scroll-mt-[calc(var(--nav-h)+12px)]">
      <div id="result-meta" class="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-muted">${metaHtml(list)}</div>
      <div id="api-grid" class="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">${list.map((a, i) => renderApiCard(a, i)).join('')}</div>
      <div id="no-apis" class="${list.length ? 'hidden' : ''} rounded-3xl border-2 border-dashed border-ink px-4 py-16 text-center">${emptyHtml()}</div>
    </div>
    ${reveal(`<button data-nav="/docs" class="group inline-flex items-center gap-2 text-sm font-bold text-gold">View all documentation ${icon('ArrowRight', 'h-4 w-4 transition-transform duration-500 group-hover:translate-x-1')}</button>`, 0, 'div', 'mt-12 text-center')}
  </section>`;
}

/* =========================================================
   HOME
   ========================================================= */

export function renderHome() {
  const cats = getCategories();
  const demo = getApiBySlug('instagram') || apiDefinitions[0];
  const demoPath = `${demo?.endpoint || '/api/instagram'}?url=https://instagram.com/p/Cx1a`;

  const stat = (value, label, attrs = '') => `<div class="stat-box"><div class="font-display text-3xl sm:text-4xl" ${attrs}>${value}</div><div class="mt-1 text-xs font-bold">${label}</div></div>`;
  const dots = '<div class="flex items-center gap-1.5"><span class="h-2 w-2 rounded-full bg-[#f0506e]"></span><span class="h-2 w-2 rounded-full bg-[#ffc83d]"></span><span class="h-2 w-2 rounded-full bg-[#34c78c]"></span></div>';

  return `<main>
  <section class="hero-glow pb-16 pt-[calc(var(--nav-h)+56px)] sm:pb-24 sm:pt-[calc(var(--nav-h)+96px)]">
    <div class="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] items-center gap-14 px-4 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
      <div>
        <p class="seq sticker mb-6 text-sm" style="--d:.1s"><i class="live-dot"></i>${apiDefinitions.length} endpoints live &amp; documented</p>
        <h1 class="text-balance text-[clamp(2.4rem,8.6vw,5rem)] leading-[1.02]">
          <span class="hl"><span style="--d:.2s">Powerful APIs.</span></span>
          <span class="hl"><span class="text-gold" style="--d:.34s">Simple to use.</span></span>
        </h1>
        <p class="seq mt-7 max-w-md text-base leading-8 text-muted" style="--d:.6s">Fast, reliable APIs for modern developers. Download media, generate content, and ship faster.</p>
        <div class="seq mt-9 flex flex-col gap-3 sm:flex-row" style="--d:.75s">
          <button data-scroll="cats" class="btn btn-gold">Explore the APIs ${icon('ArrowRight', 'arr h-4 w-4')}</button>
          <button data-nav="/docs" class="btn btn-ghost">Read documentation</button>
        </div>
      </div>

      <div class="seq flex flex-col gap-4" style="--d:.5s">
        <div class="hero-card">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-[13px] font-bold">Total endpoints</p>
              <div class="font-display mt-1 text-[clamp(2.5rem,9vw,3.5rem)] leading-none" data-count="${apiDefinitions.length}" data-suffix="">0</div>
            </div>
            <span class="ring" aria-hidden="true">${icon('Zap', 'h-5 w-5 fill-current')}</span>
          </div>
          <div class="mt-5 flex flex-wrap gap-2"><span class="pill">${icon('TrendingUp', 'h-3.5 w-3.5')} 99.9% uptime</span><span class="pill"><i class="live-dot"></i> online 24/7</span></div>
          <div class="mt-5 flex items-center gap-3"><div class="bar flex-1"><i style="--p:92%"></i></div><span class="text-xs font-extrabold">&lt;120ms</span></div>
        </div>
        <div class="grid grid-cols-4 gap-2.5 sm:gap-3">
          ${[['BookOpen', 'Docs', '/docs', 'rgb(var(--gold2))', ''], ['Play', 'Try it', '/docs/instagram?try=true', 'rgb(var(--green))', '20 16 43'], ['Flame', 'Popular', '/docs/tiktok', 'rgb(var(--yellow))', '20 16 43'], ['Search', 'Browse', '#cats', 'rgb(var(--red))', '']].map(([ic, l, to, c, fg], i) => `<button ${to.startsWith('#') ? `data-scroll="${to.slice(1)}"` : `data-nav="${to}"`} class="qtile"><span class="qico bob" style="--tile:${c};${fg ? `--tile-fg:rgb(${fg});` : ''}--d:${i * 0.35}s">${icon(ic, 'h-5 w-5')}</span><span class="text-xs font-extrabold">${l}</span></button>`).join('')}
        </div>
        <div class="code">
          <div class="code-head">
            ${dots}
            <span class="font-mono text-[10px] text-[#a79fcb]">live request</span>
            <span class="ln flex items-center gap-1.5 font-mono text-[10px] text-emerald-400" style="--d:3.6s"><span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>200 · 118ms</span>
          </div>
          <pre class="p-5 text-[12px] leading-[1.9] sm:p-6 sm:text-[13px]"><code><span class="tk-k">GET</span> <span class="caret">${typed(demoPath, 1.2, 2.2, 'tk-s')}</span>
<span class="ln tk-c" style="--d:3.5s">// response</span>
<span class="ln" style="--d:3.65s">{</span>
<span class="ln" style="--d:3.8s">  <span class="tk-p">"success"</span>: <span class="tk-k">true</span>,</span>
<span class="ln" style="--d:3.95s">  <span class="tk-p">"data"</span>: {</span>
<span class="ln" style="--d:4.1s">    <span class="tk-p">"media"</span>: [{ <span class="tk-p">"url"</span>: <span class="tk-s">"https://…/video.mp4"</span> }]</span>
<span class="ln" style="--d:4.25s">  }</span>
<span class="ln" style="--d:4.4s">}</span></code></pre>
        </div>
      </div>
    </div>

    <div class="mx-auto mt-16 max-w-4xl px-4 sm:mt-24 sm:px-8">
      <div class="seq grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4" style="--d:.9s">
        ${stat('0', 'Available APIs', `data-count="${apiDefinitions.length}" data-suffix="+"`)}
        ${stat('0', 'API uptime', 'data-count="100" data-suffix="%"')}
        ${stat('0', 'Avg. response', 'data-count="120" data-prefix="<" data-suffix="ms"')}
        ${stat('0', 'Reliability', 'data-count="99.9" data-dec="1" data-suffix="%"')}
      </div>
    </div>
  </section>

  ${renderExplorer()}

  <section class="band">
    <div class="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-14 px-4 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:items-center lg:gap-20">
      ${reveal(`<h2 class="text-balance max-w-lg text-[2rem] leading-[1.1] sm:text-[2.75rem]">The fastest way from idea to API.</h2>
      <p class="mt-5 max-w-md text-sm leading-7 text-muted">Built with developers in mind. Every endpoint is designed to be intuitive, documented, and ready to ship.</p>
      <div class="mt-10 grid grid-cols-[minmax(0,1fr)] gap-7 sm:grid-cols-2">
        ${[['Gauge', 'Blazing fast', 'Low latency, every request.'], ['ShieldCheck', 'Reliable by default', '99.9% uptime SLA.'], ['Database', 'Simple responses', 'Predictable JSON outputs.'], ['BookOpen', 'Clear docs', 'Start building in minutes.']].map(([ic, t, d]) => `<div class="flex gap-4"><span class="iconbox h-10 w-10 shrink-0">${icon(ic, 'h-[18px] w-[18px]')}</span><div><div class="text-sm font-bold">${t}</div><div class="mt-1 text-xs leading-5 text-muted">${d}</div></div></div>`).join('')}
      </div>`)}
      ${reveal(`<div class="code">
        <div class="code-head">${dots}<span class="font-mono text-[10px] text-[#a79fcb]">request.js</span></div>
        <pre class="p-6 text-[12px] leading-[1.9]"><code><span class="tk-k">const</span> response = <span class="tk-k">await</span> fetch(<span class="tk-s">"https://samapi.com/api/instagram?url="</span> +
  postUrl);

<span class="tk-k">const</span> { data } = <span class="tk-k">await</span> response.json();

<span class="tk-c">// Ready to use.</span>
console.log(data.media[<span class="tk-n">0</span>].url);</code></pre>
        <div class="p-4 pt-0"><button id="copy-base-url" class="flex w-full items-center justify-center gap-2 rounded-full border border-white/10 py-3 text-xs font-bold text-[#d5d9e2] transition-colors duration-300 hover:border-[#a5b4fc]/60 hover:text-[#a5b4fc]">${icon('Copy', 'h-3.5 w-3.5')} Copy base URL</button></div>
      </div>`, 100)}
    </div>
  </section>

  ${renderCreatorSection()}

  <section>
    <div class="mx-auto max-w-3xl px-4 py-24 text-center sm:px-8 sm:py-32">
      ${reveal(`<h2 class="text-balance text-[2.3rem] leading-[1.05] sm:text-5xl">Your next project starts here.</h2>
      <p class="mx-auto mt-6 max-w-md text-sm leading-7 text-muted">Explore our APIs and bring your ideas to life with just a few lines of code.</p>
      <button data-nav="/docs" class="btn btn-gold mt-9">Start building ${icon('ArrowRight', 'arr h-4 w-4')}</button>`)}
    </div>
  </section>
</main>`;
}

export function bindHome() {
  const hs = uiState.home;
  const $ = (id) => document.getElementById(id);
  const input = $('home-search');

  const paint = ({ scroll = false } = {}) => {
    const list = homeList();
    $('api-grid').innerHTML = list.map((a, i) => renderApiCard(a, i)).join('');
    $('no-apis').innerHTML = emptyHtml();
    $('no-apis').classList.toggle('hidden', list.length !== 0);
    $('result-meta').innerHTML = metaHtml(list);
    $('cat-banner').innerHTML = bannerHtml();
    document.querySelectorAll('#cats [data-cat-card]').forEach((el) => {
      const id = el.dataset.catCard;
      const n = homeCount(id);
      const on = id === hs.cat;
      el.querySelector('[data-cat-count]').textContent = n;
      el.toggleAttribute('data-empty', n === 0);
      el.classList.toggle('is-active', on);
      el.setAttribute('aria-pressed', String(on));
    });
    refreshIcons();
    observeReveals();
    if (scroll) $('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  input?.addEventListener('input', (e) => { hs.q = e.target.value; paint(); });

  $('apis')?.addEventListener('click', (e) => {
    const card = e.target.closest('[data-cat-card]');
    if (card) {
      const id = card.dataset.catCard;
      hs.cat = id && id === hs.cat ? '' : id;   // klik kategori yang sama lagi = kembali ke semua
      paint({ scroll: !!card.closest('#cats') });
      return;
    }
    const suggest = e.target.closest('[data-suggest]');
    if (suggest) { hs.q = suggest.dataset.suggest; if (input) input.value = hs.q; paint({ scroll: true }); return; }
    if (e.target.closest('[data-clear-q]')) { hs.q = ''; if (input) input.value = ''; paint(); return; }
    if (e.target.closest('[data-reset-filter]')) { hs.q = ''; hs.cat = ''; if (input) input.value = ''; paint(); }
  });

  $('copy-base-url')?.addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    try { await copyText(window.location.origin); } catch { return; }
    btn.innerHTML = `${icon('Check', 'h-3.5 w-3.5 text-emerald-400')} Base URL copied`;
    refreshIcons();
    setTimeout(() => { btn.innerHTML = `${icon('Copy', 'h-3.5 w-3.5')} Copy base URL`; refreshIcons(); }, 1600);
  });
}

/* =========================================================
   CODE BLOCK
   ========================================================= */

function codeBlock(code, language = 'json') {
  return `<div class="code"><div class="code-head"><span class="font-mono text-[10px] text-[#a79fcb]">${esc(language)}</span><button data-code-copy="${encodeURIComponent(code)}" class="flex items-center gap-1.5 text-[10px] font-bold text-[#a79fcb] transition-colors hover:text-white">${icon('Copy', 'h-3 w-3')} Copy</button></div><pre class="max-h-96 p-5 text-[11.5px] leading-6"><code>${esc(code)}</code></pre></div>`;
}

/* =========================================================
   TRY PANEL
   ========================================================= */

function tryPanel(api) {
  const inputs = api.parameters.map((p) => {
    const label = `${esc(p.name)} ${p.required ? '<span class="text-red-400">*</span>' : ''}`;
    if (p.type === 'select' && Array.isArray(p.options)) {
      const options = p.options.map((option) => {
        const value = typeof option === 'string' ? option : option.value;
        const text = typeof option === 'string' ? option : (option.label || option.value);
        return `<option value="${esc(value)}" ${String(value) === String(p.example || '') ? 'selected' : ''}>${esc(text)}</option>`;
      }).join('');
      return `<label class="block"><span class="mb-2 block text-xs font-bold">${label}</span><select data-param="${esc(p.name)}" class="input font-mono !text-xs">${options}</select></label>`;
    }
    if (p.type === 'file') {
      const uploadLabel = api.slug === 'tourl' || api.slug === 'freeconvert-video-to-mp3' || api.slug === 'bgremover' || api.slug === 'ocr' || api.slug === 'imgbb' || api.slug === 'to-anime';
      if (uploadLabel) return `<div class="sm:col-span-2">
        <span class="mb-2 block text-xs font-bold">Pilih file ${p.required ? '<span class="text-red-400">*</span>' : ''}</span>
        <label class="group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-[rgb(var(--gold)/.42)] bg-[rgb(var(--gold)/.04)] px-5 py-8 text-center transition-all hover:border-[rgb(var(--gold)/.8)] hover:bg-[rgb(var(--gold)/.08)] sm:py-10">
          <input data-param="${esc(p.name)}" data-upload-input type="file" class="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0" aria-label="Pilih file untuk diunggah" required="${p.required ? 'required' : ''}">
          <span class="mb-3 grid h-14 w-14 place-items-center rounded-2xl border border-[rgb(var(--gold)/.25)] bg-[rgb(var(--gold)/.10)] text-gold transition-transform group-hover:-translate-y-0.5">${icon('UploadCloud', 'h-7 w-7')}</span>
          <span class="text-sm font-bold text-fg">Klik untuk memilih file</span>
          <span class="mt-1 text-xs text-muted">Pilih file dari perangkat kamu · ${esc(p.maxSizeLabel || 'Maksimal 4 MB')}</span>
          <span data-upload-name class="mt-4 max-w-full truncate rounded-lg bg-fg/[.06] px-3 py-2 text-xs font-semibold text-muted">Belum ada file dipilih</span>
        </label>
        <p class="mt-2 text-[11px] leading-5 text-muted">${esc(p.description || 'File akan diunggah dan menghasilkan URL publik.')}</p>
      </div>`;
      return `<label class="block"><span class="mb-2 block text-xs font-bold">${label}</span><input data-param="${esc(p.name)}" type="file" class="input font-mono !text-xs" aria-label="Upload ${esc(p.name)}"><span class="mt-2 block text-[10px] leading-5 text-muted">${esc(p.description || 'Pilih file dari perangkat kamu.')}</span></label>`;
    }
    return `<label class="block"><span class="mb-2 block text-xs font-bold">${label}</span><input data-param="${esc(p.name)}" type="${p.type === 'number' ? 'number' : 'text'}" placeholder="${esc(p.example || '')}" class="input font-mono !text-xs"></label>`;
  }).join('');
  const initialUrl = `${window.location.origin}${api.endpoint}`;

  return `<section id="try-panel" class="card mt-14 !overflow-visible p-4 sm:p-8">
    <div class="mb-6 flex items-center gap-3"><span class="iconbox h-10 w-10">${icon('Play', 'h-4 w-4')}</span><div><h3 class="text-base font-extrabold">Try this API</h3><p class="text-xs text-muted">Send a real request and inspect the response.</p></div></div>
    <div class="grid grid-cols-[minmax(0,1fr)] gap-4 ${api.parameters.length > 1 ? 'sm:grid-cols-2' : ''}">${inputs || '<p class="text-xs text-muted">This endpoint takes no parameters.</p>'}</div>
    ${api.slug === 'add-subdomain' ? '<label class="mt-4 block"><span class="mb-2 block text-xs font-bold">API key <span class="text-red-400">*</span></span><input data-api-key type="password" autocomplete="off" placeholder="Masukkan ADD_SUBDOMAIN_API_KEY" class="input font-mono !text-xs"></label>' : ''}
    <div class="mt-6 flex flex-col gap-2.5 sm:flex-row">
      <button id="send-request" class="btn btn-gold btn-sm flex-1">${icon('Play', 'h-3.5 w-3.5')}<span>Send request</span></button>
      <button id="copy-url" class="btn btn-ghost btn-sm">${icon('Copy', 'h-3.5 w-3.5')}<span>Copy URL</span></button>
    </div>
    <div id="try-url" class="code-url mt-4 break-all px-4 py-3">${esc(api.method)} ${esc(initialUrl)}</div>
    <div id="try-response" class="mt-4 hidden"></div>
  </section>`;
}

/* =========================================================
   DOCS
   ========================================================= */

export function renderDocs(path) {
  const selectedSlug = path.startsWith('/docs/') ? path.split('/')[2]?.split('?')[0] : undefined;
  const selected = selectedSlug ? getApiBySlug(selectedSlug) : undefined;
  const categories = getCategories();

  return `<div class="mx-auto flex max-w-[90rem] gap-8 px-3 pt-[calc(var(--nav-h)+16px)] sm:px-6 lg:px-8">
    <div id="scrim" class="scrim"></div>
    <aside id="docs-sidebar" class="sidebar" aria-label="API reference">
      <div class="flex h-full flex-col">
        <div class="px-5 pb-4 pt-5">
          <div class="mb-4 flex items-center justify-between"><div class="flex items-center gap-2 text-sm font-extrabold">${icon('BookOpen', 'h-4 w-4 text-gold')} API Reference</div><button id="close-sidebar" class="iconbtn !h-8 !w-8 lg:hidden" aria-label="Close menu">${icon('X', 'h-4 w-4')}</button></div>
          <div class="relative">${icon('Search', 'pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-dim')}<input id="docs-search" placeholder="Cari endpoint…" aria-label="Search endpoints" class="input !h-10 !rounded-full !pl-10 !text-xs"></div>
          <div class="mt-3 flex items-center justify-between px-1 text-[11px] font-bold text-dim"><span>${categories.length} kategori · ${apiDefinitions.length} API</span><button id="toggle-all" class="text-gold hover:underline">${selected || uiState.docs.cat ? 'Tutup semua' : 'Buka semua'}</button></div>
        </div>
        <nav id="docs-nav" class="flex-1 overflow-auto px-3 pb-4">${categories.map((c) => {
          const open = selected ? c.id === selected.categoryId : c.id === uiState.docs.cat;
          return `<div class="mb-1.5" data-category="${esc(c.id)}" data-init-collapsed="${open ? '0' : '1'}" ${open ? '' : 'data-collapsed'}><button data-category-toggle class="catrow" aria-label="Buka atau tutup ${esc(c.label)}">${catTile(c, 'h-7 w-7 !rounded-lg', 'h-3.5 w-3.5')}<span class="flex-1 truncate text-left text-[13px] font-extrabold">${esc(c.label)}</span><span class="text-[11px] font-bold text-dim">${c.count}</span>${icon('ChevronDown', 'chev h-3.5 w-3.5 text-dim')}</button><div class="fold"><div data-category-items class="pb-1 pl-2">${c.apis.map((api) => docNavItem(api, selected)).join('')}</div></div></div>`;
        }).join('')}<p id="docs-nav-empty" class="hidden px-3 py-6 text-center text-xs text-dim">Tidak ada endpoint yang cocok.</p></nav>
        <div class="border-t hair p-4"><div class="flex items-center gap-2.5 px-1 py-1"><span class="h-1.5 w-1.5 rounded-full bg-ok"></span><div><div class="text-xs font-bold">All systems operational</div><div class="text-[10px] text-dim">Last checked just now</div></div></div></div>
      </div>
    </aside>
    <div id="fab" class="fab pointer-events-none fixed inset-x-0 bottom-5 z-30 flex justify-center lg:hidden" style="padding-bottom:env(safe-area-inset-bottom,0px)"><button id="open-sidebar" class="btn btn-gold btn-sm pointer-events-auto shadow-2xl">${icon('Menu', 'h-4 w-4')} API menu</button></div>
    <main class="min-w-0 flex-1 px-2 pb-24 pt-6 sm:px-4 lg:px-8 lg:pt-10">${selected ? renderApiDetail(selected) : renderDocsIndex()}</main>
  </div>`;
}

function docNavItem(api, selected) {
  const active = selected?.slug === api.slug;
  return `<button data-nav="/docs/${encodeURIComponent(api.slug)}" data-doc-api="${esc(api.slug)}" class="navitem ${active ? 'is-active' : ''}">${icon(api.icon, 'h-4 w-4')}<span class="flex-1 truncate">${esc(api.name)}</span><span class="text-[9px] font-extrabold ${api.method === 'GET' ? 'text-ok' : 'text-warn'}">${esc(api.method)}</span></button>`;
}

const docsMatches = (c) => c.apis.filter((a) => matchApi(a, uiState.docs.q));

function docCard(api, i = 0) {
  const c = categoryById(api.categoryId);
  return reveal(`<button data-nav="/docs/${encodeURIComponent(api.slug)}" class="card group flex h-full w-full items-start gap-4 p-4 text-left"><span class="iconbox h-10 w-10 shrink-0" style="--tile:${c.tile};--tile-fg:${c.fg}">${icon(api.icon, 'h-4 w-4')}</span><span class="min-w-0 flex-1"><span class="flex items-center gap-2"><span class="truncate text-sm font-extrabold">${esc(api.name)}</span>${c.adult ? '<span class="badge !bg-red !py-0 !text-[9px] !text-white">18+</span>' : ''}</span><span class="mt-1 line-clamp-2 block text-[11.5px] leading-[1.15rem] text-muted">${esc(api.description)}</span><span class="mt-2 flex items-center gap-1.5"><span class="badge ${api.method === 'GET' ? 'badge-get' : 'badge-post'} !py-0 !text-[9px]">${esc(api.method)}</span><span class="truncate font-mono text-[10px] text-dim">${esc(api.endpoint)}</span></span></span>${icon('ChevronRight', 'mt-1 h-4 w-4 shrink-0 text-dim transition-all duration-300 group-hover:translate-x-1 group-hover:text-gold')}</button>`, (i % 2) * 90, 'div', 'h-full');
}

function docsChipsHtml() {
  const cats = getCategories();
  const chip = (id, label, n) => `<button data-docs-cat="${esc(id)}" class="chip ${uiState.docs.cat === id ? 'is-active' : ''}" ${n === 0 ? 'data-empty' : ''}>${esc(label)}<span class="chipn">${n}</span></button>`;
  return chip('', 'Semua', cats.reduce((n, c) => n + docsMatches(c).length, 0)) + cats.map((c) => chip(c.id, c.label, docsMatches(c).length)).join('');
}

function docsSectionsHtml() {
  const { cat, q } = uiState.docs;
  const groups = getCategories().filter((c) => !cat || c.id === cat).map((c) => [c, docsMatches(c)]).filter(([, list]) => list.length);
  if (!groups.length) {
    return `<div class="rounded-3xl border-2 border-dashed border-ink px-4 py-16 text-center">${icon('SearchX', 'mx-auto h-9 w-9 text-dim')}<p class="mt-4 text-sm font-extrabold">Tidak ada endpoint yang cocok${q.trim() ? ` dengan “${esc(q.trim())}”` : ''}</p><p class="mt-1 text-xs text-dim">Coba kata kunci lain atau pilih kategori yang berbeda.</p><button data-docs-reset class="btn btn-ghost btn-sm mt-6">${icon('RotateCcw', 'h-3.5 w-3.5')} Reset filter</button></div>`;
  }
  return groups.map(([c, list]) => `<section class="mb-12">
    <div class="mb-4 flex items-center gap-3">${catTile(c, 'h-11 w-11', 'h-5 w-5')}<div class="min-w-0 flex-1"><h2 class="text-xl leading-tight sm:text-2xl">${esc(c.label)} <span class="ml-1 text-sm font-bold text-dim">${list.length}</span></h2><p class="text-xs text-muted">${esc(c.short)}</p></div></div>
    ${c.adult ? adultNotice : ''}
    <div class="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2">${list.map((api, i) => docCard(api, i)).join('')}</div>
  </section>`).join('');
}

function renderDocsIndex() {
  return `<div class="max-w-4xl">
    <div class="mb-10">
      <p class="seq text-sm font-semibold text-gold" style="--d:.05s">Documentation</p>
      <h1 class="mt-3 text-[clamp(2.2rem,7vw,3.75rem)] leading-[1.05]"><span class="hl"><span style="--d:.12s">API Reference</span></span></h1>
      <p class="seq mt-6 max-w-xl text-[15px] leading-8 text-muted" style="--d:.35s">Semua endpoint dikelompokkan per kategori. Pilih kategori di bawah, atau cari langsung dengan kata kunci.</p>
    </div>
    <div class="mb-8">
      <div class="relative mb-4">${icon('Search', 'pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dim')}<input id="docs-main-search" value="${esc(uiState.docs.q)}" placeholder="Cari endpoint: instagram, cuaca, hapus background…" aria-label="Cari endpoint" autocomplete="off" class="input !rounded-full !pl-11"></div>
      <div id="docs-chips" class="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-2 sm:flex-wrap sm:overflow-visible">${docsChipsHtml()}</div>
    </div>
    <div id="docs-sections" class="scroll-mt-[calc(var(--nav-h)+16px)]">${docsSectionsHtml()}</div>
  </div>`;
}

/* =========================================================
   API DETAIL
   ========================================================= */

function renderApiDetail(api) {
  const params = api.parameters.map((p) =>
    `<div class="row-hover grid gap-2 border-b hair px-5 py-4 last:border-0 sm:grid-cols-[1fr_100px_2fr] sm:items-center"><div class="flex items-center gap-2"><code class="font-mono text-xs font-bold text-gold">${esc(p.name)}</code>${p.required ? '<span class="text-[10px] font-bold text-red-400">required</span>' : ''}</div><code class="font-mono text-[11px] text-dim">${esc(p.type)}</code><p class="text-xs leading-5 text-muted">${esc(p.description)}</p></div>`
  ).join('') || '<div class="px-5 py-5 text-xs text-muted">No parameters.</div>';

  const fields = api.responseFields.map((f) =>
    `<div class="row-hover flex flex-col gap-1 border-b hair px-5 py-3.5 last:border-0 sm:flex-row sm:items-center"><code class="w-48 shrink-0 font-mono text-xs text-gold">${esc(f.name)}</code><code class="w-20 shrink-0 font-mono text-[11px] text-dim">${esc(f.type)}</code><span class="text-xs text-muted">${esc(f.description)}</span></div>`
  ).join('');

  const currentEndpoint = `${window.location.origin}${api.endpoint}`;
  const cat = categoryById(api.categoryId);
  const related = apiDefinitions.filter((a) => a.categoryId === api.categoryId && a.slug !== api.slug).slice(0, 4);
  const h2 = (t) => `<h2 class="mb-4 text-2xl">${t}</h2>`;

  return `<div class="max-w-3xl">
    <div class="mb-8 flex items-start gap-5">
      <div class="seq iconbox h-14 w-14 shrink-0" style="--d:.05s">${icon(api.icon, 'h-6 w-6')}</div>
      <div class="min-w-0">
        <div class="seq mb-3 flex flex-wrap items-center gap-2.5" style="--d:.1s"><button data-cat-jump="${esc(cat.id)}" class="catlink" title="Lihat semua API di kategori ${esc(cat.label)}"><i class="dot" style="--tile:${cat.tile}"></i>${esc(cat.label)}${icon('ChevronRight', 'h-3 w-3 text-dim')}</button>${cat.adult ? '<span class="badge !bg-red !text-white">18+</span>' : ''}<span class="text-xs text-dim">Updated recently</span></div>
        <h1 class="text-balance text-[clamp(2rem,7vw,3.75rem)] leading-[1]"><span class="hl"><span style="--d:.15s">${esc(api.name)}</span></span></h1>
      </div>
    </div>
    <p class="seq mb-8 text-[15px] leading-8 text-muted" style="--d:.4s">${esc(api.description)}</p>
    <div class="seq glass mb-12 flex items-center gap-3 rounded-xl px-4 py-3" style="--d:.5s">${methodBadge(api.method)}<code class="flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs text-muted">${esc(currentEndpoint)}</code><button data-copy="${esc(currentEndpoint)}" class="iconbtn !h-8 !w-8" aria-label="Copy endpoint">${icon('Copy', 'h-3.5 w-3.5')}</button></div>

    ${reveal(`${h2('Parameters')}<div class="card"><div class="hidden grid-cols-[1fr_100px_2fr] border-b hair px-5 py-3 text-xs font-semibold text-dim sm:grid"><span>Name</span><span>Type</span><span>Description</span></div>${params}</div>`, 0, 'section', 'mb-12')}
    ${reveal(`${h2('Example request')}${codeBlock(getCurrentApiUrl(api.exampleRequest), api.method === 'POST' ? 'http' : 'url')}`, 0, 'section', 'mb-12')}
    ${reveal(`${h2('Example response')}${codeBlock(JSON.stringify(api.responseExample, null, 2))}${fields ? `<div class="card mt-6"><div class="border-b hair px-5 py-3.5 text-xs font-semibold text-dim">Response fields</div>${fields}</div>` : ''}`, 0, 'section')}
    ${reveal(tryPanel(api), 0, 'div')}
    ${related.length ? `<section class="mt-16"><div class="mb-4 flex items-end justify-between gap-3"><h2 class="text-2xl">Lainnya di ${esc(cat.label)}</h2><button data-cat-jump="${esc(cat.id)}" class="shrink-0 text-sm font-bold text-gold hover:underline">Lihat semua ${apiDefinitions.filter((a) => a.categoryId === cat.id).length}</button></div><div class="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2">${related.map((a, i) => docCard(a, i)).join('')}</div></section>` : ''}
  </div>`;
}

/* =========================================================
   BIND DOCS
   ========================================================= */

export function bindDocs(api) {
  const sidebar = document.getElementById('docs-sidebar');
  const scrim = document.getElementById('scrim');
  const setSidebar = (open) => {
    sidebar?.toggleAttribute('data-open', open);
    scrim?.toggleAttribute('data-open', open);
    document.documentElement.classList.toggle('menu-open', open);
  };
  document.getElementById('open-sidebar')?.addEventListener('click', () => setSidebar(true));
  document.getElementById('close-sidebar')?.addEventListener('click', () => setSidebar(false));
  scrim?.addEventListener('click', () => setSidebar(false));

  // sembunyikan tombol "API menu" saat footer terlihat agar tidak menimpa teks footer
  const fab = document.getElementById('fab');
  const footer = document.querySelector('footer');
  if (fab && footer && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => fab.toggleAttribute('data-hide', entry.isIntersecting), { threshold: 0 }).observe(footer);
  }

  // ---- sidebar: buka/tutup kategori, "buka semua", pencarian
  const nav = document.getElementById('docs-nav');
  const catEls = () => [...document.querySelectorAll('#docs-nav [data-category]')];
  const toggleAll = document.getElementById('toggle-all');
  const syncToggleAll = () => { if (toggleAll) toggleAll.textContent = catEls().some((c) => !c.hasAttribute('data-collapsed')) ? 'Tutup semua' : 'Buka semua'; };
  document.querySelectorAll('[data-category-toggle]').forEach((btn) =>
    btn.addEventListener('click', () => { btn.closest('[data-category]').toggleAttribute('data-collapsed'); syncToggleAll(); })
  );
  toggleAll?.addEventListener('click', () => {
    const anyOpen = catEls().some((c) => !c.hasAttribute('data-collapsed'));
    catEls().forEach((c) => c.toggleAttribute('data-collapsed', anyOpen));
    syncToggleAll();
  });

  document.getElementById('docs-search')?.addEventListener('input', (e) => {
    const q = e.target.value.trim();
    document.querySelectorAll('[data-doc-api]').forEach((el) => {
      const item = getApiBySlug(el.dataset.docApi);
      el.classList.toggle('hidden', !!q && !(item && matchApi(item, q)));
    });
    let visible = 0;
    catEls().forEach((cat) => {
      const has = !!cat.querySelector('[data-doc-api]:not(.hidden)');
      if (has) visible += 1;
      cat.classList.toggle('hidden', !has);
      // saat mencari: buka kategori yang ada hasilnya; saat dikosongkan: kembali ke keadaan awal
      cat.toggleAttribute('data-collapsed', q ? !has : cat.dataset.initCollapsed === '1');
    });
    document.getElementById('docs-nav-empty')?.classList.toggle('hidden', visible > 0);
    syncToggleAll();
  });

  // gulirkan sidebar ke endpoint yang sedang dibuka
  const activeItem = nav?.querySelector('.navitem.is-active');
  if (nav && activeItem) nav.scrollTop = Math.max(0, activeItem.getBoundingClientRect().top - nav.getBoundingClientRect().top + nav.scrollTop - nav.clientHeight / 3);

  // ---- indeks dokumentasi: chip kategori + pencarian
  const sections = document.getElementById('docs-sections');
  if (sections) {
    const ds = uiState.docs;
    const chips = document.getElementById('docs-chips');
    const searchBox = document.getElementById('docs-main-search');
    const paintDocs = ({ scroll = false } = {}) => {
      sections.innerHTML = docsSectionsHtml();
      chips.innerHTML = docsChipsHtml();
      refreshIcons();
      observeReveals();
      if (scroll) sections.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    searchBox?.addEventListener('input', (e) => { ds.q = e.target.value; paintDocs(); });
    chips?.addEventListener('click', (e) => {
      const chip = e.target.closest('[data-docs-cat]');
      if (!chip) return;
      const id = chip.dataset.docsCat;
      ds.cat = id && id === ds.cat ? '' : id;
      paintDocs({ scroll: true });
    });
    sections.addEventListener('click', (e) => {
      if (!e.target.closest('[data-docs-reset]')) return;
      ds.q = ''; ds.cat = ''; if (searchBox) searchBox.value = '';
      paintDocs();
    });
  }

  if (!api) return;

  const fieldElement = (name) => document.querySelector(`[data-param="${CSS.escape(name)}"]`);
  const fieldValue = (name) => {
    const el = fieldElement(name);
    return el?.type === 'file' ? el.files?.[0] : el?.value;
  };
  document.querySelectorAll('[data-upload-input]').forEach((input) => {
    input.addEventListener('change', () => {
      const display = input.closest('label')?.querySelector('[data-upload-name]');
      if (!display) return;
      const file = input.files?.[0];
      if (!file) {
        display.textContent = 'Belum ada file dipilih';
        return;
      }
      const size = file.size < 1024 * 1024
        ? `${Math.max(1, Math.round(file.size / 1024))} KB`
        : `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
      display.textContent = `${file.name} · ${size}`;
      display.classList.remove('text-muted');
      display.classList.add('text-gold');
    });
  });
  const buildUrl = () => {
    if (api.method !== 'GET') return `${window.location.origin}${api.endpoint}`;
    const query = api.parameters.filter((p) => fieldValue(p.name)).map((p) => `${p.name}=${encodeURIComponent(fieldValue(p.name))}`).join('&');
    return `${window.location.origin}${api.endpoint}${query ? '?' + query : ''}`;
  };
  const buildBody = () => Object.fromEntries(api.parameters
    .filter((p) => p.type !== 'file' && fieldValue(p.name) !== undefined && fieldValue(p.name) !== '')
    .map((p) => [p.name, p.type === 'number' ? Number(fieldValue(p.name)) : fieldValue(p.name)]));

  document.querySelectorAll('[data-param]').forEach((el) =>
    el.addEventListener('input', () => { document.getElementById('try-url').textContent = `${api.method} ${buildUrl()}`; })
  );
  document.querySelectorAll('[data-param]').forEach((el) =>
    el.addEventListener('change', () => { document.getElementById('try-url').textContent = `${api.method} ${buildUrl()}`; })
  );

  document.getElementById('copy-url')?.addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    try { await copyText(buildUrl()); } catch { return; }
    const old = btn.innerHTML;
    btn.innerHTML = `${icon('Check', 'h-3.5 w-3.5')}<span>Copied</span>`;
    refreshIcons();
    setTimeout(() => { btn.innerHTML = old; refreshIcons(); }, 1600);
  });

  document.getElementById('send-request')?.addEventListener('click', async () => {
    const btn = document.getElementById('send-request');
    const box = document.getElementById('try-response');
    const requestUrl = buildUrl();
    const t0 = performance.now();

    btn.disabled = true;
    btn.innerHTML = `${icon('LoaderCircle', 'h-3.5 w-3.5 animate-spin')}<span>Sending...</span>`;
    refreshIcons();

    box.classList.remove('hidden');
    box.innerHTML = `<div class="code p-5"><div class="skeleton mb-3 h-3 w-2/5"></div><div class="skeleton mb-3 h-3 w-4/5"></div><div class="skeleton h-3 w-3/5"></div></div>`;

    const statusLine = (status) => status ? `<div class="mb-2 flex items-center gap-2 text-[11px] font-bold ${status.ok ? 'text-ok' : 'text-red-400'}"><span class="h-1.5 w-1.5 rounded-full bg-current"></span>${esc(status.label)} · ${Math.round(performance.now() - t0)}ms</div>` : '';
    const showText = (output, status, media = []) => {
      renderResponse(box, { statusHtml: statusLine(status), jsonHtml: codeBlock(output), media });
    };

    try {
      const requestOptions = { method: api.method, headers: { Accept: 'application/json' } };
      const apiKey = document.querySelector('[data-api-key]')?.value;
      if (apiKey) requestOptions.headers['x-api-key'] = apiKey;
      if (api.method !== 'GET') {
        const fileParams = api.parameters.filter((p) => p.type === 'file');
        const selectedFiles = fileParams.map((p) => ({ name: p.name, file: fieldValue(p.name) })).filter((item) => item.file instanceof File);
        if (selectedFiles.length) {
          const form = new FormData();
          for (const item of selectedFiles) form.append(item.name, item.file, item.file.name);
          for (const [name, value] of Object.entries(buildBody())) form.append(name, String(value));
          requestOptions.body = form;
          // Jangan menetapkan Content-Type manual; browser menambahkan boundary multipart.
        } else {
          requestOptions.headers['Content-Type'] = 'application/json';
          requestOptions.body = JSON.stringify(buildBody());
        }
      }
      const response = await fetch(requestUrl, requestOptions);
      const contentType = response.headers.get('content-type') || '';
      const status = { ok: response.ok, label: `${response.status} ${response.statusText || (response.ok ? 'OK' : 'Error')}` };

      const binary = /^(image|video|audio)\//.test(contentType);
      if (binary) {
        const blob = await response.blob();
        const item = mediaFromBlob(URL.createObjectURL(blob), contentType);
        renderResponse(box, { statusHtml: statusLine(status), media: [item], mediaOnly: true });
      } else {
        const result = contentType.includes('application/json') ? await response.json() : await response.text();
        const media = typeof result === 'string' ? [] : extractMedia(result);
        showText(typeof result === 'string' ? result : JSON.stringify(result, null, 2), status, media);
      }

      btn.innerHTML = `${icon(response.ok ? 'Check' : 'AlertCircle', 'h-3.5 w-3.5')}<span>${response.ok ? 'Request sent' : 'Request failed'}</span>`;
    } catch (error) {
      showText(JSON.stringify({ status: false, message: error?.message || 'Request failed' }, null, 2), { ok: false, label: 'Network error' });
      btn.innerHTML = `${icon('AlertCircle', 'h-3.5 w-3.5')}<span>Request failed</span>`;
    } finally {
      refreshIcons();
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = `${icon('Play', 'h-3.5 w-3.5')}<span>Send request</span>`;
        refreshIcons();
      }, 2500);
    }
  });

  // "Try API" shortcut from cards: jump to the panel and focus the first field
  if (/[?&]try=true/.test(window.location.hash)) {
    setTimeout(() => {
      const panel = document.getElementById('try-panel');
      panel?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => panel?.querySelector('[data-param]')?.focus({ preventScroll: true }), 700);
    }, 1200);
  }
}

/* =========================================================
   ERROR
   ========================================================= */

export function renderError(type) {
  const is500 = type === '500';
  const t = is500
    ? { text: 'text-red-400', pulse: 'bg-red-400/15' }
    : { text: 'text-gold', pulse: 'bg-gold/15' };
  return `<main class="flex min-h-screen items-center justify-center px-5 pt-[var(--nav-h)]">
    <div class="relative text-center">
      <div class="seq relative mx-auto mb-8 grid h-20 w-20 place-items-center" style="--d:.05s"><div class="glass relative grid h-20 w-20 place-items-center rounded-full ${t.text}">${icon(is500 ? 'ServerCrash' : 'WifiOff', 'h-8 w-8')}</div></div>
      <p class="seq font-mono text-xs font-bold ${t.text}" style="--d:.15s">Error ${type}</p>
      <h1 class="text-balance mt-4 text-[clamp(2.1rem,7vw,3.75rem)] leading-[1.05]"><span class="hl"><span style="--d:.25s">${is500 ? 'Something went wrong' : 'Endpoint not found'}</span></span></h1>
      <p class="seq mx-auto mt-5 max-w-md text-sm leading-7 text-muted" style="--d:.55s">${is500 ? 'Our servers ran into an unexpected issue. Your request was not completed, but our team has been notified.' : "The endpoint you are looking for doesn't exist or may have been moved. Check the URL and try again."}</p>
      <div class="seq mt-10 flex flex-col justify-center gap-3 sm:flex-row" style="--d:.7s">
        ${is500
          ? `<button id="retry" class="btn btn-gold">${icon('RefreshCw', 'h-4 w-4')} Try again</button><button data-nav="/" class="btn btn-ghost">${icon('ArrowLeft', 'h-4 w-4')} Go back</button>`
          : `<button data-nav="/" class="btn btn-gold">${icon('Home', 'h-4 w-4')} Homepage</button><button data-nav="/docs" class="btn btn-ghost">${icon('BookOpen', 'h-4 w-4')} Documentation</button>`}
      </div>
      ${is500 ? `<div class="seq mt-10 flex items-center justify-center gap-2 text-xs text-dim" style="--d:.85s">${icon('AlertTriangle', 'h-3.5 w-3.5')} API status: <span class="font-bold text-ok">Operational</span></div>` : ''}
    </div>
  </main>`;
}
