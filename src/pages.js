import { apiDefinitions, getApiBySlug, getCategories } from './apis/registry.js';
import { esc, icon, refreshIcons, copyText } from './utils.js';
import { renderApiCard } from './components.js';
import { observeReveals } from './motion.js';

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
   HOME
   ========================================================= */

export function renderHome() {
  const cats = getCategories();
  const demo = getApiBySlug('instagram') || apiDefinitions[0];
  const demoPath = `${demo?.endpoint || '/api/instagram'}?url=https://instagram.com/p/Cx1a`;
  const names = apiDefinitions.map((a) => `<span class="glass flex items-center gap-2.5 rounded-full px-4 py-2.5 text-sm font-semibold text-muted">${icon(a.icon, 'h-4 w-4 text-gold')}${esc(a.name)}</span>`).join('');

  const stat = (value, label, attrs = '') => `<div class="px-3 py-2 text-center sm:px-6"><div class="font-display text-4xl sm:text-5xl" ${attrs}>${value}</div><div class="mt-2 text-xs font-semibold text-dim">${label}</div></div>`;

  return `<main>
  <section class="relative overflow-hidden pb-16 pt-[calc(var(--nav-h)+48px)] sm:pb-24 sm:pt-[calc(var(--nav-h)+80px)]">
    <div class="grid-fade absolute inset-0"></div>
    <div class="parallax pointer-events-none absolute inset-0">
      <div class="orb -left-40 top-0 h-[520px] w-[520px] bg-gold"></div>
      <div class="orb -right-32 top-40 h-[440px] w-[440px] bg-[#2f7d78]" style="animation-delay:-8s;animation-duration:30s"></div>
    </div>

    <div class="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
      <div>
        <div class="seq glass mb-8 inline-flex items-center gap-2.5 rounded-full py-1.5 pl-2 pr-4 text-xs font-bold" style="--d:.1s"><span class="grid h-6 w-6 place-items-center rounded-full bg-gold/15 text-gold">${icon('Sparkles', 'h-3 w-3')}</span><span class="text-muted"><span class="text-fg">${apiDefinitions.length} endpoints</span> live and documented</span></div>
        <h1 class="text-balance text-[clamp(3.2rem,9vw,7rem)] leading-[0.94]">
          <span class="hl"><span style="--d:.2s">Powerful APIs.</span></span>
          <span class="hl"><span class="italic text-gold-grad" style="--d:.38s">Simple to use.</span></span>
        </h1>
        <p class="seq mt-8 max-w-xl text-base leading-8 text-muted sm:text-lg" style="--d:.7s">A collection of fast, reliable APIs built for modern developers. Download media, generate content, and build something amazing.</p>
        <div class="seq mt-10 flex flex-col gap-3 sm:flex-row" style="--d:.85s">
          <button data-nav="/docs" data-magnetic class="btn btn-gold">Explore the APIs ${icon('ArrowRight', 'arr h-4 w-4')}</button>
          <button data-nav="/docs" class="btn btn-ghost">${icon('BookOpen', 'h-4 w-4')} Read documentation</button>
        </div>
      </div>

      <div class="seq float" style="--d:.6s">
        <div class="code shadow-[0_50px_100px_-40px_rgba(212,175,106,0.35)]">
          <div class="code-head">
            <div class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-full bg-[#5b5347]"></span><span class="h-2.5 w-2.5 rounded-full bg-[#8a7a58]"></span><span class="h-2.5 w-2.5 rounded-full bg-[#d4af6a]"></span></div>
            <span class="font-mono text-[10px] tracking-wider text-[#7d766a]">live request</span>
            <span class="ln flex items-center gap-1.5 font-mono text-[10px] text-emerald-400" style="--d:3.6s"><span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>200 · 118ms</span>
          </div>
          <pre class="p-5 text-[12px] leading-[1.9] sm:p-6 sm:text-[13px]"><code><span class="tk-k">GET</span> <span class="caret">${typed(demoPath, 1.5, 2.2, 'tk-s')}</span>
<span class="ln tk-c" style="--d:3.7s">// response</span>
<span class="ln" style="--d:3.85s">{</span>
<span class="ln" style="--d:4s">  <span class="tk-p">"success"</span>: <span class="tk-k">true</span>,</span>
<span class="ln" style="--d:4.15s">  <span class="tk-p">"data"</span>: {</span>
<span class="ln" style="--d:4.3s">    <span class="tk-p">"media"</span>: [{ <span class="tk-p">"url"</span>: <span class="tk-s">"https://…/video.mp4"</span> }]</span>
<span class="ln" style="--d:4.45s">  }</span>
<span class="ln" style="--d:4.6s">}</span></code></pre>
        </div>
      </div>
    </div>

    <div class="relative mx-auto mt-16 max-w-5xl px-5 sm:mt-24 sm:px-8">
      <div class="seq glass grid grid-cols-2 gap-y-6 rounded-3xl py-7 sm:grid-cols-4 sm:divide-x sm:divide-fg/10 sm:py-8" style="--d:1s">
        ${stat('0', 'Available APIs', `data-count="${apiDefinitions.length}" data-suffix="+"`)}
        ${stat('0', 'API uptime', 'data-count="100" data-suffix="%"')}
        ${stat('0', 'Avg. response', 'data-count="120" data-prefix="<" data-suffix="ms"')}
        ${stat('0', 'Reliability', 'data-count="99.9" data-dec="1" data-suffix="%"')}
      </div>
    </div>
  </section>

  <section class="border-y hair py-6" aria-label="Available APIs">
    <div class="marquee"><div class="marquee-track">${names}</div><div class="marquee-track" aria-hidden="true">${names}</div></div>
  </section>

  <section class="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28" id="apis">
    ${reveal(`<div class="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
      <div>
        <h2 class="text-balance max-w-xl text-4xl leading-[1.02] sm:text-6xl">Everything you need to build.</h2>
        <p class="mt-4 max-w-lg text-sm leading-7 text-muted">Production-ready endpoints with clear documentation and predictable responses.</p>
      </div>
      <div class="relative w-full lg:w-72">${icon('Search', 'pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dim')}<input id="home-search" placeholder="Search APIs..." aria-label="Search APIs" class="input !rounded-full !pl-11"></div>
    </div>`)}
    ${reveal(`<div id="cat-chips" class="mb-9 flex flex-wrap gap-2"><button class="chip is-active" data-cat="">All</button>${cats.map((c) => `<button class="chip" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}</div>`, 80)}
    <div id="api-grid" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">${apiDefinitions.map((a, i) => renderApiCard(a, i)).join('')}</div>
    <div id="no-apis" class="hidden rounded-3xl border border-dashed border-fg/20 py-20 text-center">${icon('Search', 'mx-auto h-8 w-8 text-dim')}<p class="mt-4 text-sm font-bold">No APIs found</p><p class="mt-1 text-xs text-dim">Try a different search term or category.</p></div>
    ${reveal(`<button data-nav="/docs" class="group inline-flex items-center gap-2 text-sm font-bold text-gold">View all documentation ${icon('ArrowRight', 'h-4 w-4 transition-transform duration-500 group-hover:translate-x-1.5')}</button>`, 0, 'div', 'mt-12 text-center')}
  </section>

  <section class="relative border-y hair bg-surface/50">
    <div class="mx-auto grid max-w-7xl gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-2 lg:items-center">
      ${reveal(`<h2 class="text-balance max-w-lg text-4xl leading-[1.02] sm:text-6xl">The fastest way from idea to API.</h2>
      <p class="mt-6 max-w-lg text-sm leading-7 text-muted">Built with developers in mind. Every endpoint is designed to be intuitive, documented, and ready to ship.</p>
      <div class="mt-10 grid gap-6 sm:grid-cols-2">
        ${[['Gauge', 'Blazing fast', 'Low latency, every request.'], ['ShieldCheck', 'Reliable by default', '99.9% uptime SLA.'], ['Database', 'Simple responses', 'Predictable JSON outputs.'], ['BookOpen', 'Clear docs', 'Start building in minutes.']].map(([ic, t, d]) => `<div class="group flex gap-4"><span class="iconbox h-11 w-11 shrink-0 transition-transform duration-500 group-hover:-translate-y-1">${icon(ic, 'h-[18px] w-[18px]')}</span><div><div class="text-sm font-extrabold">${t}</div><div class="mt-1 text-xs leading-5 text-muted">${d}</div></div></div>`).join('')}
      </div>`)}
      ${reveal(`<div class="code shadow-[0_50px_100px_-50px_rgba(0,0,0,0.7)]">
        <div class="code-head"><div class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-full bg-[#5b5347]"></span><span class="h-2.5 w-2.5 rounded-full bg-[#8a7a58]"></span><span class="h-2.5 w-2.5 rounded-full bg-[#d4af6a]"></span></div><span class="font-mono text-[10px] text-[#7d766a]">request.js</span></div>
        <pre class="p-6 text-[12px] leading-[1.9]"><code><span class="tk-k">const</span> response = <span class="tk-k">await</span> fetch(<span class="tk-s">"https://samapi.com/api/instagram?url="</span> +
  postUrl);

<span class="tk-k">const</span> { data } = <span class="tk-k">await</span> response.json();

<span class="tk-c">// Ready to use.</span>
console.log(data.media[<span class="tk-n">0</span>].url);</code></pre>
        <div class="p-4 pt-0"><button id="copy-base-url" class="flex w-full items-center justify-center gap-2 rounded-full border border-white/10 py-3 text-xs font-bold text-[#d6d0c4] transition-all duration-500 hover:border-[#d4af6a]/60 hover:bg-[#d4af6a]/10">${icon('Copy', 'h-3.5 w-3.5')} Copy base URL</button></div>
      </div>`, 160)}
    </div>
  </section>

  <section class="relative overflow-hidden">
    <div class="orb left-1/2 top-1/2 h-[420px] w-[620px] -translate-x-1/2 -translate-y-1/2 bg-gold" style="opacity:.16"></div>
    <div class="relative mx-auto max-w-4xl px-5 py-24 text-center sm:px-8 sm:py-36">
      ${reveal(`<p class="text-sm font-bold text-gold">Ready to build?</p>
      <h2 class="text-balance mt-5 text-5xl leading-[0.98] sm:text-7xl">Your next project starts here.</h2>
      <p class="mx-auto mt-6 max-w-md text-sm leading-7 text-muted">Explore our APIs and bring your ideas to life with just a few lines of code.</p>
      <button data-nav="/docs" data-magnetic class="btn btn-gold mt-10">Start building ${icon('ArrowRight', 'arr h-4 w-4')}</button>`)}
    </div>
  </section>
</main>`;
}

export function bindHome() {
  const state = { q: '', cat: '' };
  const grid = document.getElementById('api-grid');
  const empty = document.getElementById('no-apis');

  const paint = () => {
    const q = state.q.toLowerCase();
    const list = apiDefinitions.filter((api) =>
      (!state.cat || api.category === state.cat) &&
      `${api.name} ${api.description} ${api.category}`.toLowerCase().includes(q)
    );
    grid.innerHTML = list.map((a, i) => renderApiCard(a, i)).join('');
    empty.classList.toggle('hidden', list.length !== 0);
    refreshIcons();
    observeReveals();
  };

  document.getElementById('home-search')?.addEventListener('input', (e) => { state.q = e.target.value; paint(); });

  document.getElementById('cat-chips')?.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-cat]');
    if (!chip) return;
    state.cat = chip.dataset.cat;
    document.querySelectorAll('#cat-chips .chip').forEach((c) => c.classList.toggle('is-active', c === chip));
    paint();
  });

  document.getElementById('copy-base-url')?.addEventListener('click', async (e) => {
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
  return `<div class="code"><div class="code-head"><span class="font-mono text-[10px] uppercase tracking-widest text-[#7d766a]">${esc(language)}</span><button data-code-copy="${encodeURIComponent(code)}" class="flex items-center gap-1.5 text-[10px] font-bold text-[#7d766a] transition-colors hover:text-white">${icon('Copy', 'h-3 w-3')} Copy</button></div><pre class="max-h-96 p-5 text-[11.5px] leading-6"><code>${esc(code)}</code></pre></div>`;
}

/* =========================================================
   TRY PANEL
   ========================================================= */

function tryPanel(api) {
  const inputs = api.parameters.map((p) =>
    `<label class="block"><span class="mb-2 block text-xs font-bold">${esc(p.name)} ${p.required ? '<span class="text-red-400">*</span>' : ''}</span><input data-param="${esc(p.name)}" placeholder="${esc(p.example || '')}" class="input font-mono !text-xs"></label>`
  ).join('');
  const initialUrl = `${window.location.origin}${api.endpoint}`;

  return `<section id="try-panel" class="card mt-14 !overflow-visible p-6 sm:p-8" style="border-color:rgb(var(--gold)/.3)">
    <div class="mb-6 flex items-center gap-3"><span class="iconbox h-10 w-10">${icon('Play', 'h-4 w-4')}</span><div><h3 class="text-base font-extrabold">Try this API</h3><p class="text-xs text-muted">Send a real request and inspect the response.</p></div></div>
    <div class="grid gap-4 ${api.parameters.length > 1 ? 'sm:grid-cols-2' : ''}">${inputs || '<p class="text-xs text-muted">This endpoint takes no parameters.</p>'}</div>
    <div class="mt-6 flex flex-col gap-2.5 sm:flex-row">
      <button id="send-request" class="btn btn-gold btn-sm flex-1">${icon('Play', 'h-3.5 w-3.5')}<span>Send request</span></button>
      <button id="copy-url" class="btn btn-ghost btn-sm">${icon('Copy', 'h-3.5 w-3.5')}<span>Copy URL</span></button>
    </div>
    <div id="try-url" class="mt-4 break-all rounded-2xl bg-[#0d0c0b] px-4 py-3 font-mono text-[11px] leading-5 text-[#a8a094]">${esc(api.method)} ${esc(initialUrl)}</div>
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

  return `<div class="mx-auto flex max-w-[92rem] gap-8 px-3 pt-[calc(var(--nav-h)+20px)] sm:px-6 lg:px-8">
    <div id="scrim" class="scrim"></div>
    <aside id="docs-sidebar" class="sidebar" aria-label="API reference">
      <div class="flex h-full flex-col">
        <div class="px-5 pb-4 pt-5">
          <div class="mb-4 flex items-center justify-between"><div class="flex items-center gap-2 text-sm font-extrabold">${icon('BookOpen', 'h-4 w-4 text-gold')} API Reference</div><button id="close-sidebar" class="iconbtn !h-8 !w-8 lg:hidden" aria-label="Close menu">${icon('X', 'h-4 w-4')}</button></div>
          <div class="relative">${icon('Search', 'pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-dim')}<input id="docs-search" placeholder="Search endpoints" aria-label="Search endpoints" class="input !h-10 !rounded-full !pl-10 !text-xs"></div>
        </div>
        <nav id="docs-nav" class="flex-1 overflow-auto px-3 pb-4">${categories.map((cat) => `<div class="mb-3" data-category="${esc(cat)}"><button data-category-toggle class="mb-1 flex w-full items-center justify-between px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-dim transition-colors hover:text-gold"><span>${esc(cat)}</span>${icon('ChevronDown', 'chev h-3 w-3')}</button><div class="collapse"><div data-category-items>${apiDefinitions.filter((a) => a.category === cat).map((api) => docNavItem(api, selected)).join('')}</div></div></div>`).join('')}</nav>
        <div class="border-t hair p-4"><div class="flex items-center gap-2.5 rounded-2xl bg-fg/5 p-3.5"><span class="relative flex h-2 w-2"><span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-70"></span><span class="relative inline-flex h-2 w-2 rounded-full bg-ok"></span></span><div><div class="text-xs font-bold">All systems operational</div><div class="text-[10px] text-dim">Last checked just now</div></div></div></div>
      </div>
    </aside>
    <button id="open-sidebar" class="btn btn-gold btn-sm fixed bottom-5 left-1/2 z-30 -translate-x-1/2 shadow-2xl lg:hidden">${icon('Menu', 'h-4 w-4')} API menu</button>
    <main class="min-w-0 flex-1 px-2 pb-24 pt-6 sm:px-4 lg:px-8 lg:pt-10">${selected ? renderApiDetail(selected) : renderDocsIndex()}</main>
  </div>`;
}

