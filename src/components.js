import { toggleTheme, getTheme } from './theme.js';
import { apiDefinitions } from './apis/registry.js';
import { BASE_URL, esc, icon } from './utils.js';

let firstNav = true;

// close the APIs dropdown when clicking anywhere outside it (registered once)
document.addEventListener('click', (e) => {
  if (e.target.closest?.('#api-menu-wrap')) return;
  document.getElementById('api-menu')?.removeAttribute('data-open');
  const btn = document.getElementById('api-menu-btn');
  btn?.setAttribute('aria-expanded', 'false');
  btn?.querySelector('.chev')?.style.setProperty('transform', '');
});

export function renderNavbar(path) {
  const isDocs = path === '/docs' || path.startsWith('/docs/');
  const animate = firstNav; firstNav = false;
  const themeIcon = getTheme() === 'dark' ? 'Sun' : 'Moon';

  const dd = 'flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-muted transition-colors hover:bg-fg/5 hover:text-fg';
  return `<header class="fixed inset-x-0 top-0 z-50">
    <div class="nav-bar">
      <div class="mx-auto flex h-[var(--nav-h)] max-w-7xl items-center justify-between gap-3 px-4 sm:px-8">
        <div class="flex items-center gap-8">
          <button data-nav="/" class="flex items-center gap-2.5" aria-label="SamApi home">
            <span class="logo-mark">${icon('Zap', 'h-4 w-4 fill-current')}</span>
            <span class="font-display text-[22px] leading-none">SamApi</span>
          </button>
          <nav class="hidden items-center gap-1 md:flex" aria-label="Primary">
            <button data-nav="/" class="navlink ${path === '/' ? 'is-active' : ''}">Home</button>
            <div class="relative" id="api-menu-wrap">
              <button id="api-menu-btn" class="navlink flex items-center gap-1 ${isDocs ? 'is-active' : ''}" aria-haspopup="true" aria-expanded="false">APIs ${icon('ChevronDown', 'chev h-3.5 w-3.5')}</button>
              <div id="api-menu" class="menu-panel absolute left-0 top-11 w-52 rounded-xl border hair bg-surface p-1.5 shadow-xl shadow-black/10">
                <button data-nav="/docs" class="${dd}">${icon('BookOpen', 'h-4 w-4 text-accent')} All APIs</button>
                <button data-nav="/docs/instagram" class="${dd}">${icon('Activity', 'h-4 w-4 text-accent')} Popular APIs</button>
              </div>
            </div>
            <button data-nav="/docs" class="navlink ${isDocs ? 'is-active' : ''}">Documentation</button>
          </nav>
        </div>

        <div class="flex items-center gap-1">
          <div class="mr-3 hidden items-center gap-2 lg:flex"><span class="pulse-dot"></span><span class="text-xs font-semibold text-muted">API online</span></div>
          <button id="theme-btn" class="iconbtn" aria-label="Toggle color theme">${icon(themeIcon, 'h-[18px] w-[18px]')}</button>
          <button data-nav="/docs" class="btn btn-primary btn-sm ml-1 hidden md:inline-flex">Get started</button>
          <button id="mobile-menu-btn" class="iconbtn md:hidden" aria-label="Toggle menu" aria-expanded="false">${icon('Menu', 'h-5 w-5')}</button>
        </div>
      </div>
    </div>

    <div id="mobile-menu" class="md:hidden" aria-hidden="true">
      <div class="mx-auto flex max-w-md flex-col">
        ${[['/', 'Home'], ['/docs', 'Documentation'], ['/docs', 'All APIs']].map(([to, label], i) => `<button data-nav="${to}" style="--i:${i}" class="m-item font-display hair border-b py-5 text-left text-3xl">${label}</button>`).join('')}
        <div style="--i:3" class="m-item mt-8 flex items-center justify-between">
          <div class="flex items-center gap-2"><span class="pulse-dot"></span><span class="text-xs font-semibold text-muted">API online</span></div>
          <button id="mobile-theme-btn" class="flex items-center gap-2 text-sm text-muted">${icon(themeIcon, 'h-4 w-4')} Theme</button>
        </div>
        <button data-nav="/docs" style="--i:4" class="m-item btn btn-primary mt-8 w-full">Get started</button>
      </div>
    </div>
  </header>`;
}

