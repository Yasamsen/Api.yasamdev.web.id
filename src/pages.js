import { apiDefinitions, getApiBySlug, getCategories } from './apis/registry.js';
import { navigate } from './router.js';
import { BASE_URL, esc, icon, refreshIcons, copyText } from './utils.js';
import { renderApiCard, bindApiCards } from './components.js';

/* =========================================================
   AUTO DOMAIN
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

/* =========================================================
   HOME
   ========================================================= */

export function renderHome() {
  return `<main><section class="relative overflow-hidden border-b border-slate-200 dark:border-slate-800"><div class="absolute inset-0 dot-grid opacity-70 dark:opacity-40"></div><div class="absolute left-1/2 top-[-240px] h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-100/60 blur-3xl dark:bg-cyan-950/20"></div><div class="relative mx-auto max-w-7xl px-6 pb-20 pt-20 sm:px-8 sm:pb-28 sm:pt-28"><div class="mx-auto max-w-4xl text-center"><div class="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50/80 px-3.5 py-1.5 text-xs font-semibold text-cyan-700 dark:border-cyan-900/70 dark:bg-cyan-950/30 dark:text-cyan-400">${icon('Sparkles','h-3.5 w-3.5')} Build faster with SamApi ${icon('ChevronRight','h-3 w-3')}</div><h1 class="text-balance text-5xl font-bold leading-[1.08] tracking-[-0.055em] text-slate-950 sm:text-7xl dark:text-white">Powerful APIs.<br><span class="text-cyan-500">Simple to use.</span></h1><p class="mx-auto mt-7 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg dark:text-slate-400">A collection of fast, reliable APIs built for modern developers. Download media, generate content, and build something amazing.</p><div class="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><button data-nav="/docs" class="group flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-slate-950/15 transition-all hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">Explore the APIs ${icon('ArrowRight','h-4 w-4')}</button><button data-nav="/docs" class="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">${icon('BookOpen','h-4 w-4')} Read documentation</button></div></div><div class="mx-auto mt-20 grid max-w-4xl grid-cols-2 divide-x divide-slate-200 border-y border-slate-200 py-6 sm:grid-cols-4 dark:divide-slate-800 dark:border-slate-800"><div class="px-4 text-center"><div class="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">${apiDefinitions.length}+</div><div class="mt-1 text-xs text-slate-500 dark:text-slate-400">Available APIs</div></div><div class="px-4 text-center"><div class="text-2xl font-bold tracking-tight text-emerald-500">100%</div><div class="mt-1 text-xs text-slate-500 dark:text-slate-400">API uptime</div></div><div class="mt-6 border-slate-200 px-4 text-center sm:mt-0 sm:border-l dark:border-slate-800"><div class="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">&lt;120ms</div><div class="mt-1 text-xs text-slate-500 dark:text-slate-400">Avg. response</div></div><div class="mt-6 border-slate-200 px-4 text-center sm:mt-0 dark:border-slate-800"><div class="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">99.9%</div><div class="mt-1 text-xs text-slate-500 dark:text-slate-400">Reliability</div></div></div></div></section>
  <section class="mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-28"><div class="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><div class="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">${icon('Layers3','h-3.5 w-3.5')} Explore our APIs</div><h2 class="text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">Everything you need to build.</h2><p class="mt-3 max-w-lg text-sm leading-6 text-slate-500 dark:text-slate-400">Production-ready endpoints with clear documentation and predictable responses.</p></div><div class="relative w-full sm:w-64">${icon('Search','h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400')}<input id="home-search" placeholder="Search APIs..." class="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-400 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-cyan-700"></div></div><div id="api-grid" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">${apiDefinitions.map(renderApiCard).join('')}</div><div id="no-apis" class="hidden rounded-2xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-700">${icon('Search','h-8 w-8 mx-auto text-slate-300')}<p class="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">No APIs found</p><p class="mt-1 text-xs text-slate-400">Try a different search term.</p></div><div class="mt-10 text-center"><button data-nav="/docs" class="inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 transition-colors hover:text-cyan-700 dark:text-cyan-400">View all documentation ${icon('ArrowRight','h-4 w-4')}</button></div></section>
  <section class="border-y border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/30"><div class="mx-auto grid max-w-7xl gap-10 px-6 py-20 sm:px-8 sm:py-24 lg:grid-cols-2 lg:items-center"><div><div class="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">${icon('Zap','h-3.5 w-3.5 fill-current')} Developer first</div><h2 class="max-w-lg text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">The fastest way from idea to API.</h2><p class="mt-5 max-w-lg text-sm leading-7 text-slate-500 dark:text-slate-400">Built with developers in mind. Every endpoint is designed to be intuitive, documented, and ready to ship.</p><div class="mt-7 grid gap-4 sm:grid-cols-2"><div class="flex gap-3"><span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">${icon('Gauge','h-4 w-4')}</span><div><div class="text-sm font-semibold text-slate-800 dark:text-slate-200">Blazing fast</div><div class="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">Low latency, every request.</div></div></div><div class="flex gap-3"><span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-400">${icon('ShieldCheck','h-4 w-4')}</span><div><div class="text-sm font-semibold text-slate-800 dark:text-slate-200">Reliable by default</div><div class="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">99.9% uptime SLA.</div></div></div><div class="flex gap-3"><span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">${icon('Database','h-4 w-4')}</span><div><div class="text-sm font-semibold text-slate-800 dark:text-slate-200">Simple responses</div><div class="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">Predictable JSON outputs.</div></div></div><div class="flex gap-3"><span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300">${icon('BookOpen','h-4 w-4')}</span><div><div class="text-sm font-semibold text-slate-800 dark:text-slate-200">Clear docs</div><div class="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">Start building in minutes.</div></div></div></div></div><div class="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 p-6 shadow-2xl shadow-slate-950/15 dark:border-slate-700"><div class="mb-6 flex items-center gap-2"><span class="h-2.5 w-2.5 rounded-full bg-red-400"></span><span class="h-2.5 w-2.5 rounded-full bg-amber-400"></span><span class="h-2.5 w-2.5 rounded-full bg-emerald-400"></span><span class="ml-auto font-mono text-[10px] text-slate-500">request.js</span></div><pre class="overflow-x-auto font-mono text-[12px] leading-6 text-slate-300"><code><span class="text-pink-400">const</span> response = <span class="text-pink-400">await</span> fetch(<span class="text-emerald-400">\`https://samapi.com/api/instagram\`</span> +<br>  <span class="text-emerald-400">\`?url=&#36;{postUrl}\`</span>);<br><br><span class="text-pink-400">const</span> { data } = <span class="text-pink-400">await</span> response.json();<br><br><span class="text-slate-500">// Ready to use.</span><br>console.log(data.media[<span class="text-amber-300">0</span>].url);</code></pre><button id="copy-base-url" class="mt-7 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:bg-slate-800">${icon('Copy','h-3.5 w-3.5')} Copy base URL</button></div></div></section>
  <section class="mx-auto max-w-7xl px-6 py-20 text-center sm:px-8 sm:py-28"><p class="text-sm font-semibold text-cyan-600 dark:text-cyan-400">Ready to build?</p><h2 class="mt-3 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">Your next project starts here.</h2><p class="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">Explore our APIs and bring your ideas to life with just a few lines of code.</p><button data-nav="/docs" class="mt-7 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">Start building ${icon('ArrowRight','h-4 w-4')}</button></section></main>`;
}

