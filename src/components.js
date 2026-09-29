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

  return `<header class="fixed inset-x-0 top-0 z-50 ${animate ? 'nav-in' : ''}">
    <div class="nav-shell mx-auto max-w-7xl px-4 sm:px-8">
      <div class="nav-bar flex h-[58px] items-center justify-between gap-3 rounded-full pl-4 pr-2 sm:pl-5">
        <button data-nav="/" class="group flex items-center gap-3" aria-label="SamApi home">
          <span class="grid h-8 w-8 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold transition-transform duration-700 group-hover:rotate-[360deg]">${icon('Zap', 'h-4 w-4 fill-current')}</span>
          <span class="font-display text-[22px] leading-none tracking-wide">Sam<span class="text-gold">Api</span></span>
        </button>

        <nav class="hidden items-center md:flex" aria-label="Primary">
          <button data-nav="/" class="navlink ${path === '/' ? 'is-active' : ''}">Home</button>
          <div class="relative" id="api-menu-wrap">
            <button id="api-menu-btn" class="navlink flex items-center gap-1 ${isDocs ? 'is-active' : ''}" aria-haspopup="true" aria-expanded="false">APIs ${icon('ChevronDown', 'chev h-3.5 w-3.5')}</button>
            <div id="api-menu" class="menu-panel glass absolute left-0 top-12 w-56 rounded-2xl p-1.5 shadow-2xl shadow-black/30">
              <button data-nav="/docs" class="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm text-muted transition-colors hover:bg-gold/10 hover:text-fg">${icon('BookOpen', 'h-4 w-4 text-gold')} All APIs</button>
              <button data-nav="/docs/instagram" class="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm text-muted transition-colors hover:bg-gold/10 hover:text-fg">${icon('Activity', 'h-4 w-4 text-gold')} Popular APIs</button>
            </div>
          </div>
          <button data-nav="/docs" class="navlink ${isDocs ? 'is-active' : ''}">Documentation</button>
        </nav>

        <div class="flex items-center gap-1.5">
          <div class="mr-1 hidden items-center gap-2 rounded-full border border-ok/25 bg-ok/10 px-3 py-1.5 lg:flex"><span class="relative flex h-2 w-2"><span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-70"></span><span class="relative inline-flex h-2 w-2 rounded-full bg-ok"></span></span><span class="text-xs font-bold text-ok">API Online</span></div>
          <button id="theme-btn" class="iconbtn" aria-label="Toggle color theme">${icon(themeIcon, 'h-[17px] w-[17px]')}</button>
          <button data-nav="/docs" data-magnetic class="btn btn-gold btn-sm hidden md:inline-flex">Get started ${icon('ArrowRight', 'arr h-3.5 w-3.5')}</button>
          <button id="mobile-menu-btn" class="iconbtn md:hidden" aria-label="Toggle menu" aria-expanded="false">${icon('Menu', 'h-5 w-5')}</button>
        </div>
      </div>
    </div>

    <div id="mobile-menu" class="md:hidden" aria-hidden="true">
      <div class="mx-auto flex max-w-md flex-col">
        ${[['/', 'Home'], ['/docs', 'Documentation'], ['/docs', 'All APIs']].map(([to, label], i) => `<button data-nav="${to}" style="--i:${i}" class="m-item font-display hair border-b py-5 text-left text-4xl">${label}</button>`).join('')}
        <div style="--i:3" class="m-item mt-8 flex items-center justify-between">
          <div class="flex items-center gap-2"><span class="h-2 w-2 rounded-full bg-ok"></span><span class="text-xs font-bold text-ok">API Online</span></div>
          <button id="mobile-theme-btn" class="flex items-center gap-2 text-sm text-muted">${icon(themeIcon, 'h-4 w-4')} Theme</button>
        </div>
        <button data-nav="/docs" style="--i:4" class="m-item btn btn-gold mt-8 w-full">Get started ${icon('ArrowRight', 'arr h-4 w-4')}</button>
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
  const col = (title, items) => `<div><h4 class="mb-5 text-sm font-bold">${title}</h4><div class="flex flex-col gap-3 text-sm text-muted">${items.map(([label, to]) => `<button ${to ? `data-nav="${to}"` : ''} class="w-fit text-left transition-all duration-300 hover:translate-x-1 hover:text-gold">${label}</button>`).join('')}</div></div>`;
  return `<footer class="relative mt-10 overflow-hidden border-t hair">
    <div class="rule absolute inset-x-0 top-0"></div>
    <div class="mx-auto max-w-7xl px-6 pb-10 pt-16 sm:px-8">
      <div class="flex flex-col justify-between gap-12 md:flex-row">
        <div class="max-w-sm">
          <button data-nav="/" class="mb-5 flex items-center gap-3"><span class="grid h-9 w-9 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold">${icon('Zap', 'h-4 w-4 fill-current')}</span><span class="font-display text-2xl">Sam<span class="text-gold">Api</span></span></button>
          <p class="text-sm leading-7 text-muted">Simple, powerful APIs for developers who build the future.</p>
          <div class="mt-6 flex items-center gap-2">${['Github', 'Twitter', 'Linkedin', 'Mail'].map((x) => `<button class="iconbtn border-fg/10" aria-label="${x}">${icon(x, 'h-4 w-4')}</button>`).join('')}</div>
        </div>
        <div class="grid grid-cols-2 gap-x-14 gap-y-10 sm:grid-cols-3">
          ${col('Product', [['Documentation', '/docs'], ['Changelog'], ['Status']])}
          ${col('Resources', [['Examples'], ['SDKs'], ['Community']])}
          ${col('Company', [['About'], ['Contact'], ['Privacy']])}
        </div>
      </div>
      <div class="mt-14 flex flex-col justify-between gap-3 border-t hair pt-6 text-xs text-dim sm:flex-row"><span>© ${new Date().getFullYear()} SamApi. Built for developers.</span><span>Made with care for the developer community.</span></div>
    </div>
    <div class="font-display pointer-events-none select-none whitespace-nowrap text-center text-[clamp(5rem,22vw,20rem)] leading-[0.8] text-fg/[0.035]" aria-hidden="true">SamApi</div>
  </footer>`;
}

export function bindFooter() { /* navigation handled by the delegated listener in app.js */ }

export function apiIcon(api, size = 'md') {
  return icon(api.icon, size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5');
}

export function renderApiCard(api, i = 0) {
  const get = api.method === 'GET';
  return `<div class="reveal" style="--d:${(i % 3) * 110}ms"><article class="card flex h-full flex-col p-5 sm:p-6">
    <div class="mb-6 flex items-start justify-between"><div class="iconbox h-12 w-12">${apiIcon(api)}</div><span class="badge badge-cat">${esc(api.category)}</span></div>
    <h3 class="mb-2 text-[17px] font-extrabold tracking-[-0.02em]">${esc(api.name)}</h3>
    <p class="mb-6 min-h-[48px] text-sm leading-6 text-muted">${esc(api.description)}</p>
    <div class="mt-auto flex items-center justify-between gap-2 border-t hair pt-4">
      <div class="flex min-w-0 items-center gap-2"><span class="badge ${get ? 'badge-get' : 'badge-post'}">${esc(api.method)}</span><code class="truncate font-mono text-[11px] text-dim">${esc(api.endpoint)}</code></div>
      <button data-copy="${esc(BASE_URL + api.endpoint)}" class="iconbtn !h-8 !w-8 shrink-0" aria-label="Copy endpoint">${icon('Copy', 'h-3.5 w-3.5')}</button>
    </div>
    <div class="mt-4 flex items-center gap-2.5">
      <button data-nav="/docs/${encodeURIComponent(api.slug)}" class="btn btn-gold btn-sm flex-1">View docs ${icon('ArrowUpRight', 'arr h-3.5 w-3.5')}</button>
      <button data-nav="/docs/${encodeURIComponent(api.slug)}?try=true" class="btn btn-ghost btn-sm !px-3.5" aria-label="Try API">${icon('Terminal', 'h-3.5 w-3.5')}</button>
    </div>
  </article></div>`;
}

export function bindApiCards() { /* delegated in app.js */ }

export { apiDefinitions };