function docNavItem(api, selected) {
  const active = selected?.slug === api.slug;
  return `<button data-nav="/docs/${encodeURIComponent(api.slug)}" data-doc-api="${esc(api.slug)}" class="navitem ${active ? 'is-active' : ''}">${icon(api.icon, 'h-4 w-4')}<span class="flex-1 truncate">${esc(api.name)}</span><span class="text-[9px] font-extrabold ${api.method === 'GET' ? 'text-ok' : 'text-warn'}">${esc(api.method)}</span></button>`;
}

function renderDocsIndex() {
  return `<div class="max-w-4xl">
    <div class="mb-12">
      <p class="seq text-sm font-bold text-gold" style="--d:.05s">Documentation</p>
      <h1 class="mt-3 text-[clamp(3rem,7vw,5.5rem)] leading-[0.96]"><span class="hl"><span style="--d:.12s">API Reference</span></span></h1>
      <p class="seq mt-6 max-w-xl text-[15px] leading-8 text-muted" style="--d:.35s">Everything you need to integrate SamApi into your project. Pick an endpoint from the menu to get started.</p>
    </div>
    <div id="docs-cards" class="grid gap-4 sm:grid-cols-2">${apiDefinitions.map((api, i) => reveal(`<button data-nav="/docs/${encodeURIComponent(api.slug)}" class="card group flex w-full items-center gap-4 p-4 text-left"><span class="iconbox h-11 w-11 shrink-0">${icon(api.icon, 'h-4 w-4')}</span><span class="min-w-0 flex-1"><span class="block truncate text-sm font-extrabold">${esc(api.name)}</span><span class="mt-1 block truncate font-mono text-[10px] text-dim">${esc(api.method)} ${esc(api.endpoint)}</span></span>${icon('ChevronRight', 'h-4 w-4 text-dim transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-gold')}</button>`, (i % 2) * 90)).join('')}</div>
  </div>`;
}

