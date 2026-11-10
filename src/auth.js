import { esc, icon, refreshIcons, copyText } from './utils.js';

/* =========================================================
   AUTH — login Google, sesi, dan kuota per user
   Website  : header x-user-token dikirim otomatis (setelah login)
   Bot      : ?apikey=sam_xxx di URL
   ========================================================= */

const TOKEN_KEY = 'samapi_token';
const USER_KEY = 'samapi_user';

const ls = {
  get: (k) => { try { return localStorage.getItem(k) || ''; } catch { return ''; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* diblokir */ } },
  del: (k) => { try { localStorage.removeItem(k); } catch { /* diblokir */ } },
};

export const auth = {
  token: ls.get(TOKEN_KEY),
  user: (() => { try { return JSON.parse(ls.get(USER_KEY) || 'null'); } catch { return null; } })(),
  cfg: null,
  ready: false,
};
export const hooks = {}; // hooks.tryRefresh diisi halaman docs
const listeners = new Set();
export const onAuth = (fn) => listeners.add(fn);
const emit = () => { paintAuth(); listeners.forEach((f) => f()); };

export const authHeaders = () => (auth.token ? { 'x-user-token': auth.token } : {});
export const isLoggedIn = () => !!(auth.token && auth.user);

function setSession(token, user) {
  auth.token = token ?? auth.token;
  auth.user = user;
  ls.set(TOKEN_KEY, auth.token);
  ls.set(USER_KEY, JSON.stringify({ name: user.name, picture: user.picture, email: user.email, apikey: user.apikey, limit: user.limit, used: user.used }));
}
function clearSession() { auth.token = ''; auth.user = null; ls.del(TOKEN_KEY); ls.del(USER_KEY); }

async function post(path, body) {
  const r = await fetch('/api/auth/' + path, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(body || {}) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok || d.status === false) { const e = new Error(d.message || `Permintaan gagal (${r.status})`); e.status = r.status; throw e; }
  return d;
}

export async function refreshUser() {
  if (!auth.token) return null;
  try {
    const r = await fetch('/api/auth/me', { headers: authHeaders(), cache: 'no-store' });
    const d = await r.json().catch(() => ({}));
    if (r.status === 401 || r.status === 403) { clearSession(); emit(); return null; }
    if (r.ok && d.user) { setSession(auth.token, d.user); emit(); return d.user; }
  } catch { /* offline: pakai cache */ }
  return auth.user;
}

export async function initAuth() {
  try {
    const r = await fetch('/api/auth/config', { cache: 'no-store' });
    auth.cfg = await r.json();
  } catch { auth.cfg = { enabled: false }; }
  auth.ready = true;
  if (auth.token) await refreshUser(); else emit();
}

export async function regenerateKey() {
  const d = await post('regenerate');
  setSession(auth.token, d.user);
  emit();
  return d.user;
}

export function logout() {
  clearSession();
  try { window.google?.accounts?.id?.disableAutoSelect(); } catch { /* abaikan */ }
  emit();
  toast('Kamu sudah keluar');
}

/* ---------- toast ---------- */
export function toast(msg) {
  document.getElementById('toast')?.remove();
  const el = document.createElement('div');
  el.id = 'toast'; el.className = 'toast'; el.setAttribute('role', 'status');
  el.textContent = msg;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('in'));
  setTimeout(() => { el.classList.remove('in'); setTimeout(() => el.remove(), 400); }, 2600);
}

/* ---------- Google Identity Services ---------- */
let gsiPromise = null;
const loadGsi = () => gsiPromise ||= new Promise((resolve, reject) => {
  if (window.google?.accounts?.id) return resolve();
  const s = document.createElement('script');
  s.src = 'https://accounts.google.com/gsi/client'; s.async = true; s.defer = true;
  s.onload = () => resolve(); s.onerror = () => { gsiPromise = null; reject(new Error('Tidak bisa memuat Google. Periksa koneksi internet.')); };
  document.head.appendChild(s);
});

async function onCredential(resp) {
  const msg = document.getElementById('login-msg');
  try {
    if (msg) { msg.textContent = 'Memverifikasi akun…'; msg.className = 'mt-4 text-center text-xs font-bold text-muted'; }
    const d = await post('google', { credential: resp.credential });
    setSession(d.token, d.user);
    closeLogin();
    emit();
    toast(`Halo, ${d.user.name.split(' ')[0]}! Kamu sudah login.`);
  } catch (e) {
    if (msg) { msg.textContent = e.message; msg.className = 'mt-4 text-center text-xs font-bold text-red-400'; }
  }
}

