import { apiDefinitions, getApiBySlug, getCategories } from './apis/registry.js';
import { esc, icon, refreshIcons, copyText } from './utils.js';
import { renderApiCard } from './components.js';
import { observeReveals } from './motion.js';
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
   HOME
   ========================================================= */

export function renderHome() {
  const cats = getCategories();
  const n = apiDefinitions.length;

  const stat = (key, value, attrs = '') => `<div class="stat-line"><span class="text-dim">${key}</span><span class="font-bold text-fg" ${attrs}>${value}</span></div>`;
  const dots = '<div class="term-dots"><i></i><i></i><i></i></div>';
  const feature = (t, d) => `<div><span class="text-accent">[+]</span> <b class="text-fg">${t}</b><div class="pl-[34px] text-muted">${d}</div></div>`;
  const boot = (d, text) => `<div style="--d:${d}s"><span class="ok-tag">[ ok ]</span> <span class="text-muted">${text}</span></div>`;

  return `<main>
  <section class="hero-wrap pt-[var(--nav-h)]">
    <canvas id="rain" class="rain" aria-hidden="true"></canvas>
    <div class="relative mx-auto max-w-7xl px-4 pb-14 pt-12 sm:px-8 sm:pb-20 sm:pt-20">
      <div class="grid grid-cols-[minmax(0,1fr)] items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div>
          <div class="boot mb-7 text-xs leading-6 sm:text-[13px]">
            ${boot(0.1, 'loading endpoints')}
            ${boot(0.45, `${n} endpoints online`)}
            ${boot(0.8, 'latency &lt; 120ms')}
          </div>
          <h1 class="text-[clamp(2.3rem,7.4vw,4.3rem)] leading-[1.06] tracking-[-0.04em]">
            <span class="hl"><span class="seq" style="--d:1.1s">Powerful APIs.</span></span>
            <span class="hl"><span class="seq glow text-accent" style="--d:1.25s">Simple to use.<span class="cursor ml-2"></span></span></span>
          </h1>
          <p class="seq mt-7 max-w-[46ch] text-[15px] leading-8 text-muted sm:text-base" style="--d:1.5s">Fast, reliable APIs for modern developers. Download media, generate content, and ship faster.</p>
          <div class="seq mt-9 flex flex-col gap-3 sm:flex-row" style="--d:1.65s">
            <button data-nav="/docs" class="btn btn-primary">$ explore --apis</button>
            <button data-nav="/docs" class="btn btn-ghost">$ man docs</button>
          </div>
        </div>

        <div class="seq min-w-0" style="--d:.6s">
          <div class="term">
            <div class="term-head">
              ${dots}
              <span class="text-[11px] text-dim">bash — samapi</span>
              <span id="demo-status" class="text-[11px] text-ok">…</span>
            </div>
            <pre class="min-h-[250px] overflow-hidden whitespace-pre-wrap break-all p-4 text-[12px] leading-[1.9] sm:p-5 sm:text-[13px] sm:min-h-[270px]"><code><span class="text-accent">$</span> <span class="tk-k">GET</span> <span id="demo-req" class="tk-s caret"></span>
<span class="tk-c"># response</span>
<span id="demo-res"></span></code></pre>
          </div>
        </div>
      </div>

      <div class="seq term mt-12 sm:mt-16" style="--d:1.9s">
        <div class="p-4 sm:p-5">
          <div class="mb-3 text-dim"><span class="text-accent">$</span> samapi status</div>
          <div class="grid grid-cols-1 gap-x-10 gap-y-2 sm:grid-cols-2 lg:grid-cols-4">
            ${stat('endpoints', '0', `data-count="${n}" data-suffix="+"`)}
            ${stat('uptime', '0', 'data-count="100" data-suffix="%"')}
            ${stat('avg_latency', '0', 'data-count="120" data-prefix="&lt;" data-suffix="ms"')}
            ${stat('reliability', '0', 'data-count="99.9" data-dec="1" data-suffix="%"')}
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-24" id="apis">
    <div class="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
      <div>
        <p class="mb-3 text-dim"><span class="text-accent">$</span> ls -la /api</p>
        <h2 class="text-balance max-w-xl text-[1.9rem] leading-[1.1] sm:text-[2.6rem]">Find the endpoint you need.</h2>
        <p class="mt-4 max-w-md text-[14px] leading-7 text-muted">Production-ready endpoints with clear documentation and predictable responses.</p>
      </div>
      <div class="relative w-full lg:w-96"><span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-accent">$ grep -i</span><input id="home-search" placeholder="search apis..." aria-label="Search APIs" autocomplete="off" spellcheck="false" class="input !h-12 !pl-[6.6rem]"></div>
    </div>
    <div id="cat-chips" class="no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"><button class="chip is-active" data-cat="">all</button>${cats.map((c) => `<button class="chip" data-cat="${esc(c)}">${esc(c.toLowerCase())}</button>`).join('')}</div>
    <div id="api-count" class="mb-3 text-xs text-dim">total ${n}</div>
    <div id="api-grid" class="grid grid-cols-[minmax(0,1fr)] gap-3 lg:grid-cols-2">${apiDefinitions.map((a, i) => renderApiCard(a, i)).join('')}</div>
    <div id="no-apis" class="hidden rounded-lg border border-dashed border-fg/20 py-16 text-center"><p class="text-sm font-bold text-accent">grep: no match</p><p class="mt-2 text-xs text-dim">Try another keyword, or clear the filter to list everything.</p></div>
    <div class="mt-10 text-center"><button data-nav="/docs" class="group inline-flex items-center gap-2 text-sm font-bold text-accent">$ cd /docs ${icon('ArrowRight', 'h-4 w-4 transition-transform duration-300 group-hover:translate-x-1')}</button></div>
  </section>

  <section class="border-y hair bg-surface">
    <div class="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-12 px-4 py-16 sm:px-8 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
      <div>
        <p class="mb-3 text-dim"><span class="text-accent">$</span> cat README.md</p>
        <h2 class="text-balance max-w-lg text-[1.9rem] leading-[1.12] sm:text-[2.6rem]">The fastest way from idea to API.</h2>
        <p class="mt-5 max-w-md text-[14px] leading-7 text-muted">Built with developers in mind. Every endpoint is designed to be intuitive, documented, and ready to ship.</p>
        <div class="mt-9 grid gap-5">
          ${feature('Blazing fast', 'Low latency, every request.')}
          ${feature('Reliable by default', '99.9% uptime SLA.')}
          ${feature('Simple responses', 'Predictable JSON outputs.')}
          ${feature('Clear docs', 'Start building in minutes.')}
        </div>
      </div>
      <div class="min-w-0">
        <div class="code">
          <div class="code-head"><span class="font-mono text-[11px] text-[#5f7a6a]">request.js</span><span class="term-dots">${dots}</span></div>
          <pre class="p-5 text-[12px] leading-[1.9] sm:p-6 sm:text-[13px]"><code><span class="tk-k">const</span> response = <span class="tk-k">await</span> fetch(<span class="tk-s">"https://samapi.com/api/instagram?url="</span> +
  postUrl);

<span class="tk-k">const</span> { data } = <span class="tk-k">await</span> response.json();

<span class="tk-c">// Ready to use.</span>
console.log(data.media[<span class="tk-n">0</span>].url);</code></pre>
          <div class="p-4 pt-0"><button id="copy-base-url" class="flex w-full items-center justify-center gap-2 rounded border border-[#3dff8a]/25 py-3 text-xs font-bold text-[#cfe9d9] transition-colors duration-200 hover:border-[#3dff8a] hover:text-[#3dff8a]">${icon('Copy', 'h-3.5 w-3.5')} $ copy --base-url</button></div>
        </div>
      </div>
    </div>
  </section>

  <section>
    <div class="mx-auto max-w-3xl px-4 py-24 text-center sm:px-8 sm:py-32">
      <p class="mb-4 text-dim"><span class="text-accent">$</span> ./start-building.sh</p>
      <h2 class="text-balance glow text-[2.1rem] leading-[1.08] sm:text-5xl">Your next project starts here.</h2>
      <p class="mx-auto mt-6 max-w-md text-[14px] leading-7 text-muted">Explore our APIs and bring your ideas to life with just a few lines of code.</p>
      <button data-nav="/docs" class="btn btn-primary mt-9">$ start --building <span class="cursor !bg-[rgb(var(--btn-fg))]"></span></button>
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
    const count = document.getElementById('api-count');
    if (count) count.textContent = list.length === apiDefinitions.length ? `total ${list.length}` : `${list.length} of ${apiDefinitions.length} match`;
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
    btn.innerHTML = `${icon('Check', 'h-3.5 w-3.5 text-emerald-400')} copied to clipboard`;
    refreshIcons();
    setTimeout(() => { btn.innerHTML = `${icon('Copy', 'h-3.5 w-3.5')} $ copy --base-url`; refreshIcons(); }, 1600);
  });
}

/* =========================================================
   CODE BLOCK
   ========================================================= */

function codeBlock(code, language = 'json') {
  return `<div class="code"><div class="code-head"><span class="font-mono text-[10px] text-[#6c7396]">${esc(language)}</span><button data-code-copy="${encodeURIComponent(code)}" class="flex items-center gap-1.5 text-[10px] font-bold text-[#6c7396] transition-colors hover:text-white">${icon('Copy', 'h-3 w-3')} Copy</button></div><pre class="max-h-96 p-5 text-[11.5px] leading-6"><code>${esc(code)}</code></pre></div>`;
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
      const uploadLabel = api.slug === 'tourl';
      if (uploadLabel) return `<div class="sm:col-span-2">
        <span class="mb-2 block text-xs font-bold">Pilih file ${p.required ? '<span class="text-red-400">*</span>' : ''}</span>
        <label class="group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-[rgb(var(--accent)/.42)] bg-[rgb(var(--accent)/.04)] px-5 py-8 text-center transition-all hover:border-[rgb(var(--accent)/.8)] hover:bg-[rgb(var(--accent)/.08)] sm:py-10">
          <input data-param="${esc(p.name)}" data-upload-input type="file" class="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0" aria-label="Pilih file untuk diunggah" required="${p.required ? 'required' : ''}">
          <span class="mb-3 grid h-14 w-14 place-items-center rounded-2xl border border-[rgb(var(--accent)/.25)] bg-[rgb(var(--accent)/.10)] text-accent transition-transform group-hover:-translate-y-0.5">${icon('UploadCloud', 'h-7 w-7')}</span>
          <span class="text-sm font-bold text-fg">Klik untuk memilih file</span>
          <span class="mt-1 text-xs text-muted">Pilih file dari perangkat kamu · Maksimal 4 MB</span>
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
    <div class="mb-6 flex items-center gap-3"><span class="iconbox h-10 w-10">${icon('Play', 'h-4 w-4')}</span><div><h3 class="text-base font-bold"><span class="text-accent">$</span> try --request</h3><p class="text-xs text-muted">Send a real request and inspect the response.</p></div></div>
    <div class="grid grid-cols-[minmax(0,1fr)] gap-4 ${api.parameters.length > 1 ? 'sm:grid-cols-2' : ''}">${inputs || '<p class="text-xs text-muted">This endpoint takes no parameters.</p>'}</div>
    ${api.slug === 'add-subdomain' ? '<label class="mt-4 block"><span class="mb-2 block text-xs font-bold">API key <span class="text-red-400">*</span></span><input data-api-key type="password" autocomplete="off" placeholder="Masukkan ADD_SUBDOMAIN_API_KEY" class="input font-mono !text-xs"></label>' : ''}
    <div class="mt-6 flex flex-col gap-2.5 sm:flex-row">
      <button id="send-request" class="btn btn-primary btn-sm flex-1">${icon('Play', 'h-3.5 w-3.5')}<span>$ send --request</span></button>
      <button id="copy-url" class="btn btn-ghost btn-sm">${icon('Copy', 'h-3.5 w-3.5')}<span>Copy URL</span></button>
    </div>
    <div id="try-url" class="mt-4 break-all rounded-xl bg-[#090c22] px-4 py-3 font-mono text-[11px] leading-5 text-[#aab0d0]">${esc(api.method)} ${esc(initialUrl)}</div>
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
          <div class="mb-4 flex items-center justify-between"><div class="flex items-center gap-2 text-sm font-extrabold">${icon('BookOpen', 'h-4 w-4 text-accent')} API Reference</div><button id="close-sidebar" class="iconbtn !h-8 !w-8 lg:hidden" aria-label="Close menu">${icon('X', 'h-4 w-4')}</button></div>
          <div class="relative">${icon('Search', 'pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-dim')}<input id="docs-search" placeholder="Search endpoints" aria-label="Search endpoints" class="input !h-10 !rounded-full !pl-10 !text-xs"></div>
        </div>
        <nav id="docs-nav" class="flex-1 overflow-auto px-3 pb-4">${categories.map((cat) => `<div class="mb-3" data-category="${esc(cat)}"><button data-category-toggle class="mb-1 flex w-full items-center justify-between px-2 py-1 text-xs font-bold text-dim transition-colors hover:text-accent"><span>${esc(cat)}</span>${icon('ChevronDown', 'chev h-3 w-3')}</button><div class="fold"><div data-category-items>${apiDefinitions.filter((a) => a.category === cat).map((api) => docNavItem(api, selected)).join('')}</div></div></div>`).join('')}</nav>
        <div class="border-t hair p-4"><div class="flex items-center gap-2.5 px-1 py-1"><span class="h-1.5 w-1.5 rounded-full bg-ok"></span><div><div class="text-xs font-bold">All systems operational</div><div class="text-[10px] text-dim">Last checked just now</div></div></div></div>
      </div>
    </aside>
    <div id="fab" class="fab pointer-events-none fixed inset-x-0 bottom-5 z-30 flex justify-center lg:hidden" style="padding-bottom:env(safe-area-inset-bottom,0px)"><button id="open-sidebar" class="btn btn-primary btn-sm pointer-events-auto shadow-2xl">${icon('Menu', 'h-4 w-4')} API menu</button></div>
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
      <p class="seq text-sm text-dim" style="--d:.05s"><span class="text-accent">$</span> man samapi</p>
      <h1 class="mt-3 text-[clamp(2.2rem,7vw,3.75rem)] leading-[1.05]"><span class="hl"><span style="--d:.12s">API Reference</span></span></h1>
      <p class="seq mt-6 max-w-xl text-[15px] leading-8 text-muted" style="--d:.35s">Everything you need to integrate SamApi into your project. Pick an endpoint from the menu to get started.</p>
    </div>
    <div id="docs-cards" class="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2">${apiDefinitions.map((api, i) => reveal(`<button data-nav="/docs/${encodeURIComponent(api.slug)}" class="card group flex w-full items-center gap-4 p-4 text-left"><span class="iconbox h-10 w-10 shrink-0">${icon(api.icon, 'h-4 w-4')}</span><span class="min-w-0 flex-1"><span class="block truncate text-sm font-extrabold">${esc(api.name)}</span><span class="mt-1 block truncate font-mono text-[10px] text-dim">${esc(api.method)} ${esc(api.endpoint)}</span></span>${icon('ChevronRight', 'h-4 w-4 text-dim transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent')}</button>`, (i % 2) * 90)).join('')}</div>
  </div>`;
}

/* =========================================================
   API DETAIL
   ========================================================= */

function renderApiDetail(api) {
  const params = api.parameters.map((p) =>
    `<div class="row-hover grid gap-2 border-b hair px-5 py-4 last:border-0 sm:grid-cols-[1fr_100px_2fr] sm:items-center"><div class="flex items-center gap-2"><code class="font-mono text-xs font-bold text-accent">${esc(p.name)}</code>${p.required ? '<span class="text-[10px] font-bold text-red-400">required</span>' : ''}</div><code class="font-mono text-[11px] text-dim">${esc(p.type)}</code><p class="text-xs leading-5 text-muted">${esc(p.description)}</p></div>`
  ).join('') || '<div class="px-5 py-5 text-xs text-muted">No parameters.</div>';

  const fields = api.responseFields.map((f) =>
    `<div class="row-hover flex flex-col gap-1 border-b hair px-5 py-3.5 last:border-0 sm:flex-row sm:items-center"><code class="w-48 shrink-0 font-mono text-xs text-accent">${esc(f.name)}</code><code class="w-20 shrink-0 font-mono text-[11px] text-dim">${esc(f.type)}</code><span class="text-xs text-muted">${esc(f.description)}</span></div>`
  ).join('');

  const currentEndpoint = `${window.location.origin}${api.endpoint}`;
  const h2 = (t) => `<h2 class="md-h mb-4 text-xl sm:text-2xl">${t}</h2>`;

  return `<div class="max-w-3xl">
    <div class="mb-8 flex items-start gap-5">
      <div class="seq iconbox h-14 w-14 shrink-0" style="--d:.05s">${icon(api.icon, 'h-6 w-6')}</div>
      <div class="min-w-0">
        <div class="seq mb-3 flex flex-wrap items-center gap-2.5" style="--d:.1s"><span class="badge badge-cat">${esc(api.category)}</span><span class="text-xs text-dim">Updated recently</span></div>
        <h1 class="text-balance text-[clamp(2rem,7vw,3.75rem)] leading-[1]"><span class="hl"><span style="--d:.15s">${esc(api.name)}</span></span></h1>
      </div>
    </div>
    <p class="seq mb-8 text-[15px] leading-8 text-muted" style="--d:.4s">${esc(api.description)}</p>
    <div class="seq glass mb-12 flex items-center gap-3 rounded-xl px-4 py-3" style="--d:.5s">${methodBadge(api.method)}<code class="flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs text-muted">${esc(currentEndpoint)}</code><button data-copy="${esc(currentEndpoint)}" class="iconbtn !h-8 !w-8" aria-label="Copy endpoint">${icon('Copy', 'h-3.5 w-3.5')}</button></div>

    ${reveal(`${h2('Parameters')}<div class="card"><div class="hidden grid-cols-[1fr_100px_2fr] border-b hair px-5 py-3 text-xs font-semibold text-dim sm:grid"><span>Name</span><span>Type</span><span>Description</span></div>${params}</div>`, 0, 'section', 'mb-12')}
    ${reveal(`${h2('Example request')}${codeBlock(getCurrentApiUrl(api.exampleRequest), api.method === 'POST' ? 'http' : 'url')}`, 0, 'section', 'mb-12')}
    ${reveal(`${h2('Example response')}${codeBlock(JSON.stringify(api.responseExample, null, 2))}${fields ? `<div class="card mt-6"><div class="border-b hair px-5 py-3.5 text-xs font-semibold text-dim">Response fields</div>${fields}</div>` : ''}`, 0, 'section')}
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

  // sembunyikan tombol "API menu" saat footer terlihat agar tidak menimpa teks footer
  const fab = document.getElementById('fab');
  const footer = document.querySelector('footer');
  if (fab && footer && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => fab.toggleAttribute('data-hide', entry.isIntersecting), { threshold: 0 }).observe(footer);
  }

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
      display.classList.add('text-accent');
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
        btn.innerHTML = `${icon('Play', 'h-3.5 w-3.5')}<span>$ send --request</span>`;
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
    : { text: 'text-accent', pulse: 'bg-accent/15' };
  return `<main class="flex min-h-screen items-center justify-center px-5 pt-[var(--nav-h)]">
    <div class="relative text-center">
      <div class="seq relative mx-auto mb-8 grid h-20 w-20 place-items-center" style="--d:.05s"><div class="glass relative grid h-20 w-20 place-items-center rounded-full ${t.text}">${icon(is500 ? 'ServerCrash' : 'WifiOff', 'h-8 w-8')}</div></div>
      <p class="seq font-mono text-xs font-bold ${t.text}" style="--d:.15s">Error ${type}</p>
      <h1 class="text-balance mt-4 text-[clamp(2.1rem,7vw,3.75rem)] leading-[1.05]"><span class="hl"><span style="--d:.25s">${is500 ? 'Something went wrong' : 'Endpoint not found'}</span></span></h1>
      <p class="seq mx-auto mt-5 max-w-md text-sm leading-7 text-muted" style="--d:.55s">${is500 ? 'Our servers ran into an unexpected issue. Your request was not completed, but our team has been notified.' : "The endpoint you are looking for doesn't exist or may have been moved. Check the URL and try again."}</p>
      <div class="seq mt-10 flex flex-col justify-center gap-3 sm:flex-row" style="--d:.7s">
        ${is500
          ? `<button id="retry" class="btn btn-primary">${icon('RefreshCw', 'h-4 w-4')} Try again</button><button data-nav="/" class="btn btn-ghost">${icon('ArrowLeft', 'h-4 w-4')} Go back</button>`
          : `<button data-nav="/" class="btn btn-primary">${icon('Home', 'h-4 w-4')} Homepage</button><button data-nav="/docs" class="btn btn-ghost">${icon('BookOpen', 'h-4 w-4')} Documentation</button>`}
      </div>
      ${is500 ? `<div class="seq mt-10 flex items-center justify-center gap-2 text-xs text-dim" style="--d:.85s">${icon('AlertTriangle', 'h-3.5 w-3.5')} API status: <span class="font-bold text-ok">Operational</span></div>` : ''}
    </div>
  </main>`;
}