export function bindHome() {
  bindApiCards();

  document.getElementById('home-search')?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = apiDefinitions.filter((api) =>
      `${api.name} ${api.description} ${api.category}`.toLowerCase().includes(q)
    );

    document.getElementById('api-grid').innerHTML =
      filtered.map(renderApiCard).join('');

    document.getElementById('no-apis').classList.toggle(
      'hidden',
      filtered.length !== 0
    );

    bindApiCards();
    refreshIcons();
  });

  document.getElementById('copy-base-url')?.addEventListener(
    'click',
    async (e) => {
      await copyText(window.location.origin);

      const btn = e.currentTarget;

      btn.innerHTML =
        `${icon('Check','h-3.5 w-3.5 text-emerald-400')} Base URL copied`;

      refreshIcons();

      setTimeout(() => {
        btn.innerHTML =
          `${icon('Copy','h-3.5 w-3.5')} Copy base URL`;

        refreshIcons();
      }, 1600);
    }
  );
}

/* =========================================================
   CODE BLOCK
   ========================================================= */

function codeBlock(code, language = 'json') {
  return `<div class="overflow-hidden rounded-xl border border-slate-800 bg-slate-950"><div class="flex items-center justify-between border-b border-slate-800 px-4 py-2.5"><span class="font-mono text-[10px] uppercase tracking-widest text-slate-500">${esc(language)}</span><button data-code-copy="${encodeURIComponent(code)}" class="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 transition-colors hover:text-white">${icon('Copy','h-3 w-3')} Copy</button></div><pre class="max-h-96 overflow-auto p-4 font-mono text-[11px] leading-5 text-slate-300"><code>${esc(code)}</code></pre></div>`;
}

