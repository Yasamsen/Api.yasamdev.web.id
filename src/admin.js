import './index.css';
import { apiDefinitions } from './apis/registry.js';
import { toggleTheme, getTheme } from './theme.js';
import { esc, icon, refreshIcons } from './utils.js';
import { resetSnippetCache } from './snippet.js';

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
function logout() { token = ''; sessionStorage.removeItem('admin_token'); S = null; SN = null; UL = null; editing = null; render(); }

const UNITS = { second: 'detik', minute: 'menit', hour: 'jam', day: 'hari' };
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
  const lim = r.limit;
  return `<div class="grid items-center gap-3 border-b-2 hair px-4 py-3 last:border-0 md:grid-cols-[minmax(0,1.3fr)_9rem_minmax(0,1.5fr)_auto]" data-k="${esc(e.key)}">
    <div class="flex min-w-0 items-center gap-3"><span class="iconbox h-9 w-9 shrink-0" ${tile(err ? 'red' : r.locked ? 'yellow' : 'lilac')}>${icon(e.ic, 'h-4 w-4')}</span>
      <div class="min-w-0"><div class="flex flex-wrap items-center gap-1.5"><b class="truncate text-sm">${esc(e.name)}</b>${err ? '<span class="badge" style="background:rgb(var(--red))">Error</span>' : ''}${r.locked ? '<span class="badge" style="background:rgb(var(--yellow))">Dikunci</span>' : ''}${lim ? `<span class="badge" style="background:rgb(var(--lilac))">${lim.max}/${UNITS[lim.per]}</span>` : ''}</div>
      <span class="block truncate font-mono text-[11px] text-dim">${esc(e.path)}</span></div></div>
    <select class="input !h-10 !text-xs" data-f="status" aria-label="Status ${esc(e.name)}"><option value="ok" ${err ? '' : 'selected'}>Normal</option><option value="error" ${err ? 'selected' : ''}>Error</option></select>
    <input class="input !h-10 !text-xs" type="text" data-f="message" maxlength="300" placeholder="${err ? 'Pesan untuk pengguna' : 'Pesan jika error (opsional)'}" value="${esc(r.message)}" aria-label="Pesan ${esc(e.name)}">
    <button class="chip ${r.locked ? 'is-active' : ''}" data-f="locked" aria-pressed="${r.locked}">${icon(r.locked ? 'Lock' : 'LockOpen', 'h-3.5 w-3.5')}${r.locked ? 'Dikunci' : 'Kunci'}</button>
    <div class="flex flex-wrap items-center gap-2 md:col-span-full md:pl-12"><span class="text-[11px] font-extrabold text-dim">${icon('Gauge', 'mr-1 inline h-3.5 w-3.5')}Batas per pengguna</span>
      <input class="input !h-9 !w-24 !text-xs" type="number" min="1" max="1000000" inputmode="numeric" data-f="limit-max" placeholder="Tanpa" value="${lim ? lim.max : ''}" aria-label="Batas permintaan ${esc(e.name)}">
      <span class="text-xs text-muted">permintaan per</span>
      <select class="input !h-9 !w-28 !text-xs" data-f="limit-per" aria-label="Satuan waktu ${esc(e.name)}">${Object.entries(UNITS).map(([v, l]) => `<option value="${v}" ${(lim?.per || 'minute') === v ? 'selected' : ''}>${l}</option>`).join('')}</select></div></div>`;
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
  <nav class="mb-4 flex gap-2" aria-label="Bagian admin"><button class="chip ${tab === 'endpoint' ? 'is-active' : ''}" data-tab="endpoint">Endpoint</button><button class="chip ${tab === 'keys' ? 'is-active' : ''}" data-tab="keys">API key</button><button class="chip ${tab === 'snippet' ? 'is-active' : ''}" data-tab="snippet">Snippet</button><button class="chip ${tab === 'users' ? 'is-active' : ''}" data-tab="users">Pengguna</button></nav>
  ${tab === 'endpoint' ? `
  <div class="mb-4 grid gap-3 sm:grid-cols-[1fr_14rem]"><input class="input" type="search" id="q" placeholder="Cari endpoint" value="${esc(q)}" aria-label="Cari endpoint"><select class="input" id="cat" aria-label="Kategori"><option value="">Semua kategori</option>${cats.map((c) => `<option ${c === cat ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select></div>
  <section class="card" id="list">${shown.map(rowHtml).join('') || '<p class="p-6 text-sm text-muted">Tidak ada endpoint yang cocok. Ubah kata kunci atau kategori.</p>'}</section>
  <p class="mt-3 text-xs leading-5 text-muted">Perubahan tersimpan otomatis. Endpoint berstatus Error menjawab pengguna dengan HTTP 503 dan pesan di atas. Endpoint yang dikunci butuh API key. Batas permintaan dihitung per alamat IP, atau per API key kalau pengguna memakai key; lewat batas, pengguna mendapat HTTP 429. Admin yang login tetap bisa mengakses semuanya.</p>` : tab === 'snippet' ? snippetTab() : tab === 'users' ? usersTab() : `
  <section class="card mb-5 p-5"><h2 class="font-display text-lg">Buat API key</h2>
    <div class="mt-3 grid gap-3 sm:grid-cols-[1fr_16rem_auto]"><input class="input" type="text" id="kn" maxlength="60" placeholder="Nama key, mis. Aplikasi Budi" aria-label="Nama key"><select class="input" id="ks" aria-label="Cakupan"><option value="*">Semua endpoint terkunci</option><option value="pick">Pilih endpoint tertentu</option></select><button class="btn btn-gold" id="kc">${icon('Plus', 'h-4 w-4')}Buat key</button></div>
    <div id="pick" hidden class="mt-3 max-h-48 overflow-auto rounded-2xl border-[2.5px] border-ink p-3">${lockedList.length ? lockedList.map((e) => `<label class="flex items-center gap-2 py-1 text-sm font-bold"><input type="checkbox" class="h-4 w-4 accent-[rgb(var(--gold2))]" value="${esc(e.key)}">${esc(e.name)}</label>`).join('') : '<p class="text-sm text-muted">Belum ada endpoint yang dikunci. Kunci dulu di tab Endpoint.</p>'}</div>
    ${newKey ? `<div class="mt-4 rounded-2xl border-[2.5px] border-ink p-3" style="background:rgb(var(--lilac));color:rgb(var(--on-light))"><p class="text-xs font-extrabold">Salin key ini sekarang. Tidak akan ditampilkan lagi.</p><div class="mt-2 flex items-center gap-2"><code class="min-w-0 flex-1 break-all rounded-xl border-2 border-ink bg-white px-3 py-2 font-mono text-xs">${esc(newKey)}</code><button class="btn btn-gold btn-sm" id="cp">${icon('Copy', 'h-4 w-4')}Salin</button></div></div>` : ''}</section>
  <section class="card">${S.keys.map((k) => `<div class="flex flex-wrap items-center justify-between gap-3 border-b-2 hair px-4 py-3 last:border-0"><div class="flex min-w-0 items-center gap-3"><span class="iconbox h-9 w-9 shrink-0" ${tile(k.active ? 'green' : 'lilac')}>${icon('KeyRound', 'h-4 w-4')}</span><div class="min-w-0"><div class="flex items-center gap-1.5"><b class="truncate text-sm">${esc(k.name)}</b>${k.active ? '' : '<span class="badge" style="background:rgb(var(--red))">Nonaktif</span>'}</div><span class="block truncate font-mono text-[11px] text-dim">${esc(k.prefix)}… · ${k.scopes.includes('*') ? 'semua endpoint terkunci' : esc(k.scopes.join(', '))}</span></div></div>
    <div class="flex gap-2"><button class="chip" data-kt="${k.id}">${k.active ? 'Nonaktifkan' : 'Aktifkan'}</button><button class="chip" style="background:rgb(var(--red));color:#fff" data-kd="${k.id}" aria-label="Hapus ${esc(k.name)}">${icon('Trash2', 'h-3.5 w-3.5')}Hapus</button></div></div>`).join('') || '<p class="p-6 text-sm text-muted">Belum ada API key. Buat key di atas untuk mengizinkan aplikasi memakai endpoint yang dikunci.</p>'}</section>
  <p class="mt-3 text-xs text-muted">Pengguna memakai key lewat <code class="font-mono">?apikey=KEY</code> atau header <code class="font-mono">x-api-key</code>.</p>`}
  </main>`;
  bind(); bindTheme(); refreshIcons();
  if (tab === 'snippet' && SN === null && !snBusy) loadSnippets();
  if (tab === 'users' && UL === null && !ulBusy) loadUsers();
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
        const lm = row.querySelector('[data-f=limit-max]').value.trim();
        const limit = lm ? { max: Number(lm), per: row.querySelector('[data-f=limit-per]').value } : null;
        act('endpoint', { slug: row.dataset.k, status, message, locked, limit }, 'Tersimpan');
      };
      row.querySelector('[data-f=status]').onchange = () => save(false);
      row.querySelector('[data-f=message]').onchange = () => save(false);
      row.querySelector('[data-f=limit-max]').onchange = () => save(false);
      row.querySelector('[data-f=limit-per]').onchange = () => save(false);
      row.querySelector('[data-f=locked]').onclick = () => save(true);
    });
  } else if (tab === 'snippet') {
    bindSnippet();
  } else if (tab === 'users') {
    bindUsers();
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


/* =========================================================
   TAB SNIPPET — tambah / ubah / hapus (token admin yang sama)
   ========================================================= */
let SN = null; let snBusy = false; let snErr = ''; let snQ = ''; let editing = null; let snSaving = false;
const SN_CATS = ['Downloader', 'Scraper', 'Bot WhatsApp', 'AI & ML', 'Canvas', 'REST API', 'Utility', 'Tools'];
const SN_LANGS = ['javascript', 'typescript', 'python', 'bash', 'html', 'css', 'json', 'php'];

async function snCall(path, { method = 'GET', body } = {}) {
  const r = await fetch('/api/snippet/' + path, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: body ? JSON.stringify(body) : undefined
  });
  const d = await r.json().catch(() => ({}));
  if (r.status === 401 && token) logout();
  if (!r.ok || d.status === false) throw new Error(d.message || 'Permintaan gagal (' + r.status + ')');
  return d;
}

