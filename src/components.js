import { toggleTheme, getTheme } from './theme.js';
import { apiDefinitions } from './apis/registry.js';
import { BASE_URL, esc, icon } from './utils.js';
import { creatorLinks, creatorName, brandIcon } from './creator.js';

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

  const dd = 'flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-muted transition-colors hover:bg-gold/10 hover:text-fg';
  return `<header class="fixed inset-x-0 top-0 z-50">
    <div class="nav-bar">
      <div class="mx-auto flex h-[var(--nav-h)] max-w-7xl items-center justify-between gap-3 px-4 sm:px-8">
        <button data-nav="/" class="flex items-center gap-2.5" aria-label="SamApi home">
          <span class="logo-mark">${icon('Zap', 'h-3.5 w-3.5 fill-current')}</span>
          <span class="font-display text-[21px] leading-none">Sam<span class="text-gold">Api</span></span>
        </button>

        <nav class="hidden items-center md:flex" aria-label="Primary">
          <button data-nav="/" class="navlink ${path === '/' ? 'is-active' : ''}">Home</button>
          <div class="relative" id="api-menu-wrap">
            <button id="api-menu-btn" class="navlink flex items-center gap-1 ${isDocs ? 'is-active' : ''}" aria-haspopup="true" aria-expanded="false">APIs ${icon('ChevronDown', 'chev h-3.5 w-3.5')}</button>
            <div id="api-menu" class="menu-panel absolute left-0 top-12 w-56 p-1.5">
              <button data-nav="/docs" class="${dd}">${icon('BookOpen', 'h-4 w-4 text-gold')} All APIs</button>
              <button data-nav="/docs/instagram" class="${dd}">${icon('Activity', 'h-4 w-4 text-gold')} Popular APIs</button>
            </div>
          </div>
          <button data-nav="/docs" class="navlink ${isDocs ? 'is-active' : ''}">Documentation</button>
          <button data-nav="/contact" class="navlink ${path === '/contact' ? 'is-active' : ''}">Contact</button>
        </nav>

        <div class="flex items-center gap-1">
          <div class="mr-3 hidden items-center gap-2 lg:flex"><span class="h-1.5 w-1.5 rounded-full bg-ok"></span><span class="text-xs font-semibold text-muted">API online</span></div>
          <button id="theme-btn" class="iconbtn" aria-label="Toggle color theme">${icon(themeIcon, 'h-[17px] w-[17px]')}</button>
          <button data-nav="/docs" class="btn btn-gold btn-sm ml-1 hidden md:inline-flex">Get started</button>
          <button id="mobile-menu-btn" class="iconbtn mobile-menu-trigger md:hidden" aria-label="Buka menu navigasi" title="Menu" aria-expanded="false">${icon('Ellipsis', 'h-5 w-5')}</button>
        </div>
      </div>
    </div>

    <div id="mobile-menu" class="md:hidden" aria-hidden="true">
      <button id="mobile-menu-backdrop" class="mobile-menu-backdrop" aria-label="Tutup menu"></button>
      <section class="mobile-menu-sheet" role="dialog" aria-modal="true" aria-label="Menu navigasi">
        <div class="mobile-menu-heading">
          <div class="flex items-center gap-3">
            <span class="logo-mark">${icon('Zap', 'h-3.5 w-3.5 fill-current')}</span>
            <div>
              <p class="font-display text-xl leading-tight">Menu <span class="text-gold">SamApi</span></p>
              <p class="mt-1 text-xs text-muted">Jelajahi layanan API</p>
            </div>
          </div>
          <button id="mobile-menu-close" class="iconbtn mobile-menu-close" aria-label="Tutup menu">${icon('X', 'h-4 w-4')}</button>
        </div>
        <div class="mobile-menu-links">
          ${[
            ['/', 'House', 'Home', 'Kembali ke halaman utama'],
            ['/docs', 'BookOpen', 'Dokumentasi', 'Panduan dan daftar endpoint API'],
            ['/docs', 'Layers3', 'Semua API', 'Jelajahi koleksi endpoint'],
            ['/contact', 'MessageCircle', 'Kontak', 'Hubungi pengembang']
          ].map(([to, glyph, label, desc], i) => `<button data-nav="${to}" style="--i:${i}" class="m-item mobile-menu-link"><span class="mobile-menu-link-icon">${icon(glyph, 'h-5 w-5')}</span><span class="mobile-menu-link-copy"><span class="mobile-menu-link-title">${label}</span><span class="mobile-menu-link-desc">${desc}</span></span>${icon('ArrowUpRight', 'mobile-menu-arrow h-4 w-4')}</button>`).join('')}
        </div>
        <div class="mobile-menu-bottom">
          <div class="mobile-menu-status"><span class="live-dot"></span><span><strong>API online</strong><small>Semua sistem siap digunakan</small></span></div>
          <button id="mobile-theme-btn" class="mobile-theme-action">${icon(themeIcon, 'h-4 w-4')}<span>Ganti tema</span></button>
        </div>
        <button data-nav="/docs" style="--i:5" class="m-item btn btn-gold mobile-menu-cta w-full">${icon('Rocket', 'h-4 w-4')} Mulai sekarang</button>
      </section>
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
  const closeMobileMenu = () => {
    if (!mm?.hasAttribute('data-open')) return;
    mm.removeAttribute('data-open');
    mm.setAttribute('aria-hidden', 'true');
    mmBtn?.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('menu-open');
    mmBtn.innerHTML = icon('Ellipsis', 'h-5 w-5');
    window.lucide?.createIcons({ attrs: { 'stroke-width': 2 } });
  };
  document.getElementById('mobile-menu-close')?.addEventListener('click', closeMobileMenu);
  document.getElementById('mobile-menu-backdrop')?.addEventListener('click', closeMobileMenu);
  mm?.querySelectorAll('[data-nav]').forEach((item) => item.addEventListener('click', closeMobileMenu));

  mmBtn?.addEventListener('click', () => {
    const open = !mm.hasAttribute('data-open');
    mm.toggleAttribute('data-open', open);
    mm.setAttribute('aria-hidden', String(!open));
    mmBtn.setAttribute('aria-expanded', String(open));
    document.documentElement.classList.toggle('menu-open', open);
    mmBtn.innerHTML = icon(open ? 'X' : 'Ellipsis', 'h-5 w-5');
    window.lucide?.createIcons({ attrs: { 'stroke-width': 2 } });
  });
}

export function renderFooter() {
  const col = (title, items) => `<div><h4 class="mb-4 text-sm font-bold">${title}</h4><div class="flex flex-col gap-3 text-sm text-muted">${items.map(([label, to]) => `<button ${to ? `data-nav="${to}"` : ''} class="w-fit text-left transition-colors duration-300 hover:text-gold">${label}</button>`).join('')}</div></div>`;
  return `<footer>
    <div class="mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-8">
      <div class="flex flex-col justify-between gap-12 md:flex-row">
        <div class="max-w-xs">
          <button data-nav="/" class="mb-4 flex items-center gap-2.5"><span class="logo-mark">${icon('Zap', 'h-3.5 w-3.5 fill-current')}</span><span class="font-display text-2xl">Sam<span class="text-gold">Api</span></span></button>
          <p class="text-sm leading-7 text-muted">Simple, powerful APIs for developers who build the future.</p>
          <div class="mt-5 flex items-center gap-1">${creatorLinks().map((l) => `<a href="${esc(l.href)}" target="_blank" rel="noopener noreferrer" class="iconbtn" aria-label="${esc(l.label)}" title="${esc(l.label)}">${brandIcon(l.key, 'h-4 w-4')}</a>`).join('')}</div>
        </div>
        <div class="grid grid-cols-2 gap-x-14 gap-y-10 sm:grid-cols-3">
          ${col('Product', [['Documentation', '/docs'], ['Changelog'], ['Status']])}
          ${col('Resources', [['Examples'], ['SDKs'], ['Community']])}
          ${col('Company', [['About'], ['Contact', '/contact'], ['Privacy']])}
        </div>
      </div>
      <div class="mt-12 flex flex-col justify-between gap-2 border-t hair pt-6 text-xs text-dim sm:flex-row"><span>© ${new Date().getFullYear()} SamApi. Built by <button data-nav="/contact" class="font-bold text-fg transition-colors hover:text-gold">${creatorName()}</button>.</span><span>Made with care for the developer community.</span></div>
    </div>
  </footer>`;
}

export function bindFooter() { /* navigation handled by the delegated listener in app.js */ }

export function apiIcon(api, size = 'md') {
  return icon(api.icon, size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5');
}

export function renderApiCard(api, i = 0) {
  const get = api.method === 'GET';
  return `<div class="reveal" style="--d:${(i % 3) * 70}ms"><article class="card flex h-full flex-col p-5 sm:p-6">
    <div class="mb-5 flex items-center justify-between gap-3"><div class="iconbox h-10 w-10">${apiIcon(api)}</div><span class="category-pill"><span class="category-dot"></span>${esc(api.category)}</span></div>
    <h3 class="mb-1.5 text-base font-bold tracking-[-0.01em]">${esc(api.name)}</h3>
    <p class="mb-6 min-h-[48px] text-sm leading-6 text-muted">${esc(api.description)}</p>
    <div class="mt-auto flex items-center justify-between gap-2 border-t hair pt-4">
      <div class="flex min-w-0 items-center gap-2"><span class="badge ${get ? 'badge-get' : 'badge-post'}">${esc(api.method)}</span><code class="truncate font-mono text-[11px] text-dim">${esc(api.endpoint)}</code></div>
      <button data-copy="${esc(BASE_URL + api.endpoint)}" class="iconbtn !h-8 !w-8 shrink-0" aria-label="Copy endpoint">${icon('Copy', 'h-3.5 w-3.5')}</button>
    </div>
    <div class="mt-4 flex items-center gap-2">
      <button data-nav="/docs/${encodeURIComponent(api.slug)}" class="btn btn-gold btn-sm flex-1">View docs</button>
      <button data-nav="/docs/${encodeURIComponent(api.slug)}?try=true" class="btn btn-ghost btn-sm !px-3.5" aria-label="Try API">${icon('Terminal', 'h-3.5 w-3.5')}</button>
    </div>
  </article></div>`;
}

export function bindApiCards() { /* delegated in app.js */ }

export { apiDefinitions };