/* =========================================================
   TRY PANEL
   ========================================================= */

function tryPanel(api) {
  const inputs = api.parameters
    .map(
      (p) =>
        `<label class="block"><span class="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">${esc(p.name)} ${p.required ? '<span class="text-red-500">*</span>' : ''}</span><input data-param="${esc(p.name)}" placeholder="${esc(p.example || '')}" class="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-cyan-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-cyan-700"></label>`
    )
    .join('');

  const initialUrl =
    `${window.location.origin}${api.endpoint}`;

  return `<div class="mt-8 rounded-2xl border border-cyan-200 bg-cyan-50/50 p-5 dark:border-cyan-900/60 dark:bg-cyan-950/20"><div class="mb-4 flex items-center gap-2">${icon('Play','h-4 w-4 text-cyan-600 dark:text-cyan-400')}<h3 class="text-sm font-bold text-slate-900 dark:text-white">Try this API</h3></div><div class="space-y-3">${inputs}</div><div class="mt-4 flex flex-col gap-2 sm:flex-row"><button id="send-request" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-cyan-600 py-2.5 text-xs font-bold text-white transition-colors hover:bg-cyan-700">${icon('Play','h-3.5 w-3.5')}<span>Send request</span></button><button id="copy-url" class="flex items-center justify-center gap-2 rounded-lg border border-cyan-200 bg-white px-4 py-2.5 text-xs font-semibold text-cyan-700 dark:border-cyan-900 dark:bg-slate-900 dark:text-cyan-400">${icon('Copy','h-3.5 w-3.5')} Copy URL</button></div><div id="try-url" class="mt-3 break-all rounded-lg bg-slate-950 px-3 py-2.5 font-mono text-[10px] leading-5 text-slate-400">${esc(api.method)} ${esc(initialUrl)}</div><div id="try-response" class="mt-3 hidden"></div></div>`;
}

/* =========================================================
   DOCS
   ========================================================= */

