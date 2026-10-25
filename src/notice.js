import { apiDefinitions, getApiBySlug } from './apis/registry.js';
import { esc, icon, refreshIcons } from './utils.js';
import { getPath } from './router.js';

/* Label + banner untuk endpoint yang sedang Error atau Dikunci oleh admin. */
let cache = { at: 0, data: null };
let observer = null;
const keyOf = (a) => a.endpoint.replace(/^\/api\//, '');
const bySlug = new Map(apiDefinitions.map((a) => [a.slug, a]));

async function fetchStatus() {
  if (cache.data && Date.now() - cache.at < 30000) return cache.data;
  try {
    const r = await fetch('/api/endpoint-status');
    const d = await r.json();
    cache = { at: Date.now(), data: d.endpoints || {} };
  } catch { cache = { at: Date.now(), data: {} }; }
  return cache.data;
}

function labelHtml(s, big = false) {
  const err = s.status === 'error';
  const tip = err ? 'Endpoint sedang bermasalah' + (s.message ? ': ' + s.message : '') : 'Endpoint dikunci, butuh API key';
  return `<span class="badge adm-label ${big ? '!px-2.5 !py-1 !text-[11px]' : ''}" style="gap:4px;background:rgb(var(--${err ? 'red' : 'yellow'}))" title="${esc(tip)}">${icon(err ? 'TriangleAlert' : 'Lock', big ? 'h-3.5 w-3.5' : 'h-3 w-3')}${err ? 'Error' : 'Dikunci'}</span>`;
}

function addLabels(page, st) {
  let added = false;
  // daftar sidebar & kartu endpoint
  page.querySelectorAll('[data-nav^="/docs/"]').forEach((el) => {
    if (el.querySelector('.adm-label')) return;
    const a = bySlug.get(decodeURIComponent(el.dataset.nav.split('/')[2] || ''));
    const s = a && st[keyOf(a)];
    const name = s && el.querySelector('.truncate');
    if (!name) return;
    name.insertAdjacentHTML('afterend', labelHtml(s));
    name.parentElement?.classList.add('items-center');
    added = true;
  });

  // judul halaman detail endpoint
  const path = getPath();
  const slug = path.startsWith('/docs/') ? decodeURIComponent(path.split('/')[2]?.split('?')[0] || '') : '';
  const api = slug && bySlug.get(slug);
  const s = api && st[keyOf(api)];
  if (s) {
    const row = page.querySelector('h1')?.previousElementSibling;
    if (row && !row.querySelector('.adm-label')) { row.lastElementChild?.insertAdjacentHTML('beforebegin', labelHtml(s, true)); added = true; }
    if (!page.querySelector('.adm-banner')) { addBanner(page, s); added = true; }
  }
  if (added) refreshIcons();
}

function addBanner(page, s) {
  const err = s.status === 'error';
  const box = document.createElement('div');
  box.className = 'adm-banner card mb-6 flex items-start gap-3 p-4 text-left';
  box.setAttribute('role', 'status');
  box.innerHTML = `<span class="iconbox h-10 w-10 shrink-0" style="--tile:rgb(var(--${err ? 'red' : 'yellow'}));--tile-fg:#14102b">${icon(err ? 'TriangleAlert' : 'Lock', 'h-5 w-5')}</span>
    <div class="min-w-0"><p class="text-sm font-extrabold">${err ? 'Endpoint ini sedang bermasalah' : 'Endpoint ini dikunci'}</p>
    <p class="mt-1 text-[13px] leading-6 text-muted">${err ? esc(s.message || 'Coba lagi nanti.') : 'Tambahkan API key lewat <code class="font-mono text-gold">?apikey=KEY</code> atau header <code class="font-mono text-gold">x-api-key</code>. Hubungi admin untuk mendapatkan key.'}</p></div>`;
  (page.querySelector('main') || page).prepend(box);
}

export async function applyNotices(path) {
  observer?.disconnect(); observer = null;
  if (!path.startsWith('/docs')) return;
  const st = await fetchStatus();
  const page = document.getElementById('page');
  if (!page || !Object.keys(st).length || getPath() !== path) return;
  addLabels(page, st);
  // daftar dirender ulang saat mencari/memfilter: pasang label lagi
  let t;
  observer = new MutationObserver(() => { clearTimeout(t); t = setTimeout(() => addLabels(page, st), 60); });
  observer.observe(page, { childList: true, subtree: true });
}