export function bindNavbar() {
  const rerender = () => { toggleTheme(); window.__render({ silent: true }); };
  document.getElementById('theme-btn')?.addEventListener('click', rerender);
  document.getElementById('mobile-theme-btn')?.addEventListener('click', rerender);

  const menu = document.getElementById('api-menu');
  const menuBtn = document.getElementById('api-menu-btn');
  const setMenu = (open) => {
    menu?.toggleAttribute('data-open', open);
    menuBtn?.setAttribute('aria-expanded', String(open));
    menuBtn?.querySelector('.chev')?.style.setProperty('transform', open ? 'rotate(180deg)' : '');
  };
  menuBtn?.addEventListener('click', (e) => { e.stopPropagation(); setMenu(!menu.hasAttribute('data-open')); });
  menu?.addEventListener('click', () => setMenu(false));

  const mm = document.getElementById('mobile-menu');
  const mmBtn = document.getElementById('mobile-menu-btn');
  mmBtn?.addEventListener('click', () => {
    const open = !mm.hasAttribute('data-open');
    mm.toggleAttribute('data-open', open);
    mm.setAttribute('aria-hidden', String(!open));
    mmBtn.setAttribute('aria-expanded', String(open));
    document.documentElement.classList.toggle('menu-open', open);
    mmBtn.innerHTML = icon(open ? 'X' : 'Menu', 'h-5 w-5');
    window.lucide?.createIcons({ attrs: { 'stroke-width': 2 } });
  });
}

export function renderFooter() {
  const col = (title, items) => `<div><h4 class="mb-4 text-sm font-bold">${title}</h4><div class="flex flex-col gap-3 text-sm text-muted">${items.map(([label, to]) => `<button ${to ? `data-nav="${to}"` : ''} class="w-fit text-left transition-colors duration-200 hover:text-accent">${label}</button>`).join('')}</div></div>`;
  return `<footer class="mt-16 border-t hair">
    <div class="mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-8">
      <div class="flex flex-col justify-between gap-12 md:flex-row">
        <div class="max-w-xs">
          <button data-nav="/" class="mb-4 flex items-center gap-2.5"><span class="logo-mark">${icon('Zap', 'h-4 w-4 fill-current')}</span><span class="font-display text-2xl">SamApi</span></button>
          <p class="text-sm leading-7 text-muted">Simple, powerful APIs for developers who build the future.</p>
          <div class="mt-5 flex items-center gap-1">${['Github', 'Twitter', 'Linkedin', 'Mail'].map((x) => `<button class="iconbtn" aria-label="${x}">${icon(x, 'h-4 w-4')}</button>`).join('')}</div>
        </div>
        <div class="grid grid-cols-2 gap-x-14 gap-y-10 sm:grid-cols-3">
          ${col('Product', [['Documentation', '/docs'], ['Changelog'], ['Status']])}
          ${col('Resources', [['Examples'], ['SDKs'], ['Community']])}
          ${col('Company', [['About'], ['Contact'], ['Privacy']])}
        </div>
      </div>
      <div class="mt-12 flex flex-col justify-between gap-2 border-t hair pt-6 text-xs text-dim sm:flex-row"><span>© ${new Date().getFullYear()} SamApi. Built for developers.</span><span>Made with care for the developer community.</span></div>
    </div>
  </footer>`;
}

export function bindFooter() { /* navigation handled by the delegated listener in app.js */ }

export function apiIcon(api, size = 'md') {
  return icon(api.icon, size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5');
}

/* Satu endpoint = satu baris direktori: mudah dipindai untuk puluhan API. */
export function renderApiCard(api, i = 0) {
  const get = api.method === 'GET';
  const docs = `/docs/${encodeURIComponent(api.slug)}`;
  return `<article class="card api-row group sm:flex-row sm:items-center">
    <div class="flex min-w-0 flex-1 items-start gap-3.5">
      <div class="iconbox mt-0.5 h-10 w-10 shrink-0">${apiIcon(api)}</div>
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-2"><h3 class="truncate text-[1.05rem] leading-tight">${esc(api.name)}</h3><span class="badge badge-cat shrink-0">${esc(api.category)}</span></div>
        <p class="mt-1 line-clamp-2 text-[13px] leading-5 text-muted">${esc(api.description)}</p>
        <div class="mt-2 flex min-w-0 items-center gap-2"><span class="badge ${get ? 'badge-get' : 'badge-post'}">${esc(api.method)}</span><code class="ep font-mono text-[11px] text-dim">${esc(api.endpoint)}</code></div>
      </div>
    </div>
    <div class="flex shrink-0 items-center gap-1.5">
      <button data-copy="${esc(BASE_URL + api.endpoint)}" class="iconbtn !h-10 !w-10 shrink-0" aria-label="Copy endpoint">${icon('Copy', 'h-4 w-4')}</button>
      <button data-nav="${docs}?try=true" class="iconbtn !h-10 !w-10 shrink-0" aria-label="Try ${esc(api.name)}">${icon('Terminal', 'h-4 w-4')}</button>
      <button data-nav="${docs}" class="btn btn-ghost btn-sm flex-1 sm:flex-none">Docs ${icon('ArrowRight', 'arr h-3.5 w-3.5')}</button>
    </div>
  </article>`;
}

export function bindApiCards() { /* delegated in app.js */ }

export { apiDefinitions };