export function renderDocs(path) {
  const selectedSlug = path.startsWith('/docs/')
    ? path.split('/')[2]?.split('?')[0]
    : undefined;

  const selected = selectedSlug
    ? getApiBySlug(selectedSlug)
    : undefined;

  const categories = getCategories();

  return `<div class="flex min-h-[calc(100vh-72px)]"><aside id="docs-sidebar" class="fixed inset-y-0 left-0 z-30 mt-[72px] w-72 shrink-0 -translate-x-full border-r border-slate-200 bg-white transition-transform dark:border-slate-800 dark:bg-slate-950 lg:sticky lg:top-[72px] lg:mt-0 lg:block lg:h-[calc(100vh-72px)] lg:translate-x-0"><div class="flex h-full flex-col"><div class="flex items-center justify-between border-b border-slate-100 px-6 py-5 dark:border-slate-800 lg:block"><div class="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">${icon('BookOpen','h-4 w-4 text-cyan-500')} API Reference</div><button id="close-sidebar" class="text-slate-400 lg:hidden">${icon('X','h-5 w-5')}</button><div class="relative">${icon('Search','h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400')}<input id="docs-search" placeholder="Search endpoints" class="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs outline-none focus:border-cyan-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"></div></div><nav id="docs-nav" class="flex-1 overflow-auto px-3 py-4">${categories.map((cat) => `<div class="mb-4" data-category="${esc(cat)}"><button data-category-toggle class="mb-1 flex w-full items-center justify-between px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400"><span>${esc(cat)}</span>${icon('ChevronDown','h-3 w-3')}</button><div data-category-items>${apiDefinitions.filter((a) => a.category === cat).map((api) => docNavItem(api, selected)).join('')}</div></div>`).join('')}</nav><div class="border-t border-slate-100 p-4 dark:border-slate-800"><div class="rounded-xl bg-slate-50 p-3 dark:bg-slate-900"><div class="flex items-center gap-2"><span class="h-2 w-2 rounded-full bg-emerald-500"></span><span class="text-xs font-semibold text-slate-700 dark:text-slate-300">All systems operational</span></div><div class="mt-2 text-[10px] text-slate-400">Last checked just now</div></div></div></div></aside><button id="open-sidebar" class="fixed bottom-5 left-5 z-20 flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white shadow-xl lg:hidden dark:bg-white dark:text-slate-950">${icon('Menu','h-4 w-4')} API menu</button><main class="min-w-0 flex-1 px-6 py-12 sm:px-8 lg:px-14 lg:py-16">${selected ? renderApiDetail(selected) : renderDocsIndex()}</main></div>`;
}

function docNavItem(api, selected) {
  const active =
    selected?.slug === api.slug ||
    (!selected && api === apiDefinitions[0]);

  return `<button data-nav="/docs/${encodeURIComponent(api.slug)}" data-doc-api="${esc(api.slug)}" class="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${active ? 'bg-cyan-50 font-semibold text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-400' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white'}">${icon(api.icon,'h-4 w-4')}<span class="flex-1 truncate">${esc(api.name)}</span><span class="text-[9px] font-bold ${api.method === 'GET' ? 'text-emerald-500' : 'text-amber-500'}">${esc(api.method)}</span></button>`;
}

function renderDocsIndex() {
  return `<div class="max-w-3xl"><div class="mb-10"><div class="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">${icon('BookOpen','h-3.5 w-3.5')} Documentation</div><h1 class="text-4xl font-bold tracking-[-0.05em] text-slate-950 sm:text-5xl dark:text-white">API Reference</h1><p class="mt-4 max-w-xl text-[15px] leading-7 text-slate-500 dark:text-slate-400">Everything you need to integrate SamApi into your project. Pick an endpoint from the menu to get started.</p></div><div id="docs-cards" class="grid gap-4 sm:grid-cols-2">${apiDefinitions.map((api) => `<button data-nav="/docs/${encodeURIComponent(api.slug)}" class="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-700"><span class="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">${icon(api.icon,'h-4 w-4')}</span><span class="min-w-0 flex-1"><span class="block truncate text-sm font-bold text-slate-800 dark:text-white">${esc(api.name)}</span><span class="mt-1 block truncate font-mono text-[10px] text-slate-400">${esc(api.method)} ${esc(api.endpoint)}</span></span>${icon('ChevronRight','h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-1 dark:text-slate-600')}</button>`).join('')}</div></div>`;
}

/* =========================================================
   API DETAIL
   ========================================================= */