export function closeLogin() {
  const m = document.getElementById('login-modal');
  if (!m) return;
  m.classList.remove('in');
  setTimeout(() => m.remove(), 300);
  document.removeEventListener('keydown', escClose);
}
const escClose = (e) => { if (e.key === 'Escape') closeLogin(); };

export async function openLogin(reason = '') {
  if (document.getElementById('login-modal')) return;
  if (!auth.ready) await initAuth();
  const limit = auth.cfg?.dailyLimit || 100;
  const enabled = !!auth.cfg?.enabled && !!auth.cfg?.clientId;
  const m = document.createElement('div');
  m.id = 'login-modal'; m.className = 'amodal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-labelledby', 'login-title');
  m.innerHTML = `<div class="amodal-bg" data-lclose></div>
    <div class="amodal-box card relative w-full max-w-md p-6 sm:p-8">
      <button data-lclose class="iconbtn absolute right-4 top-4" aria-label="Tutup">${icon('X', 'h-4 w-4')}</button>
      <span class="iconbox mb-5 h-14 w-14" style="--tile:rgb(var(--yellow));--tile-fg:#14102b">${icon('LockOpen', 'h-6 w-6')}</span>
      <h2 id="login-title" class="text-2xl">Masuk ke SamApi</h2>
      <p class="mt-2 text-sm leading-6 text-muted">${esc(reason) || 'Login dengan Google untuk membuka semua endpoint. Kamu langsung mendapat API key pribadi.'}</p>
      <ul class="mt-5 grid gap-2 text-[13px] font-semibold text-muted">
        <li class="flex items-center gap-2.5">${icon('Check', 'h-4 w-4 shrink-0 text-ok')} Semua endpoint terbuka, tinggal klik “Send request”</li>
        <li class="flex items-center gap-2.5">${icon('Check', 'h-4 w-4 shrink-0 text-ok')} API key pribadi untuk bot &amp; script</li>
        <li class="flex items-center gap-2.5">${icon('Check', 'h-4 w-4 shrink-0 text-ok')} Kuota ${limit} request per hari, gratis</li>
      </ul>
      <div class="mt-6 flex min-h-[44px] justify-center" id="g-btn">${enabled ? '<div class="skeleton !bg-fg/10 h-11 w-64 !rounded-full"></div>' : ''}</div>
      <p id="login-msg" class="mt-4 text-center text-xs font-bold ${enabled ? 'text-muted' : 'text-red-400'}">${enabled ? '' : 'Login belum aktif: GOOGLE_CLIENT_ID belum diatur di server.'}</p>
    </div>`;
  document.body.appendChild(m);
  refreshIcons();
  requestAnimationFrame(() => m.classList.add('in'));
  m.addEventListener('click', (e) => { if (e.target.closest('[data-lclose]')) closeLogin(); });
  document.addEventListener('keydown', escClose);
  if (!enabled) return;
  try {
    await loadGsi();
    window.google.accounts.id.initialize({ client_id: auth.cfg.clientId, callback: onCredential, auto_select: false, cancel_on_tap_outside: true });
    const holder = document.getElementById('g-btn');
    if (!holder) return;
    holder.innerHTML = '';
    window.google.accounts.id.renderButton(holder, { theme: 'outline', size: 'large', shape: 'pill', text: 'continue_with', logo_alignment: 'left', width: Math.min(300, window.innerWidth - 90) });
  } catch (e) {
    const msg = document.getElementById('login-msg');
    if (msg) { msg.textContent = e.message; msg.className = 'mt-4 text-center text-xs font-bold text-red-400'; }
    const holder = document.getElementById('g-btn'); if (holder) holder.innerHTML = '';
  }
}

/* ---------- tombol akun (navbar) ---------- */
export const avatar = (u, cls = 'h-9 w-9') => {
  const fb = `<span class="${cls} grid place-items-center rounded-full border-2 border-ink bg-yellow text-sm font-extrabold text-[rgb(20_16_43)]">${esc((u?.name || '?').trim().charAt(0).toUpperCase())}</span>`;
  return u?.picture
    ? `<img src="${esc(u.picture)}" alt="" referrerpolicy="no-referrer" class="${cls} rounded-full border-2 border-ink object-cover" data-fb="${esc(fb)}" onerror="this.onerror=null;this.outerHTML=this.dataset.fb">`
    : fb;
};

