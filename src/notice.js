import { apiDefinitions, getApiBySlug } from './apis/registry.js';
import { esc } from './utils.js';
import { getPath } from './router.js';

/* Menampilkan endpoint yang sedang error / dikunci oleh admin di halaman dokumentasi. */
let cache = { at: 0, data: null };
const keyOf = (a) => a.endpoint.replace(/^\/api\//, '');

async function fetchStatus() {
  if (cache.data && Date.now() - cache.at < 30000) return cache.data;
  try {
    const r = await fetch('/api/endpoint-status');
    const d = await r.json();
    cache = { at: Date.now(), data: d.endpoints || {} };
  } catch { cache = { at: Date.now(), data: {} }; }
  return cache.data;
}

export async function applyNotices(path) {
  if (!path.startsWith('/docs')) return;
  const st = await fetchStatus();
  const page = document.getElementById('page');
  if (!page || !Object.keys(st).length) return;
  if (getPath() !== path) return; // pengguna sudah pindah halaman

  const bySlug = new Map(apiDefinitions.map((a) => [a.slug, a]));
  // lencana kecil di daftar/kartu
  page.querySelectorAll('[data-nav^="/docs/"]').forEach((el) => {
    const a = bySlug.get(decodeURIComponent(el.dataset.nav.split('/')[2] || ''));
    const s = a && st[keyOf(a)];
    if (!s || el.querySelector('.adm-tag')) return;
    const tag = document.createElement('span');
    tag.className = 'adm-tag';
    tag.style.cssText = 'margin-left:6px;padding:0 6px;border:2px solid #14102b;border-radius:99px;font-size:9px;font-weight:800;color:#14102b;background:' + (s.status === 'error' ? '#f4546e' : '#ffc83d');
    tag.textContent = s.status === 'error' ? 'Error' : 'Dikunci';
    el.querySelector('.truncate')?.after(tag);
  });

  // banner di halaman detail endpoint
  const slug = path.startsWith('/docs/') ? decodeURIComponent(path.split('/')[2]?.split('?')[0] || '') : '';
  const api = slug && getApiBySlug(slug);
  const s = api && st[keyOf(api)];
  if (!s || page.querySelector('.adm-banner')) return;
  const box = document.createElement('div');
  box.className = 'adm-banner';
  box.setAttribute('role', 'status');
  box.style.cssText = 'margin:12px 0;padding:12px 16px;border:2.5px solid #14102b;border-radius:12px;font-weight:700;color:#14102b;background:' + (s.status === 'error' ? '#f4546e' : '#ffc83d');
  box.innerHTML = s.status === 'error'
    ? `Endpoint ini sedang bermasalah. ${esc(s.message || 'Coba lagi nanti.')}`
    : 'Endpoint ini dikunci. Tambahkan API key lewat <code>?apikey=KEY</code> atau header <code>x-api-key</code>. Hubungi admin untuk mendapatkan key.';
  page.prepend(box);
}
