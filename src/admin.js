import './index.css';
import { apiDefinitions } from './apis/registry.js';
import { toggleTheme, getTheme } from './theme.js';
import { esc, icon, refreshIcons } from './utils.js';

const $app = document.getElementById('app');
const $toast = document.getElementById('toast');
const LIST = apiDefinitions.map((a) => ({ key: a.endpoint.replace(/^\/api\//, ''), name: a.name, category: a.category, path: a.endpoint, ic: a.icon }));

let token = sessionStorage.getItem('admin_token') || '';
let S = null; let tab = 'endpoint'; let q = ''; let cat = ''; let newKey = '';

function toast(t) {
  $toast.textContent = t;
  $toast.classList.remove('opacity-0', 'translate-y-4');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => $toast.classList.add('opacity-0', 'translate-y-4'), 1800);
}

async function call(path, body) {
  const r = await fetch('/api/admin/' + path, {
    method: body ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: body ? JSON.stringify(body) : undefined
  });
  const d = await r.json().catch(() => ({}));
  if (r.status === 401 && token) logout();
  if (!r.ok) throw new Error(d.message || 'Permintaan gagal (' + r.status + ')');
  return d;
}
function logout() { token = ''; sessionStorage.removeItem('admin_token'); S = null; render(); }

const tile = (c, fg = '#14102b') => `style="--tile:rgb(var(--${c}));--tile-fg:${fg}"`;
const logo = `<span class="flex items-center gap-2.5"><span class="logo-mark">${icon('Zap', 'h-3.5 w-3.5 fill-current')}</span><span class="font-display text-[21px] leading-none">Sam<span class="text-gold">Api</span> <span class="text-dim">Admin</span></span></span>`;
const themeBtn = () => `<button id="th" class="chip !flex items-center justify-center !px-0 w-9" aria-label="Ganti tema">${icon(getTheme() === 'dark' ? 'Sun' : 'Moon', 'h-4 w-4')}</button>`;

function renderLogin(msg = '') {
  $app.innerHTML = `<main class="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
    <div class="mb-5 flex items-center justify-between">${logo}${themeBtn()}</div>
    <form id="f" class="card page-enter p-6">
      <div class="flex items-center gap-3"><span class="iconbox h-11 w-11" ${tile('yellow')}>${icon('Lock', 'h-5 w-5')}</span>
        <div><h1 class="font-display text-2xl leading-tight">Masuk admin</h1><p class="text-xs text-muted">Hanya untuk pengelola API.</p></div></div>
      <label class="mt-5 block text-xs font-extrabold" for="pw">Password</label>
      <input class="input mt-1.5" type="password" id="pw" autocomplete="current-password" required autofocus>
      <p id="m" class="mt-2 min-h-[1.25rem] text-xs font-bold text-red" role="alert">${esc(msg)}</p>
      <button class="btn btn-gold mt-2 w-full">Masuk</button>
    </form></main>`;
  bindTheme(); refreshIcons();
  document.getElementById('f').onsubmit = async (e) => {
    e.preventDefault();
    const m = document.getElementById('m'); m.textContent = '';
    try {
      const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: document.getElementById('pw').value }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message || 'Gagal masuk');
      token = d.token; sessionStorage.setItem('admin_token', token);
      await load();
    } catch (err) { m.textContent = err.message; }
  };
}

async function load() { try { S = await call('state'); render(); } catch (err) { renderLogin(err.message); } }

function rowHtml(e) {
  const r = S.endpoints[e.key] || { status: 'ok', message: '', locked: false };
  const err = r.status === 'error';
  return `<div class="grid items-center gap-3 border-b-2 hair px-4 py-3 last:border-0 md:grid-cols-[minmax(0,1.3fr)_9rem_minmax(0,1.5fr)_auto]" data-k="${esc(e.key)}">
    <div class="flex min-w-0 items-center gap-3"><span class="iconbox h-9 w-9 shrink-0" ${tile(err ? 'red' : r.locked ? 'yellow' : 'lilac')}>${icon(e.ic, 'h-4 w-4')}</span>
      <div class="min-w-0"><div class="flex flex-wrap items-center gap-1.5"><b class="truncate text-sm">${esc(e.name)}</b>${err ? '<span class="badge" style="background:rgb(var(--red))">Error</span>' : ''}${r.locked ? '<span class="badge" style="background:rgb(var(--yellow))">Dikunci</span>' : ''}</div>
      <span class="block truncate font-mono text-[11px] text-dim">${esc(e.path)}</span></div></div>
    <select class="input !h-10 !text-xs" data-f="status" aria-label="Status ${esc(e.name)}"><option value="ok" ${err ? '' : 'selected'}>Normal</option><option value="error" ${err ? 'selected' : ''}>Error</option></select>
    <input class="input !h-10 !text-xs" type="text" data-f="message" maxlength="300" placeholder="${err ? 'Pesan untuk pengguna' : 'Pesan jika error (opsional)'}" value="${esc(r.message)}" aria-label="Pesan ${esc(e.name)}">
    <button class="chip ${r.locked ? 'is-active' : ''}" data-f="locked" aria-pressed="${r.locked}">${icon(r.locked ? 'Lock' : 'LockOpen', 'h-3.5 w-3.5')}${r.locked ? 'Dikunci' : 'Kunci'}</button></div>`;
}

function statCard(label, n, ic, c) {
  return `<article class="card flex items-center gap-3 p-4"><span class="iconbox h-11 w-11 shrink-0" ${tile(c)}>${icon(ic, 'h-5 w-5')}</span><div><div class="font-display text-3xl leading-none">${n}</div><div class="mt-1 text-xs font-bold text-muted">${label}</div></div></article>`;
}

function render() {
  if (!token || !S) return renderLogin();
  const cats = [...new Set(LIST.map((e) => e.category))];
  const nErr = Object.values(S.endpoints).filter((r) => r.status === 'error').length;
  const nLck = Object.values(S.endpoints).filter((r) => r.locked).length;
  const shown = LIST.filter((e) => (!cat || e.category === cat) && (!q || (e.name + e.path).toLowerCase().includes(q.toLowerCase())));
  const lockedList = LIST.filter((e) => S.endpoints[e.key]?.locked);
  $app.innerHTML = `<main class="mx-auto max-w-5xl px-4 pb-20 pt-5 sm:px-6">
  <header class="mb-6 flex flex-wrap items-center justify-between gap-3">${logo}
    <div class="flex items-center gap-2">${themeBtn()}<a class="chip !inline-flex items-center" href="/">${icon('ExternalLink', 'h-3.5 w-3.5')}Lihat situs</a><button class="chip" id="out">${icon('LogOut', 'h-3.5 w-3.5')}Keluar</button></div></header>
  ${S.persistent ? '' : `<div class="card page-enter mb-5 flex items-start gap-3 p-4" style="background:rgb(var(--yellow));color:rgb(var(--on-light))">${icon('TriangleAlert', 'mt-0.5 h-5 w-5 shrink-0')}<p class="text-sm font-bold">URLDATABASE belum diatur, jadi pengaturan hanya tersimpan di memori dan bisa hilang saat server restart. Isi URLDATABASE (MongoDB) di Vercel agar permanen.</p></div>`}
  <section class="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">${statCard('Total endpoint', LIST.length, 'Layers', 'gold2')}${statCard('Sedang error', nErr, 'ShieldAlert', 'red')}${statCard('Dikunci', nLck, 'Lock', 'yellow')}${statCard('API key', S.keys.length, 'KeyRound', 'green')}</section>
  <nav class="mb-4 flex gap-2" aria-label="Bagian admin"><button class="chip ${tab === 'endpoint' ? 'is-active' : ''}" data-tab="endpoint">Endpoint</button><button class="chip ${tab === 'keys' ? 'is-active' : ''}" data-tab="keys">API key</button></nav>
  ${tab === 'endpoint' ? `
  <div class="mb-4 grid gap-3 sm:grid-cols-[1fr_14rem]"><input class="input" type="search" id="q" placeholder="Cari endpoint" value="${esc(q)}" aria-label="Cari endpoint"><select class="input" id="cat" aria-label="Kategori"><option value="">Semua kategori</option>${cats.map((c) => `<option ${c === cat ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select></div>
  <section class="card" id="list">${shown.map(rowHtml).join('') || '<p class="p-6 text-sm text-muted">Tidak ada endpoint yang cocok. Ubah kata kunci atau kategori.</p>'}</section>
  <p class="mt-3 text-xs leading-5 text-muted">Perubahan tersimpan otomatis. Endpoint berstatus Error menjawab pengguna dengan HTTP 503 dan pesan di atas. Endpoint yang dikunci butuh API key. Admin yang login tetap bisa mengakses semuanya.</p>` : `
  <section class="card mb-5 p-5"><h2 class="font-display text-lg">Buat API key</h2>
    <div class="mt-3 grid gap-3 sm:grid-cols-[1fr_16rem_auto]"><input class="input" type="text" id="kn" maxlength="60" placeholder="Nama key, mis. Aplikasi Budi" aria-label="Nama key"><select class="input" id="ks" aria-label="Cakupan"><option value="*">Semua endpoint terkunci</option><option value="pick">Pilih endpoint tertentu</option></select><button class="btn btn-gold" id="kc">${icon('Plus', 'h-4 w-4')}Buat key</button></div>
    <div id="pick" hidden class="mt-3 max-h-48 overflow-auto rounded-2xl border-[2.5px] border-ink p-3">${lockedList.length ? lockedList.map((e) => `<label class="flex items-center gap-2 py-1 text-sm font-bold"><input type="checkbox" class="h-4 w-4 accent-[rgb(var(--gold2))]" value="${esc(e.key)}">${esc(e.name)}</label>`).join('') : '<p class="text-sm text-muted">Belum ada endpoint yang dikunci. Kunci dulu di tab Endpoint.</p>'}</div>
    ${newKey ? `<div class="mt-4 rounded-2xl border-[2.5px] border-ink p-3" style="background:rgb(var(--lilac));color:rgb(var(--on-light))"><p class="text-xs font-extrabold">Salin key ini sekarang. Tidak akan ditampilkan lagi.</p><div class="mt-2 flex items-center gap-2"><code class="min-w-0 flex-1 break-all rounded-xl border-2 border-ink bg-white px-3 py-2 font-mono text-xs">${esc(newKey)}</code><button class="btn btn-gold btn-sm" id="cp">${icon('Copy', 'h-4 w-4')}Salin</button></div></div>` : ''}</section>
  <section class="card">${S.keys.map((k) => `<div class="flex flex-wrap items-center justify-between gap-3 border-b-2 hair px-4 py-3 last:border-0"><div class="flex min-w-0 items-center gap-3"><span class="iconbox h-9 w-9 shrink-0" ${tile(k.active ? 'green' : 'lilac')}>${icon('KeyRound', 'h-4 w-4')}</span><div class="min-w-0"><div class="flex items-center gap-1.5"><b class="truncate text-sm">${esc(k.name)}</b>${k.active ? '' : '<span class="badge" style="background:rgb(var(--red))">Nonaktif</span>'}</div><span class="block truncate font-mono text-[11px] text-dim">${esc(k.prefix)}… · ${k.scopes.includes('*') ? 'semua endpoint terkunci' : esc(k.scopes.join(', '))}</span></div></div>
    <div class="flex gap-2"><button class="chip" data-kt="${k.id}">${k.active ? 'Nonaktifkan' : 'Aktifkan'}</button><button class="chip" style="background:rgb(var(--red));color:#fff" data-kd="${k.id}" aria-label="Hapus ${esc(k.name)}">${icon('Trash2', 'h-3.5 w-3.5')}Hapus</button></div></div>`).join('') || '<p class="p-6 text-sm text-muted">Belum ada API key. Buat key di atas untuk mengizinkan aplikasi memakai endpoint yang dikunci.</p>'}</section>
  <p class="mt-3 text-xs text-muted">Pengguna memakai key lewat <code class="font-mono">?apikey=KEY</code> atau header <code class="font-mono">x-api-key</code>.</p>`}
  </main>`;
  bind(); bindTheme(); refreshIcons();
}

function bindTheme() { document.getElementById('th').onclick = () => { toggleTheme(); S && token ? render() : renderLogin(); }; }

async function act(path, body, ok) {
  try { S = await call(path, body); if (S.new_key) newKey = S.new_key; render(); if (ok) toast(ok); } catch (err) { toast(err.message); }
}

function bind() {
  document.getElementById('out').onclick = logout;
  document.querySelectorAll('[data-tab]').forEach((b) => (b.onclick = () => { tab = b.dataset.tab; newKey = ''; render(); }));
  if (tab === 'endpoint') {
    const qi = document.getElementById('q');
    qi.oninput = () => { q = qi.value; const pos = qi.selectionStart; render(); const n = document.getElementById('q'); n.focus(); n.setSelectionRange(pos, pos); };
    document.getElementById('cat').onchange = (e) => { cat = e.target.value; render(); };
    document.querySelectorAll('#list [data-k]').forEach((row) => {
      const save = (lockToggle) => {
        const status = row.querySelector('[data-f=status]').value;
        const message = row.querySelector('[data-f=message]').value.trim();
        const lockBtn = row.querySelector('[data-f=locked]');
        const locked = lockToggle ? lockBtn.getAttribute('aria-pressed') !== 'true' : lockBtn.getAttribute('aria-pressed') === 'true';
        if (status === 'error' && !message) { toast('Isi pesan untuk pengguna dulu.'); row.querySelector('[data-f=message]').focus(); return; }
        act('endpoint', { slug: row.dataset.k, status, message, locked }, 'Tersimpan');
      };
      row.querySelector('[data-f=status]').onchange = () => save(false);
      row.querySelector('[data-f=message]').onchange = () => save(false);
      row.querySelector('[data-f=locked]').onclick = () => save(true);
    });
  } else {
    document.getElementById('ks').onchange = (e) => { document.getElementById('pick').hidden = e.target.value !== 'pick'; };
    document.getElementById('kc').onclick = () => {
      const name = document.getElementById('kn').value.trim();
      if (!name) return toast('Isi nama key dulu.');
      const pickMode = document.getElementById('ks').value === 'pick';
      const scopes = pickMode ? [...document.querySelectorAll('#pick input:checked')].map((i) => i.value) : ['*'];
      if (pickMode && !scopes.length) return toast('Pilih minimal satu endpoint.');
      act('key/create', { name, scopes }, 'Key dibuat');
    };
    document.getElementById('cp')?.addEventListener('click', () => navigator.clipboard?.writeText(newKey).then(() => toast('Tersalin')));
    document.querySelectorAll('[data-kt]').forEach((b) => (b.onclick = () => act('key/toggle', { id: b.dataset.kt }, 'Diperbarui')));
    document.querySelectorAll('[data-kd]').forEach((b) => (b.onclick = () => { if (confirm('Hapus key ini? Aplikasi yang memakainya akan ditolak.')) act('key/delete', { id: b.dataset.kd }, 'Key dihapus'); }));
  }
}

if (token) load(); else renderLogin();