async function loadSnippets() {
  snBusy = true; snErr = '';
  try { SN = (await snCall('list')).data || []; } catch (e) { SN = []; snErr = e.message; }
  snBusy = false;
  if (tab === 'snippet' && S) render();
}

const snDate = (v) => (v ? new Date(v).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '');

function snippetTab() {
  const list = (SN || []).filter((c) => !snQ || `${c.title} ${c.category} ${c.language}`.toLowerCase().includes(snQ.toLowerCase()));
  const rows = list.map((c) => `<div class="grid items-center gap-3 border-b-2 hair px-4 py-3 last:border-0 sm:grid-cols-[minmax(0,1fr)_auto]" data-sid="${esc(c.id)}">
      <div class="flex min-w-0 items-center gap-3"><span class="iconbox h-9 w-9 shrink-0" ${tile('lilac')}>${icon('Code', 'h-4 w-4')}</span>
        <div class="min-w-0"><b class="block truncate text-sm">${esc(c.title)}</b>
        <span class="block truncate text-[11px] text-dim">${esc(c.category || 'Lainnya')} · ${esc(c.language || 'text')} · ${c.views || 0} dilihat · ${c.copies || 0} disalin${c.updatedAt ? ' · ' + snDate(c.updatedAt) : ''}</span></div></div>
      <div class="flex gap-2"><a class="chip !inline-flex items-center" href="/#/snippet/${encodeURIComponent(c.slug || c.id)}" target="_blank" rel="noopener" aria-label="Buka ${esc(c.title)}">${icon('ExternalLink', 'h-3.5 w-3.5')}</a><button class="chip" data-sedit="${esc(c.id)}">${icon('Pencil', 'h-3.5 w-3.5')}Edit</button><button class="chip" style="background:rgb(var(--red));color:#fff" data-sdel="${esc(c.id)}" aria-label="Hapus ${esc(c.title)}">${icon('Trash2', 'h-3.5 w-3.5')}</button></div></div>`).join('');
  const empty = SN === null || snBusy ? '<p class="p-6 text-sm text-muted">Memuat snippet…</p>'
    : snErr ? `<p class="p-6 text-sm font-bold text-red">${esc(snErr)}</p>`
    : `<p class="p-6 text-sm text-muted">${SN.length ? 'Tidak ada snippet yang cocok.' : 'Belum ada snippet. Klik “Snippet baru” untuk menambahkan yang pertama.'}</p>`;
  return `<div class="mb-4 grid gap-3 sm:grid-cols-[1fr_auto]"><input class="input" type="search" id="sq" placeholder="Cari judul, kategori, bahasa" value="${esc(snQ)}" aria-label="Cari snippet"><button class="btn btn-gold" id="snew">${icon('Plus', 'h-4 w-4')}Snippet baru</button></div>
  <section class="card" id="slist">${rows || empty}</section>
  <p class="mt-3 text-xs leading-5 text-muted">Snippet tampil di halaman publik <a class="font-bold text-gold underline" href="/#/snippet" target="_blank" rel="noopener">/#/snippet</a>. Ambil kode mentah lewat <code class="font-mono">curl -sL ${esc(location.origin)}/raw/&lt;slug&gt;</code>.</p>
  ${editing ? snippetForm() : ''}`;
}