function renderApiDetail(api) {
  const params = api.parameters
    .map(
      (p) =>
        `<div class="grid gap-2 border-b border-slate-100 px-4 py-4 last:border-0 sm:grid-cols-[1fr_100px_2fr] sm:items-center dark:border-slate-800"><div class="flex items-center gap-2"><code class="font-mono text-xs font-semibold text-cyan-700 dark:text-cyan-400">${esc(p.name)}</code>${p.required ? '<span class="text-[9px] font-bold uppercase text-red-500">required</span>' : ''}</div><code class="font-mono text-[11px] text-slate-400">${esc(p.type)}</code><p class="text-xs leading-5 text-slate-500 dark:text-slate-400">${esc(p.description)}</p></div>`
    )
    .join('');

  const fields = api.responseFields
    .map(
      (f) =>
        `<div class="flex flex-col gap-1 border-b border-slate-100 px-4 py-3 last:border-0 sm:flex-row sm:items-center dark:border-slate-800"><code class="w-48 shrink-0 font-mono text-xs text-cyan-700 dark:text-cyan-400">${esc(f.name)}</code><code class="w-20 shrink-0 font-mono text-[11px] text-slate-400">${esc(f.type)}</code><span class="text-xs text-slate-500 dark:text-slate-400">${esc(f.description)}</span></div>`
    )
    .join('');

  const currentEndpoint =
    `${window.location.origin}${api.endpoint}`;

  return `<div class="max-w-3xl"><div class="mb-8 flex items-start gap-4"><div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-white">${icon(api.icon,'h-6 w-6')}</div><div><div class="mb-2 flex items-center gap-2"><span class="rounded-md bg-cyan-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400">${esc(api.category)}</span><span class="text-xs text-slate-400">Updated recently</span></div><h1 class="text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">${esc(api.name)}</h1></div></div><p class="mb-8 text-[15px] leading-7 text-slate-500 dark:text-slate-400">${esc(api.description)}</p><div class="mb-10 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900/60"><span class="rounded-md px-2 py-1 text-[10px] font-bold ${api.method === 'GET' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'}">${esc(api.method)}</span><code class="flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs text-slate-600 dark:text-slate-300">${esc(currentEndpoint)}</code><button data-copy="${esc(currentEndpoint)}" class="detail-copy text-slate-400 hover:text-slate-900 dark:hover:text-white">${icon('Copy','h-3.5 w-3.5')}</button></div><section class="mb-10"><h2 class="mb-4 text-lg font-bold tracking-[-0.02em] text-slate-950 dark:text-white">Parameters</h2><div class="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800"><div class="hidden grid-cols-[1fr_100px_2fr] border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:grid dark:border-slate-800 dark:bg-slate-900"><span>Name</span><span>Type</span><span>Description</span></div>${params}</div></section><section class="mb-10"><h2 class="mb-4 text-lg font-bold tracking-[-0.02em] text-slate-950 dark:text-white">Example request</h2>${codeBlock(getCurrentApiUrl(api.exampleRequest), api.method === 'POST' ? 'http' : 'url')}</section><section><h2 class="mb-4 text-lg font-bold tracking-[-0.02em] text-slate-950 dark:text-white">Example response</h2>${codeBlock(JSON.stringify(api.responseExample, null, 2))}<div class="mt-6 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800"><div class="border-b border-slate-200 bg-slate-50 px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:bg-slate-900">Response fields</div>${fields}</div></section>${tryPanel(api)}</div>`;
}

/* =========================================================
   BIND DOCS
   ========================================================= */

