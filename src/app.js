import { getPath, onRouteChange } from './router.js';
import { renderNavbar, bindNavbar, renderFooter, bindFooter } from './components.js';
import { renderHome, bindHome, renderDocs, bindDocs, renderError } from './pages.js';
import { getApiBySlug } from './apis/registry.js';
import { refreshIcons } from './utils.js';

export function renderApp() {
  const path = getPath();
  document.title = path.startsWith('/docs') ? 'Documentation — SamApi' : path === '/500' ? 'Server Error — SamApi' : path === '/404' ? 'Not Found — SamApi' : 'SamApi — Simple, powerful APIs';
  const isError = path === '/404' || path === '/500';
  const root=document.getElementById('root');
  root.innerHTML=`<div class="min-h-screen bg-white text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">${renderNavbar(path)}<div id="page">${path==='/'?renderHome():path==='/docs'||path.startsWith('/docs/')?renderDocs(path):path==='/500'?renderError('500'):renderError('404')}</div>${!isError?renderFooter():''}</div>`;
  bindNavbar();
  if(path==='/') bindHome();
  else if(path==='/docs'||path.startsWith('/docs/')) bindDocs(path.startsWith('/docs/')?getApiBySlug(path.split('/')[2]?.split('?')[0]):null);
  else { document.querySelectorAll('[data-nav]').forEach((el)=>el.addEventListener('click',()=>window.location.hash=el.dataset.nav)); document.getElementById('retry')?.addEventListener('click',()=>location.reload()); }
  bindFooter(); refreshIcons();
}

window.__render=renderApp;
onRouteChange(renderApp);
renderApp();