/* =========================================================
   API DETAIL
   ========================================================= */

function renderApiDetail(api) {
  const params = api.parameters.map((p) =>
    `<div class="row-hover grid gap-2 border-b hair px-5 py-4 last:border-0 sm:grid-cols-[1fr_100px_2fr] sm:items-center"><div class="flex items-center gap-2"><code class="font-mono text-xs font-bold text-gold">${esc(p.name)}</code>${p.required ? '<span class="text-[9px] font-extrabold uppercase text-red-400">required</span>' : ''}</div><code class="font-mono text-[11px] text-dim">${esc(p.type)}</code><p class="text-xs leading-5 text-muted">${esc(p.description)}</p></div>`
  ).join('') || '<div class="px-5 py-5 text-xs text-muted">No parameters.</div>';

  const fields = api.responseFields.map((f) =>
    `<div class="row-hover flex flex-col gap-1 border-b hair px-5 py-3.5 last:border-0 sm:flex-row sm:items-center"><code class="w-48 shrink-0 font-mono text-xs text-gold">${esc(f.name)}</code><code class="w-20 shrink-0 font-mono text-[11px] text-dim">${esc(f.type)}</code><span class="text-xs text-muted">${esc(f.description)}</span></div>`
  ).join('');

  const currentEndpoint = `${window.location.origin}${api.endpoint}`;
  const h2 = (t) => `<h2 class="mb-5 text-3xl">${t}</h2>`;

  return `<div class="max-w-3xl">
    <div class="mb-8 flex items-start gap-5">
      <div class="seq iconbox h-16 w-16 shrink-0" style="--d:.05s">${icon(api.icon, 'h-7 w-7')}</div>
      <div class="min-w-0">
        <div class="seq mb-3 flex flex-wrap items-center gap-2.5" style="--d:.1s"><span class="badge badge-cat">${esc(api.category)}</span><span class="text-xs text-dim">Updated recently</span></div>
        <h1 class="text-balance text-[clamp(2.4rem,6vw,4.25rem)] leading-[0.98]"><span class="hl"><span style="--d:.15s">${esc(api.name)}</span></span></h1>
      </div>
    </div>
    <p class="seq mb-8 text-[15px] leading-8 text-muted" style="--d:.4s">${esc(api.description)}</p>
    <div class="seq glass mb-12 flex items-center gap-3 rounded-2xl px-4 py-3" style="--d:.5s">${methodBadge(api.method)}<code class="flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs text-muted">${esc(currentEndpoint)}</code><button data-copy="${esc(currentEndpoint)}" class="iconbtn !h-8 !w-8" aria-label="Copy endpoint">${icon('Copy', 'h-3.5 w-3.5')}</button></div>

    ${reveal(`${h2('Parameters')}<div class="card !rounded-2xl"><div class="hidden grid-cols-[1fr_100px_2fr] border-b hair bg-fg/[0.03] px-5 py-3 text-[10px] font-extrabold uppercase tracking-wider text-dim sm:grid"><span>Name</span><span>Type</span><span>Description</span></div>${params}</div>`, 0, 'section', 'mb-12')}
    ${reveal(`${h2('Example request')}${codeBlock(getCurrentApiUrl(api.exampleRequest), api.method === 'POST' ? 'http' : 'url')}`, 0, 'section', 'mb-12')}
    ${reveal(`${h2('Example response')}${codeBlock(JSON.stringify(api.responseExample, null, 2))}${fields ? `<div class="card mt-6 !rounded-2xl"><div class="border-b hair bg-fg/[0.03] px-5 py-3.5 text-[10px] font-extrabold uppercase tracking-wider text-dim">Response fields</div>${fields}</div>` : ''}`, 0, 'section')}
    ${reveal(tryPanel(api), 0, 'div')}
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

  document.querySelectorAll('[data-category-toggle]').forEach((btn) =>
    btn.addEventListener('click', () => btn.closest('[data-category]').toggleAttribute('data-collapsed'))
  );

  document.getElementById('docs-search')?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('[data-doc-api]').forEach((el) =>
      el.classList.toggle('hidden', !`${el.textContent} ${el.dataset.docApi}`.toLowerCase().includes(q))
    );
    document.querySelectorAll('[data-category]').forEach((cat) => {
      const has = !!cat.querySelector('[data-doc-api]:not(.hidden)');
      cat.classList.toggle('hidden', !has);
      if (q && has) cat.removeAttribute('data-collapsed');
    });
  });

  if (!api) return;

  const fieldValue = (name) => document.querySelector(`[data-param="${CSS.escape(name)}"]`)?.value;
  const buildUrl = () => {
    const query = api.parameters.filter((p) => fieldValue(p.name)).map((p) => `${p.name}=${encodeURIComponent(fieldValue(p.name))}`).join('&');
    return `${window.location.origin}${api.endpoint}${query ? '?' + query : ''}`;
  };

  document.querySelectorAll('[data-param]').forEach((el) =>
    el.addEventListener('input', () => { document.getElementById('try-url').textContent = `${api.method} ${buildUrl()}`; })
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

    const showText = (output, status) => {
      box.innerHTML = `${status ? `<div class="mb-2 flex items-center gap-2 text-[11px] font-bold ${status.ok ? 'text-ok' : 'text-red-400'}"><span class="h-1.5 w-1.5 rounded-full bg-current"></span>${esc(status.label)} · ${Math.round(performance.now() - t0)}ms</div>` : ''}${codeBlock(output)}`;
      refreshIcons();
    };

    try {
      const response = await fetch(requestUrl, { method: api.method, headers: { Accept: 'application/json' } });
      const contentType = response.headers.get('content-type') || '';
      const status = { ok: response.ok, label: `${response.status} ${response.statusText || (response.ok ? 'OK' : 'Error')}` };

      if (contentType.startsWith('image/')) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        box.innerHTML = `<div class="card !rounded-2xl p-5"><div class="mb-3 text-xs font-bold text-muted">Response • ${esc(contentType)} • ${Math.round(performance.now() - t0)}ms</div><div class="flex justify-center rounded-xl bg-white p-4"><img src="${imageUrl}" alt="API Response" class="max-w-full rounded-lg" style="max-height:500px"></div><a href="${imageUrl}" download="qrcode.png" class="btn btn-gold btn-sm mt-4 w-full">Download Image</a></div>`;
      } else {
        const result = contentType.includes('application/json') ? await response.json() : await response.text();
        showText(typeof result === 'string' ? result : JSON.stringify(result, null, 2), status);
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
  return `<main class="relative flex min-h-screen items-center justify-center overflow-hidden px-5 pt-[var(--nav-h)]">
    <div class="orb left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 ${is500 ? 'bg-red-500' : 'bg-gold'}" style="opacity:.16"></div>
    <div class="relative text-center">
      <div class="seq relative mx-auto mb-10 grid h-28 w-28 place-items-center" style="--d:.05s"><div class="absolute inset-0 animate-pulse rounded-full ${t.pulse}"></div><div class="glass relative grid h-20 w-20 place-items-center rounded-full ${t.text}">${icon(is500 ? 'ServerCrash' : 'WifiOff', 'h-8 w-8')}</div></div>
      <p class="seq font-mono text-xs font-bold tracking-[0.3em] ${t.text}" style="--d:.15s">ERROR ${type}</p>
      <h1 class="text-balance mt-4 text-[clamp(2.8rem,8vw,5.5rem)] leading-[0.98]"><span class="hl"><span style="--d:.25s">${is500 ? 'Something went wrong' : 'Endpoint not found'}</span></span></h1>
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