export function bindDocs(api) {
  document
    .querySelectorAll('[data-nav]')
    .forEach((el) =>
      el.addEventListener('click', () => navigate(el.dataset.nav))
    );

  document
    .getElementById('open-sidebar')
    ?.addEventListener('click', () =>
      document.getElementById('docs-sidebar').classList.add('translate-x-0')
    );

  document
    .getElementById('close-sidebar')
    ?.addEventListener('click', () =>
      document.getElementById('docs-sidebar').classList.remove('translate-x-0')
    );

  document
    .querySelectorAll('[data-category-toggle]')
    .forEach((btn) =>
      btn.addEventListener('click', () => {
        const items = btn.nextElementSibling;
        items.classList.toggle('hidden');

        btn
          .querySelector('[data-lucide="chevron-down"]')
          ?.classList.toggle('-rotate-90');
      })
    );

  document
    .getElementById('docs-search')
    ?.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();

      document.querySelectorAll('[data-doc-api]').forEach((el) =>
        el.classList.toggle(
          'hidden',
          !`${el.textContent} ${el.dataset.docApi}`
            .toLowerCase()
            .includes(q)
        )
      );

      document.querySelectorAll('[data-category]').forEach((cat) =>
        cat.classList.toggle(
          'hidden',
          !cat.querySelector('[data-doc-api]:not(.hidden)')
        )
      );
    });

  document.querySelectorAll('[data-copy]').forEach((el) =>
    el.addEventListener('click', async () => {
      await copyText(el.dataset.copy);

      const old = el.innerHTML;

      el.innerHTML = icon(
        'Check',
        'h-3.5 w-3.5 text-emerald-500'
      );

      refreshIcons();

      setTimeout(() => {
        el.innerHTML = old;
        refreshIcons();
      }, 1600);
    })
  );

  document.querySelectorAll('[data-code-copy]').forEach((el) =>
    el.addEventListener('click', async () => {
      await copyText(decodeURIComponent(el.dataset.codeCopy));

      const old = el.innerHTML;

      el.innerHTML =
        `${icon('Check','h-3 w-3 text-emerald-400')} Copied`;

      refreshIcons();

      setTimeout(() => {
        el.innerHTML = old;
        refreshIcons();
      }, 1600);
    })
  );

  if (api) {
    const buildUrl = () => {
      const query = api.parameters
        .filter(
          (p) =>
            document.querySelector(
              `[data-param="${CSS.escape(p.name)}"]`
            )?.value
        )
        .map(
          (p) =>
            `${p.name}=${encodeURIComponent(
              document.querySelector(
                `[data-param="${CSS.escape(p.name)}"]`
              ).value
            )}`
        )
        .join('&');

      return `${window.location.origin}${api.endpoint}${
        query ? '?' + query : ''
      }`;
    };

    document
      .querySelectorAll('[data-param]')
      .forEach((el) =>
        el.addEventListener('input', () => {
          document.getElementById('try-url').textContent =
            `${api.method} ${buildUrl()}`;
        })
      );

    document
      .getElementById('copy-url')
      ?.addEventListener('click', async () => {
        await copyText(buildUrl());
      });

    document
      .getElementById('send-request')
      ?.addEventListener('click', async () => {
        const btn = document.getElementById('send-request');
        const box = document.getElementById('try-response');

        const requestUrl = buildUrl();

        btn.disabled = true;

        btn.innerHTML =
          `${icon('LoaderCircle','h-3.5 w-3.5 animate-spin')}<span>Sending...</span>`;

        refreshIcons();

        box.classList.remove('hidden');
        box.innerHTML = codeBlock('Loading...');

        try {
          const response = await fetch(requestUrl, {
            method: api.method,
            headers: {
              Accept: 'application/json'
            }
          });

          const contentType =
            response.headers.get('content-type') || '';

          if (contentType.startsWith('image/')) {
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);

            box.innerHTML = `
              <div class="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                <div class="mb-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Response • ${contentType}
                </div>

                <div class="flex justify-center rounded-lg bg-white p-4">
                  <img
                    src="${imageUrl}"
                    alt="API Response"
                    class="max-w-full rounded-lg"
                    style="max-height:500px"
                  />
                </div>

                <a
                  href="${imageUrl}"
                  download="qrcode.png"
                  class="mt-4 flex items-center justify-center rounded-lg bg-cyan-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-cyan-700"
                >
                  Download Image
                </a>
              </div>
            `;
          } else {
            const result = contentType.includes('application/json')
              ? await response.json()
              : await response.text();

            const output =
              typeof result === 'string'
                ? result
                : JSON.stringify(result, null, 2);

            box.innerHTML = codeBlock(output);

            box
              .querySelector('[data-code-copy]')
              ?.addEventListener(
                'click',
                async () => {
                  await copyText(output);
                }
              );
          }

          btn.innerHTML =
            `${icon(response.ok ? 'Check' : 'AlertCircle','h-3.5 w-3.5')}<span>${response.ok ? 'Request sent' : 'Request failed'}</span>`;

          refreshIcons();
        } catch (error) {
          const output = JSON.stringify(
            {
              status: false,
              message:
                error?.message || 'Request failed'
            },
            null,
            2
          );

          box.innerHTML = codeBlock(output);

          box
            .querySelector('[data-code-copy]')
            ?.addEventListener(
              'click',
              async () => {
                await copyText(output);
              }
            );

          btn.innerHTML =
            `${icon('AlertCircle','h-3.5 w-3.5')}<span>Request failed</span>`;

          refreshIcons();
        } finally {
          setTimeout(() => {
            btn.disabled = false;

            btn.innerHTML =
              `${icon('Play','h-3.5 w-3.5')}<span>Send request</span>`;

            refreshIcons();
          }, 2500);
        }
      });
  }
}