export function accountBtnHtml() {
  const u = isLoggedIn() ? auth.user : null;
  if (u) return `<button data-nav="/profile" class="acct" aria-label="Profil ${esc(u.name)}" title="${esc(u.name)}">${avatar(u, 'h-full w-full')}</button>`;
  return `<button data-login class="iconbtn sm:hidden" aria-label="Login">${icon('User', 'h-[17px] w-[17px]')}</button><button data-login class="btn btn-ghost btn-sm hidden sm:inline-flex">${icon('LogIn', 'h-3.5 w-3.5')} Login</button>`;
}

export function mobileAccountHtml() {
  const u = isLoggedIn() ? auth.user : null;
  if (u) {
    const pct = Math.min(100, Math.round(((u.used || 0) / (u.limit || 100)) * 100));
    return `<button data-nav="/profile" class="mrow w-full"><span class="shrink-0">${avatar(u, 'h-10 w-10')}</span><span class="min-w-0 flex-1 text-left"><span class="block truncate text-[15px] font-extrabold leading-5">${esc(u.name)}</span><span class="mt-0.5 block truncate text-[11px] font-semibold leading-4 text-muted">Profil &amp; API key · ${pct}% kuota terpakai</span></span>${icon('ChevronRight', 'h-4 w-4 text-dim')}</button>`;
  }
  return `<button data-login class="mrow w-full"><span class="iconbox h-10 w-10 shrink-0" style="--tile:rgb(var(--yellow));--tile-fg:#14102b">${icon('LogIn', 'h-5 w-5')}</span><span class="min-w-0 flex-1 text-left"><span class="block text-[15px] font-extrabold leading-5">Login dengan Google</span><span class="mt-0.5 block text-[11px] font-semibold leading-4 text-muted">Buka semua endpoint &amp; dapatkan API key</span></span></button>`;
}

/* ---------- panel “Try this API” ---------- */
export function tryAuthHtml() {
  if (!isLoggedIn()) {
    return `<div class="mb-5 flex flex-col gap-3 rounded-2xl border-2 border-dashed border-ink bg-yellow/20 p-4 sm:flex-row sm:items-center">
      <span class="iconbox h-10 w-10 shrink-0" style="--tile:rgb(var(--yellow));--tile-fg:#14102b">${icon('Lock', 'h-4 w-4')}</span>
      <div class="min-w-0 flex-1"><p class="text-sm font-extrabold">Login untuk memakai endpoint</p><p class="mt-0.5 text-xs leading-5 text-muted">Masuk dengan Google, lalu endpoint terbuka otomatis. Gratis, ada API key pribadi.</p></div>
      <button data-login class="btn btn-gold btn-sm w-full sm:w-auto">${icon('LogIn', 'h-3.5 w-3.5')} Login</button></div>`;
  }
  const u = auth.user; const left = Math.max(0, (u.limit || 0) - (u.used || 0));
  return `<div class="mb-5 flex items-center gap-3 rounded-2xl border-2 border-ink bg-green/25 px-4 py-3">
    <span class="shrink-0">${avatar(u, 'h-9 w-9')}</span>
    <div class="min-w-0 flex-1"><p class="truncate text-sm font-extrabold">${esc(u.name)}</p><p class="text-xs text-muted">Endpoint terbuka · sisa kuota hari ini <b class="text-fg">${left}</b> / ${u.limit}</p></div>
    <button data-nav="/profile" class="btn btn-ghost btn-sm !px-3">Profil</button></div>`;
}

/** Perbarui bagian UI yang bergantung pada status login tanpa me-render ulang seluruh halaman. */
export function paintAuth() {
  document.querySelectorAll('[data-acct-slot]').forEach((el) => { el.innerHTML = accountBtnHtml(); });
  document.querySelectorAll('[data-macct-slot]').forEach((el) => { el.innerHTML = mobileAccountHtml(); });
  const t = document.getElementById('try-auth');
  if (t) t.innerHTML = tryAuthHtml();
  hooks.tryRefresh?.();
  refreshIcons();
}

/* ---------- salin helper dipakai profil ---------- */
export async function copyWithFlash(btn, text, doneHtml) {
  try { await copyText(text); } catch { return; }
  if (btn.dataset.busy) return;
  btn.dataset.busy = '1';
  const old = btn.innerHTML;
  btn.innerHTML = doneHtml;
  refreshIcons();
  setTimeout(() => { btn.innerHTML = old; delete btn.dataset.busy; refreshIcons(); }, 1600);
}
