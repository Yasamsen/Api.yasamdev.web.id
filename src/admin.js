import { apiDefinitions } from './apis/registry.js';

const $app = document.getElementById('app');
const $toast = document.getElementById('toast');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const slugOf = (a) => a.endpoint.replace(/^\/api\//, '');
const LIST = apiDefinitions.map((a) => ({ key: slugOf(a), name: a.name, category: a.category, path: a.endpoint }));

let token = sessionStorage.getItem('admin_token') || '';
let S = null;             // state dari server
let tab = 'endpoint';
let q = ''; let cat = ''; let newKey = '';

function toast(t) { $toast.textContent = t; $toast.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => $toast.classList.remove('show'), 1800); }

async function call(path, body) {
  const r = await fetch('/api/admin/' + path, {
    method: body ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: body ? JSON.stringify(body) : undefined
  });
  const d = await r.json().catch(() => ({}));
  if (r.status === 401 && token) { logout(); }
  if (!r.ok) throw new Error(d.message || 'Permintaan gagal (' + r.status + ')');
  return d;
}
function logout() { token = ''; sessionStorage.removeItem('admin_token'); S = null; render(); }

function renderLogin(msg = '') {
  $app.innerHTML = `<div class="box login"><h1>Admin SamApi</h1><p style="color:var(--muted);margin:4px 0 0">Masukkan password untuk melanjutkan.</p>
  <form id="f"><input type="password" id="pw" placeholder="Password" autocomplete="current-password" required autofocus><button class="btn">Masuk</button><div class="msg" id="m">${esc(msg)}</div></form></div>`;
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

async function load() {
  try { S = await call('state'); render(); } catch (err) { renderLogin(err.message); }
}

function rowHtml(e) {
  const r = S.endpoints[e.key] || { status: 'ok', message: '', locked: false };
  return `<div class="row" data-k="${esc(e.key)}">
    <div style="min-width:0"><b>${esc(e.name)}</b> ${r.status === 'error' ? '<span class="tag err">Error</span>' : ''}${r.locked ? ' <span class="tag lck">Dikunci</span>' : ''}<small>${esc(e.path)}</small></div>
    <select data-f="status" aria-label="Status ${esc(e.name)}"><option value="ok" ${r.status !== 'error' ? 'selected' : ''}>Normal</option><option value="error" ${r.status === 'error' ? 'selected' : ''}>Error</option></select>
    <input type="text" data-f="message" maxlength="300" placeholder="${r.status === 'error' ? 'Pesan untuk pengguna' : 'Pesan error (opsional)'}" value="${esc(r.message)}" aria-label="Pesan ${esc(e.name)}">
    <label class="sw"><input type="checkbox" data-f="locked" ${r.locked ? 'checked' : ''}>Kunci</label></div>`;
}

function render() {
  if (!token || !S) return renderLogin();
  const cats = [...new Set(LIST.map((e) => e.category))];
  const nErr = Object.values(S.endpoints).filter((r) => r.status === 'error').length;
  const nLck = Object.values(S.endpoints).filter((r) => r.locked).length;
  const shown = LIST.filter((e) => (!cat || e.category === cat) && (!q || (e.name + e.path).toLowerCase().includes(q.toLowerCase())));
  const lockedList = LIST.filter((e) => S.endpoints[e.key]?.locked);
  $app.innerHTML = `
  <div class="top"><h1>Admin SamApi</h1><div style="display:flex;gap:8px"><a class="btn alt" href="/" style="text-decoration:none">Lihat situs</a><button class="btn alt" id="out">Keluar</button></div></div>
  ${S.persistent ? '' : '<div class="notice">URLDATABASE belum diatur, jadi pengaturan hanya tersimpan di memori dan bisa hilang saat server restart. Isi URLDATABASE (MongoDB) di Vercel agar permanen.</div>'}
  <div class="stats"><div class="box stat"><b>${LIST.length}</b>endpoint</div><div class="box stat"><b>${nErr}</b>error</div><div class="box stat"><b>${nLck}</b>dikunci</div><div class="box stat"><b>${S.keys.length}</b>API key</div></div>
  <div class="tabs"><button class="btn ${tab === 'endpoint' ? 'on' : 'alt'}" data-tab="endpoint">Endpoint</button><button class="btn ${tab === 'keys' ? 'on' : 'alt'}" data-tab="keys">API key</button></div>
  ${tab === 'endpoint' ? `
  <div class="tools"><input type="search" id="q" placeholder="Cari endpoint" value="${esc(q)}" aria-label="Cari endpoint"><select id="cat" aria-label="Kategori"><option value="">Semua kategori</option>${cats.map((c) => `<option ${c === cat ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select></div>
  <div class="box" id="list">${shown.map(rowHtml).join('') || '<p style="padding:16px;margin:0">Tidak ada endpoint yang cocok.</p>'}</div>
  <p style="color:var(--muted);font-size:12px">Perubahan tersimpan otomatis. Endpoint berstatus Error menjawab pengguna dengan HTTP 503 dan pesan di atas. Endpoint yang dikunci butuh API key. Admin yang login tetap bisa mengakses semuanya.</p>` : `
  <div class="box" style="padding:16px;margin-bottom:14px"><h2 style="font-size:16px">Buat API key</h2>
    <div class="tools" style="margin-top:10px"><input type="text" id="kn" maxlength="60" placeholder="Nama key, mis. Aplikasi Budi"><select id="ks"><option value="*">Semua endpoint yang dikunci</option><option value="pick">Pilih endpoint tertentu</option></select><button class="btn" id="kc" style="flex:0 0 auto">Buat key</button></div>
    <div id="pick" class="scopes" hidden>${lockedList.length ? lockedList.map((e) => `<label><input type="checkbox" value="${esc(e.key)}">${esc(e.name)}</label>`).join('') : 'Belum ada endpoint yang dikunci. Kunci dulu di tab Endpoint.'}</div>
    ${newKey ? `<div class="notice" style="margin:12px 0 0">Salin key ini sekarang, tidak akan ditampilkan lagi.<div class="newkey"><code>${esc(newKey)}</code><button class="btn sm" id="cp">Salin</button></div></div>` : ''}</div>
  <div class="box">${S.keys.map((k) => `<div class="keyrow"><div><b>${esc(k.name)}</b> ${k.active ? '' : '<span class="tag err">Nonaktif</span>'}<small style="color:var(--muted);font-family:ui-monospace,monospace">${esc(k.prefix)}… · ${k.scopes.includes('*') ? 'semua endpoint terkunci' : esc(k.scopes.join(', '))}</small></div>
    <div style="display:flex;gap:6px"><button class="btn alt sm" data-kt="${k.id}">${k.active ? 'Nonaktifkan' : 'Aktifkan'}</button><button class="btn red sm" data-kd="${k.id}">Hapus</button></div></div>`).join('') || '<p style="padding:16px;margin:0">Belum ada API key.</p>'}</div>
  <p style="color:var(--muted);font-size:12px">Pengguna memakai key lewat <code>?apikey=KEY</code> atau header <code>x-api-key</code>.</p>`}`;
  bind();
}

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
    document.querySelectorAll('#list .row').forEach((row) => {
      const save = () => {
        const status = row.querySelector('[data-f=status]').value;
        const message = row.querySelector('[data-f=message]').value.trim();
        const locked = row.querySelector('[data-f=locked]').checked;
        if (status === 'error' && !message) { toast('Isi pesan untuk pengguna dulu.'); row.querySelector('[data-f=message]').focus(); return; }
        const keep = document.activeElement?.dataset?.f;
        act('endpoint', { slug: row.dataset.k, status, message, locked }, 'Tersimpan').then(() => { if (keep === 'message') document.querySelector(`[data-k="${CSS.escape(row.dataset.k)}"] [data-f=message]`)?.focus(); });
      };
      row.querySelectorAll('[data-f=status],[data-f=locked]').forEach((el) => (el.onchange = save));
      row.querySelector('[data-f=message]').onchange = save;
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