/* =========================================================
   ERROR
   ========================================================= */

export function renderError(type) {
  if (type === '500') {
    return `<main class="flex min-h-[calc(100vh-72px)] items-center justify-center px-6"><div class="text-center"><div class="relative mx-auto mb-8 flex h-28 w-28 items-center justify-center"><div class="absolute inset-0 rounded-full bg-red-100 dark:bg-red-950/40"></div><div class="relative flex h-20 w-20 items-center justify-center rounded-full border border-red-200 bg-white text-red-500 shadow-xl dark:border-red-900 dark:bg-slate-900">${icon('ServerCrash','h-8 w-8')}</div></div><p class="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red-500">Error 500</p><h1 class="mt-3 text-4xl font-bold tracking-[-0.05em] text-slate-950 sm:text-5xl dark:text-white">Something went wrong</h1><p class="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">Our servers ran into an unexpected issue. Your request was not completed, but our team has been notified.</p><div class="mt-8 flex justify-center gap-3"><button id="retry" class="flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950">${icon('RefreshCw','h-4 w-4')} Try again</button><button data-nav="/" class="flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">${icon('ArrowLeft','h-4 w-4')} Go back</button></div><div class="mt-10 flex items-center justify-center gap-2 text-xs text-slate-400">${icon('AlertTriangle','h-3.5 w-3.5')} API status: <span class="font-semibold text-emerald-500">Operational</span></div></div></main>`;
  }

  return `<main class="flex min-h-[calc(100vh-72px)] items-center justify-center px-6"><div class="text-center"><div class="relative mx-auto mb-8 flex h-28 w-28 items-center justify-center"><div class="absolute inset-0 animate-pulse rounded-full bg-cyan-100 dark:bg-cyan-950/50"></div><div class="relative flex h-20 w-20 items-center justify-center rounded-full border border-cyan-200 bg-white text-cyan-500 shadow-xl dark:border-cyan-900 dark:bg-slate-900">${icon('WifiOff','h-8 w-8')}</div></div><p class="font-mono text-xs font-bold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">Error 404</p><h1 class="mt-3 text-4xl font-bold tracking-[-0.05em] text-slate-950 sm:text-5xl dark:text-white">Endpoint not found</h1><p class="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">The endpoint you are looking for doesn't exist or may have been moved. Check the URL and try again.</p><div class="mt-8 flex justify-center gap-3"><button data-nav="/" class="flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950">${icon('Home','h-4 w-4')} Homepage</button><button data-nav="/docs" class="flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">${icon('BookOpen','h-4 w-4')} Documentation</button></div></div></main>`;
}