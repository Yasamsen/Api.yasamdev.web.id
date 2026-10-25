import { getPath, onRouteChange, navigate } from './router.js';
import { renderNavbar, bindNavbar, renderFooter, bindFooter } from './components.js';
import { renderContact } from './creator.js';
import { renderHome, bindHome, renderDocs, bindDocs, renderError } from './pages.js';
import { getApiBySlug } from './apis/registry.js';
import { refreshIcons, copyText, icon } from './utils.js';
import { uiState } from './categories.js';
import { renderStatus, bindStatus, stopStatus } from './status.js';
import { initMotion, observeReveals, runBoot } from './motion.js';
import { applyNotices } from './notice.js';

const TITLES = { docs: 'Documentation — SamApi', '/500': 'Server Error — SamApi', '/404': 'Not Found — SamApi', '/contact': 'Contact YasamDev — SamApi', '/status': 'Status Server — SamApi', home: 'SamApi — Simple, powerful APIs' };

export function renderApp(opts = {}) {
  const html = document.documentElement;
  stopStatus();
  const path = getPath();
  const scrollY = window.scrollY;
  if (opts.silent) html.classList.add('silent');
  html.classList.remove('menu-open');

  const isDocs = path === '/docs' || path.startsWith('/docs/');
  const isError = path === '/404' || path === '/500';
  document.title = isDocs ? TITLES.docs : TITLES[path] || TITLES.home;

  const page = path === '/' ? renderHome() : path === '/contact' ? renderContact() : path === '/status' ? renderStatus() : isDocs ? renderDocs(path) : path === '/500' ? renderError('500') : renderError('404');
  document.getElementById('root').innerHTML =
    `<div class="min-h-screen text-fg">${renderNavbar(path)}<div id="page" class="page-enter">${page}</div>${!isError ? renderFooter() : ''}</div>`;

  bindNavbar();
  if (path === '/') bindHome();
  else if (path === '/status') bindStatus();
  else if (isDocs) bindDocs(path.startsWith('/docs/') ? getApiBySlug(path.split('/')[2]?.split('?')[0]) : null);
  else document.getElementById('retry')?.addEventListener('click', () => location.reload());
  bindFooter();
  refreshIcons();
  observeReveals();
  applyNotices(path);

  if (opts.silent) {
    window.scrollTo(0, scrollY);
    requestAnimationFrame(() => requestAnimationFrame(() => html.classList.remove('silent')));
  }
}

/* One delegated handler for navigation + copy buttons (works for dynamically rendered content). */
document.addEventListener('click', async (e) => {
  // gulir halus ke bagian di halaman yang sama (mis. tombol "Explore the APIs")
  const scroll = e.target.closest('[data-scroll]');
  if (scroll) { document.getElementById(scroll.dataset.scroll)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }

  // lompat ke daftar dokumentasi yang sudah terfilter per kategori
  const jump = e.target.closest('[data-cat-jump], [data-docs-cat][data-nav]');
  if (jump) {
    uiState.docs.cat = jump.dataset.catJump ?? jump.dataset.docsCat ?? '';
    uiState.docs.q = '';
    if (getPath() === '/docs') { renderApp(); window.scrollTo({ top: 0, behavior: 'smooth' }); } else navigate('/docs');
    return;
  }

  const nav = e.target.closest('[data-nav]');
  if (nav) {
    // masuk ke /docs lewat menu biasa = mulai dari daftar lengkap (tanpa filter lama)
    if (nav.dataset.nav === '/docs') { uiState.docs.cat = ''; uiState.docs.q = ''; if (getPath() === '/docs') renderApp(); }
    navigate(nav.dataset.nav);
    return;
  }

  const copy = e.target.closest('[data-copy], [data-code-copy]');
  if (!copy || copy.dataset.busy) return;
  const isCode = copy.dataset.codeCopy !== undefined;
  try {
    await copyText(isCode ? decodeURIComponent(copy.dataset.codeCopy) : copy.dataset.copy);
  } catch { return; }
  copy.dataset.busy = '1';
  const old = copy.innerHTML;
  copy.innerHTML = isCode ? `${icon('Check', 'h-3 w-3 text-emerald-400')} Copied` : icon('Check', 'h-3.5 w-3.5 text-ok');
  refreshIcons();
  setTimeout(() => { copy.innerHTML = old; delete copy.dataset.busy; refreshIcons(); }, 1600);
});

window.__render = renderApp;
onRouteChange(() => renderApp());
initMotion();
renderApp();
runBoot();