function snippetForm() {
  const e = editing; const isNew = !e.id;
  const f = (id, label, val, attrs = '', list = '') => `<div><label class="block text-xs font-extrabold" for="${id}">${label}</label><input class="input mt-1.5" id="${id}" value="${esc(val)}" ${attrs} ${list ? `list="${list}"` : ''}></div>`;
  return `<div class="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="sft">
    <div class="absolute inset-0 bg-ink/60" data-sclose></div>
    <form id="sform" class="card page-enter relative flex max-h-[94vh] w-full max-w-2xl flex-col !rounded-b-none sm:!rounded-3xl">
      <div class="flex items-center justify-between gap-3 border-b-2 hair px-5 py-4"><h2 id="sft" class="font-display text-xl">${isNew ? 'Snippet baru' : 'Edit snippet'}</h2><button type="button" class="iconbtn" data-sclose aria-label="Tutup">${icon('X', 'h-4 w-4')}</button></div>
      <div class="grid flex-1 gap-3.5 overflow-y-auto px-5 py-4">
        ${f('s-title', 'Judul', e.title, 'maxlength="120" required placeholder="Contoh: YouTube Music Downloader"')}
        <div class="grid gap-3.5 sm:grid-cols-2">${f('s-category', 'Kategori', e.category, 'maxlength="40" placeholder="Scraper"', 'dc')}${f('s-language', 'Bahasa', e.language, 'maxlength="40" placeholder="javascript"', 'dl')}</div>
        <datalist id="dc">${SN_CATS.map((c) => `<option value="${c}">`).join('')}</datalist><datalist id="dl">${SN_LANGS.map((c) => `<option value="${c}">`).join('')}</datalist>
        ${f('s-install', 'Perintah install (opsional)', e.install, 'maxlength="200" placeholder="npm i axios cheerio"')}
        ${f('s-description', 'Deskripsi (opsional)', e.description, 'maxlength="500" placeholder="Satu atau dua kalimat tentang fungsinya"')}
        <div><label class="block text-xs font-extrabold" for="s-code">Isi kode</label><textarea id="s-code" required spellcheck="false" placeholder="Tempel source code di sini…" class="input mt-1.5 !h-56 !rounded-2xl !py-3 font-mono !text-xs" style="resize:vertical;line-height:1.6;white-space:pre;overflow:auto">${esc(e.code)}</textarea><span class="mt-1 block text-[11px] text-dim" id="s-cnt"></span></div>
      </div>
      <div class="flex flex-col-reverse gap-2.5 border-t-2 hair px-5 py-4 sm:flex-row sm:justify-end"><button type="button" class="btn btn-ghost btn-sm" data-sclose>Batal</button><button class="btn btn-gold btn-sm" id="s-save" ${snSaving ? 'disabled' : ''}>${snSaving ? 'Menyimpan…' : isNew ? 'Simpan' : 'Simpan perubahan'}</button></div>
    </form></div>`;
}

