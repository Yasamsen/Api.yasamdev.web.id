import { getPath, onRouteChange, navigate } from './router.js';
import { renderNavbar, bindNavbar, renderFooter, bindFooter } from './components.js';
import { renderHome, bindHome, renderDocs, bindDocs, renderError } from './pages.js';
import { getApiBySlug } from './apis/registry.js';
import { refreshIcons, copyText, icon } from './utils.js';
import { initMotion, observeReveals, runBoot } from './motion.js';

const TITLES = { docs: 'Documentation — SamApi', '/500': 'Server Error — SamApi', '/404': 'Not Found — SamApi', home: 'SamApi — Simple, powerful APIs' };

export function renderApp(opts = {}) {
  const html = document.documentElement;
  const path = getPath();
  const scrollY = window.scrollY;
  if (opts.silent) html.classList.add('silent');
  html.classList.remove('menu-open');

  const isDocs = path === '/docs' || path.startsWith('/docs/');
  const isError = path === '/404' || path === '/500';
  document.title = isDocs ? TITLES.docs : TITLES[path] || TITLES.home;

  const page = path === '/' ? renderHome() : isDocs ? renderDocs(path) : path === '/500' ? renderError('500') : renderError('404');
  document.getElementById('root').innerHTML =
    `<div class="min-h-screen bg-bg text-fg">${renderNavbar(path)}<div id="page" class="page-enter">${page}</div>${!isError ? renderFooter() : ''}</div>`;

  bindNavbar();
  if (path === '/') bindHome();
  else if (isDocs) bindDocs(path.startsWith('/docs/') ? getApiBySlug(path.split('/')[2]?.split('?')[0]) : null);
  else document.getElementById('retry')?.addEventListener('click', () => location.reload());
  bindFooter();
  refreshIcons();
  observeReveals();

  if (opts.silent) {
    window.scrollTo(0, scrollY);
    requestAnimationFrame(() => requestAnimationFrame(() => html.classList.remove('silent')));
  }
}

/* One delegated handler for navigation + copy buttons (works for dynamically rendered content). */
document.addEventListener('click', async (e) => {
  const nav = e.target.closest('[data-nav]');
  if (nav) { navigate(nav.dataset.nav); return; }

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