function bindSnippet() {
  const $ = (id) => document.getElementById(id);
  const qi = $('sq');
  if (qi) qi.oninput = () => { snQ = qi.value; const pos = qi.selectionStart; render(); const n = $('sq'); n.focus(); n.setSelectionRange(pos, pos); };
  const blank = { id: '', title: '', category: '', language: '', install: '', description: '', code: '' };
  $('snew')?.addEventListener('click', () => { editing = { ...blank }; render(); $('s-title')?.focus(); });

  document.querySelectorAll('[data-sedit]').forEach((b) => (b.onclick = async () => {
    b.disabled = true;
    try {
      const { data } = await snCall('item?id=' + encodeURIComponent(b.dataset.sedit));
      editing = { id: data.id, title: data.title || '', category: data.category || '', language: data.language || '', install: data.install || '', description: data.description || '', code: data.code || '' };
      render();
    } catch (err) { toast(err.message); b.disabled = false; }
  }));

  document.querySelectorAll('[data-sdel]').forEach((b) => (b.onclick = async () => {
    const c = SN.find((x) => x.id === b.dataset.sdel);
    if (!confirm(`Hapus “${c?.title || 'snippet'}”? Tindakan ini tidak bisa dibatalkan.`)) return;
    try { await snCall('delete', { method: 'POST', body: { id: b.dataset.sdel } }); SN = SN.filter((x) => x.id !== b.dataset.sdel); resetSnippetCache(); render(); toast('Snippet dihapus'); }
    catch (err) { toast(err.message); }
  }));

  if (!editing) return;
  const map = { 's-title': 'title', 's-category': 'category', 's-language': 'language', 's-install': 'install', 's-description': 'description', 's-code': 'code' };
  const count = () => { const v = $('s-code').value; $('s-cnt').textContent = `${v ? v.split('\n').length : 0} baris · ${v.length.toLocaleString('id-ID')} karakter`; };
  for (const [id, key] of Object.entries(map)) $(id).oninput = () => { editing[key] = $(id).value; if (id === 's-code') count(); };
  count();
  const close = () => { if (snSaving) return; editing = null; render(); };
  document.querySelectorAll('[data-sclose]').forEach((el) => (el.onclick = close));
  $('sform').onkeydown = (ev) => { if (ev.key === 'Escape') close(); if ((ev.ctrlKey || ev.metaKey) && ev.key === 's') { ev.preventDefault(); $('sform').requestSubmit(); } };
  $('sform').onsubmit = async (ev) => {
    ev.preventDefault();
    const e = editing; snSaving = true; $('s-save').disabled = true; $('s-save').textContent = 'Menyimpan…';
    try {
      await snCall('save', { method: 'POST', body: { id: e.id || undefined, title: e.title, category: e.category, language: e.language, install: e.install, description: e.description, code: e.code } });
      toast(e.id ? 'Perubahan disimpan' : 'Snippet ditambahkan');
      editing = null; snSaving = false; resetSnippetCache(); SN = null; await loadSnippets();
    } catch (err) { snSaving = false; toast(err.message); render(); }
  };
}


/* =========================================================
   TAB PENGGUNA — daftar akun Google, limit harian, blokir
   ========================================================= */
let UL = null; let ulBusy = false; let ulErr = ''; let ulQ = ''; let ulDefault = 100;

async function ulCall(path, { method = 'GET', body } = {}) {
  const r = await fetch('/api/auth/' + path, { method, headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: body ? JSON.stringify(body) : undefined });
  const d = await r.json().catch(() => ({}));
  if (r.status === 401 && token) logout();
  if (!r.ok || d.status === false) throw new Error(d.message || 'Permintaan gagal (' + r.status + ')');
  return d;
}
async function loadUsers() {
  ulBusy = true; ulErr = '';
  try { const d = await ulCall('admin-users'); UL = d.data || []; ulDefault = d.defaultLimit || 100; } catch (e) { UL = []; ulErr = e.message; }
  ulBusy = false;
  if (tab === 'users' && S) render();
}

function usersTab() {
  const list = (UL || []).filter((u) => !ulQ || `${u.name} ${u.email}`.toLowerCase().includes(ulQ.toLowerCase()));
  const rows = list.map((u) => {
    const pct = Math.min(100, Math.round((u.used / u.limit) * 100));
    return `<div class="grid items-center gap-3 border-b-2 hair px-4 py-3 last:border-0 sm:grid-cols-[minmax(0,1fr)_auto]">
      <div class="flex min-w-0 items-center gap-3">${u.picture ? `<img src="${esc(u.picture)}" alt="" referrerpolicy="no-referrer" class="h-10 w-10 shrink-0 rounded-full border-2 border-ink object-cover">` : `<span class="iconbox h-10 w-10 shrink-0" ${tile('lilac')}>${icon('User', 'h-4 w-4')}</span>`}
        <div class="min-w-0"><b class="block truncate text-sm">${esc(u.name)}${u.banned ? ' <span class="badge" style="background:rgb(var(--red));color:#fff">diblokir</span>' : ''}</b>
        <span class="block truncate text-[11px] text-dim">${esc(u.email)}</span>
        <span class="mt-1 block text-[11px] text-muted">${u.used} / ${u.limit} hari ini (${pct}%) · total ${u.total}${u.customLimit ? ' · limit khusus' : ''}</span></div></div>
      <div class="flex gap-2"><button class="chip" data-ulimit="${esc(u.id)}" data-cur="${u.customLimit || 0}">${icon('Gauge', 'h-3.5 w-3.5')}Limit</button><button class="chip" data-uban="${esc(u.id)}" data-banned="${u.banned ? 1 : 0}" ${u.banned ? '' : 'style="background:rgb(var(--red));color:#fff"'}>${u.banned ? 'Buka blokir' : 'Blokir'}</button></div></div>`;
  }).join('');
  const empty = UL === null || ulBusy ? '<p class="p-6 text-sm text-muted">Memuat pengguna…</p>'
    : ulErr ? `<p class="p-6 text-sm font-bold text-red">${esc(ulErr)}</p>`
    : `<p class="p-6 text-sm text-muted">${UL.length ? 'Tidak ada pengguna yang cocok.' : 'Belum ada yang login.'}</p>`;
  return `<div class="mb-4 grid gap-3 sm:grid-cols-[1fr_auto]"><input class="input" type="search" id="uq" placeholder="Cari nama atau email" value="${esc(ulQ)}" aria-label="Cari pengguna"><button class="btn btn-ghost" id="urefresh">${icon('RefreshCw', 'h-4 w-4')}Muat ulang</button></div>
  <section class="card" id="ulist">${rows || empty}</section>
  <p class="mt-3 text-xs leading-5 text-muted">${UL ? UL.length : 0} pengguna · limit bawaan <b>${ulDefault}</b> request/hari (env <code class="font-mono">USER_DAILY_LIMIT</code>). “Limit” mengatur batas khusus per user; isi 0 untuk kembali ke bawaan.</p>`;
}

function bindUsers() {
  const $ = (id) => document.getElementById(id);
  const qi = $('uq');
  if (qi) qi.oninput = () => { ulQ = qi.value; const pos = qi.selectionStart; render(); const n = $('uq'); n.focus(); n.setSelectionRange(pos, pos); };
  $('urefresh')?.addEventListener('click', () => { UL = null; render(); });
  document.querySelectorAll('[data-ulimit]').forEach((b) => (b.onclick = async () => {
    const v = prompt('Limit request per hari untuk user ini (0 = pakai bawaan ' + ulDefault + '):', b.dataset.cur);
    if (v === null) return;
    try { await ulCall('admin-user', { method: 'POST', body: { id: b.dataset.ulimit, limit: Number(v) } }); toast('Limit diperbarui'); UL = null; render(); }
    catch (err) { toast(err.message); }
  }));
  document.querySelectorAll('[data-uban]').forEach((b) => (b.onclick = async () => {
    const ban = b.dataset.banned !== '1';
    if (ban && !confirm('Blokir user ini? Dia tidak bisa memakai endpoint sampai dibuka kembali.')) return;
    try { await ulCall('admin-user', { method: 'POST', body: { id: b.dataset.uban, banned: ban } }); toast(ban ? 'User diblokir' : 'Blokir dibuka'); UL = null; render(); }
    catch (err) { toast(err.message); }
  }));
}

if (token) load(); else renderLogin();
