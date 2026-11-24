import { esc, icon, refreshIcons } from './utils.js';
import { auth, authHeaders, isLoggedIn, openLogin, refreshUser } from './auth.js';

/* =========================================================
   WEB2APK — /web2apk
   Tampilan UI untuk endpoint POST /api/web2apk (JSON).
   Build memakai kuota (3); cek progres & unduh gratis.
   ========================================================= */

const JOB_KEY = 'samapi_w2a_job';
const POLL_MS = 6000;
const MAX_WAIT_MS = 15 * 60 * 1000;
const STEPS = ['Terkirim', 'Antre', 'Membangun', 'Siap'];
const STATE_STEP = { waiting: 1, queued: 1, in_progress: 2, success: 4 };

// state modul: bertahan saat halaman dirender ulang (ganti tema, dll.)
const W = { phase: 'form', step: 0, message: '', error: '', errTitle: '', downloadUrl: '', statusPath: '', name: '', startedAt: 0, form: { url: '', appName: '', iconUrl: '' } };
let runId = 0;
let timer = null;

const isHttps = (v) => { try { const u = new URL(v); return u.protocol === 'https:' && !!u.hostname && !u.username && !u.password; } catch { return false; } };
const saveJob = () => { try { sessionStorage.setItem(JOB_KEY, JSON.stringify({ statusPath: W.statusPath, name: W.name, startedAt: W.startedAt })); } catch { /* diblokir */ } };
const clearJob = () => { try { sessionStorage.removeItem(JOB_KEY); } catch { /* diblokir */ } };

/* ---------- tampilan ---------- */

function stepsHtml(cur) {
  return `<ol class="grid grid-cols-4 gap-1 text-center" aria-label="Tahap build">${STEPS.map((l, i) => {
    const done = i < cur; const now = i === cur;
    return `<li class="flex flex-col items-center gap-1.5 text-[11px] font-bold ${done || now ? 'text-fg' : 'text-dim'}">
      <span class="grid h-8 w-8 place-items-center rounded-full border-[2.5px] border-ink text-xs font-extrabold ${done ? 'bg-green text-[rgb(20_16_43)]' : now ? 'bg-yellow text-[rgb(20_16_43)]' : 'bg-surface'}">${done ? icon('Check', 'h-4 w-4') : i + 1}</span>${l}</li>`;
  }).join('')}</ol>`;
}

const guideHtml = `<div class="mt-6 border-t-2 hair pt-5 text-left"><h3 class="mb-2 text-base">Cara memasang di Android</h3>
  <ol class="grid list-decimal gap-1.5 pl-5 text-[13px] leading-6 text-muted">
    <li>Ketuk <b class="text-fg">Download APK</b>. Jika browser menanyakan keamanan file, pilih <b class="text-fg">Tetap download</b>.</li>
    <li>Buka file dari notifikasi unduhan atau aplikasi <b class="text-fg">File/Download</b>.</li>
    <li>Jika muncul larangan memasang dari sumber ini, ketuk <b class="text-fg">Setelan</b> lalu aktifkan <b class="text-fg">Izinkan dari sumber ini</b>.</li>
    <li>Ketuk <b class="text-fg">Instal</b>. Jika ada peringatan Play Protect, pilih <b class="text-fg">Tetap instal</b>.</li>
  </ol></div>`;

function formHtml() {
  const f = W.form; const u = auth.user;
  const left = u ? Math.max(0, (u.limit || 0) - (u.used || 0)) : 0;
  return `<form id="w2a-form" class="grid gap-4" novalidate>
    <div><label class="block text-xs font-extrabold" for="w2a-url">URL website (HTTPS)</label>
      <input class="input mt-1.5" id="w2a-url" name="url" type="url" inputmode="url" autocomplete="off" placeholder="https://contoh.com" value="${esc(f.url)}" required></div>
    <div><label class="block text-xs font-extrabold" for="w2a-name">Nama aplikasi</label>
      <input class="input mt-1.5" id="w2a-name" name="appName" maxlength="40" autocomplete="off" placeholder="Aplikasi Saya" value="${esc(f.appName)}" required></div>
    <div><label class="block text-xs font-extrabold" for="w2a-icon">URL ikon (PNG/JPG, HTTPS)</label>
      <div class="mt-1.5 flex items-center gap-2.5">
        <span class="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl border-2 border-ink bg-surface" id="w2a-prev">${f.iconUrl && isHttps(f.iconUrl) ? `<img src="${esc(f.iconUrl)}" alt="" referrerpolicy="no-referrer" class="h-full w-full object-cover" onerror="this.remove()">` : icon('Image', 'h-5 w-5 text-dim')}</span>
        <input class="input min-w-0 flex-1" id="w2a-icon" name="iconUrl" type="url" inputmode="url" autocomplete="off" placeholder="https://contoh.com/ikon.png" value="${esc(f.iconUrl)}" required>
      </div>
      <button type="button" id="w2a-fav" class="mt-2 text-xs font-bold text-gold underline underline-offset-2">Pakai favicon dari website</button></div>
    <p id="w2a-err" class="min-h-[1.25rem] text-xs font-bold text-red-400" role="alert">${esc(W.error)}</p>
    <div class="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-xs leading-5 text-muted">${icon('Coins', 'mr-1 inline h-3.5 w-3.5 align-[-2px]')}Membuat APK memakai <b class="text-fg">3 kuota</b>${u ? ` · sisa kuota hari ini <b class="text-fg">${left}</b>` : ''}. Cek progres dan unduh gratis.</p>
      <button class="btn btn-gold w-full sm:w-auto" id="w2a-go">${icon('Smartphone', 'h-4 w-4')} Buat APK</button>
    </div>
  </form>`;
}

function progressHtml() {
  if (W.phase === 'done') {
    return `<div class="text-center">
      <span class="iconbox mx-auto mb-4 h-14 w-14" style="--tile:rgb(var(--green));--tile-fg:#14102b">${icon('PartyPopper', 'h-6 w-6')}</span>
      <h2 class="text-2xl">APK siap diunduh!</h2>
      <p class="mx-auto mt-2 max-w-sm text-sm text-muted">${esc(W.message || 'File APK sudah selesai dibuat.')}</p>
      <div class="mx-auto mt-6 max-w-xs">${stepsHtml(4)}</div>
      <a href="${esc(W.downloadUrl)}" class="btn btn-gold mt-6 w-full sm:w-auto" download>${icon('Download', 'h-4 w-4')} Download APK</a>
      <button id="w2a-new" class="btn btn-ghost btn-sm mt-3 w-full sm:ml-2 sm:mt-6 sm:w-auto">Buat APK lain</button>
      ${guideHtml}</div>`;
  }
  if (W.phase === 'error') {
    return `<div class="text-center">
      <span class="iconbox mx-auto mb-4 h-14 w-14" style="--tile:rgb(var(--red));--tile-fg:#fff">${icon('AlertTriangle', 'h-6 w-6')}</span>
      <h2 class="text-2xl">${esc(W.errTitle || 'Build gagal')}</h2>
      <p class="mx-auto mt-2 max-w-sm text-sm text-muted">${esc(W.message)}</p>
      <button id="w2a-new" class="btn btn-gold mt-6 w-full sm:w-auto">${icon('RotateCcw', 'h-4 w-4')} Coba lagi</button></div>`;
  }
  return `<div class="text-center">
    <span class="iconbox mx-auto mb-4 h-14 w-14" style="--tile:rgb(var(--yellow));--tile-fg:#14102b">${icon('Hammer', 'h-6 w-6')}</span>
    <h2 class="text-2xl">Sedang membuat APK…</h2>
    <p class="mx-auto mt-2 max-w-sm text-sm text-muted" aria-live="polite">${esc(W.message || 'Mohon tunggu beberapa menit. Halaman ini diperbarui otomatis, jangan ditutup.')}</p>
    <div class="mx-auto mt-6 max-w-sm">${stepsHtml(W.step)}</div>
    <div class="meter indet mx-auto mt-5 max-w-sm" role="progressbar" aria-label="Sedang membangun"><span></span></div></div>`;
}

function panelHtml() {
  if (!isLoggedIn()) {
    return `<div class="text-center"><span class="iconbox mx-auto mb-5 h-14 w-14" style="--tile:rgb(var(--yellow));--tile-fg:#14102b">${icon('Lock', 'h-6 w-6')}</span>
      <h2 class="text-xl">Login dulu untuk membuat APK</h2>
      <p class="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">Masuk dengan Google. Gratis, dan kamu langsung mendapat kuota harian.</p>
      <button data-login class="btn btn-gold mt-6 w-full sm:w-auto">${icon('LogIn', 'h-4 w-4')} Login dengan Google</button></div>`;
  }
  return W.phase === 'form' ? formHtml() : progressHtml();
}

export function renderWeb2apk() {
  return `<main class="mx-auto max-w-2xl px-4 pb-24 pt-[calc(var(--nav-h)+32px)] sm:px-8 sm:pt-[calc(var(--nav-h)+64px)]">
    <button data-nav="/docs/web2apk" class="btn btn-ghost btn-sm mb-6">${icon('ArrowLeft', 'h-4 w-4')} Dokumentasi API</button>
    <p class="seq sticker mb-5 text-sm" style="--d:.05s">${icon('Smartphone', 'h-4 w-4')} Web2APK</p>
    <h1 class="text-balance text-[clamp(2rem,7vw,3.5rem)] leading-[1.03]"><span class="hl"><span style="--d:.15s">Website jadi</span></span> <span class="hl"><span class="text-gold" style="--d:.3s">aplikasi Android.</span></span></h1>
    <p class="seq mt-5 max-w-lg text-[15px] leading-7 text-muted" style="--d:.45s">Isi tiga kolom, tunggu beberapa menit, lalu unduh APK-nya. Tanpa coding dan tanpa JSON.</p>
    <section id="w2a-panel" class="card seq mt-8 p-5 sm:p-8" style="--d:.55s" aria-live="polite">${panelHtml()}</section>
    <p class="mt-5 text-xs leading-5 text-dim">Untuk bot atau script, gunakan endpoint <code class="font-mono font-bold text-muted">POST /api/web2apk</code> dengan <code class="font-mono font-bold text-muted">apikey</code>. Lihat dokumentasi API.</p>
  </main>`;
}

/* ---------- logika ---------- */

function paint() {
  const el = document.getElementById('w2a-panel');
  if (!el) return false;
  el.innerHTML = panelHtml();
  refreshIcons();
  return true;
}

function stopPolling() { if (timer) clearTimeout(timer); timer = null; runId++; }

function poll(id) {
  if (id !== runId) return;
  if (!document.getElementById('w2a-panel')) { timer = null; return; } // halaman sudah ditinggalkan
  if (Date.now() - W.startedAt > MAX_WAIT_MS) {
    W.phase = 'error'; W.errTitle = 'Terlalu lama'; W.error = ''; W.message = 'Build belum selesai dalam 15 menit. Coba buat ulang beberapa saat lagi.'; clearJob(); paint(); return;
  }
  fetch(W.statusPath, { cache: 'no-store' })
    .then((r) => r.json())
    .then((j) => {
      if (id !== runId) return;
      if (!j?.status) { W.message = j?.message || 'Memeriksa status…'; }
      else {
        const d = j.data || {};
        W.step = STATE_STEP[d.state] ?? W.step ?? 1;
        W.message = d.message || W.message;
        if (d.state === 'success') { W.phase = 'done'; W.downloadUrl = d.downloadUrl; clearJob(); paint(); return; }
        if (d.state === 'failed' || d.state === 'ready-expired') {
          W.phase = 'error'; W.errTitle = d.state === 'failed' ? 'Build gagal' : 'File kedaluwarsa'; W.error = ''; W.message = d.message || 'Silakan buat ulang.'; clearJob(); paint(); return;
        }
      }
      paint(); timer = setTimeout(() => poll(id), POLL_MS);
    })
    .catch(() => { if (id !== runId) return; W.message = 'Belum bisa memeriksa status, mencoba lagi…'; paint(); timer = setTimeout(() => poll(id), POLL_MS); });
}

function startPolling() { stopPolling(); const id = runId; timer = setTimeout(() => poll(id), 1500); }

function reset() { stopPolling(); clearJob(); Object.assign(W, { phase: 'form', step: 0, message: '', error: '', errTitle: '', downloadUrl: '', statusPath: '', name: '' }); paint(); }

async function submit() {
  const f = W.form;
  const fail = (m) => { W.error = m; const e = document.getElementById('w2a-err'); if (e) e.textContent = m; };
  fail('');
  if (!isHttps(f.url)) return fail('Isi URL website yang diawali https:// tanpa username/password.');
  if (!f.appName.trim() || f.appName.length > 40 || /[<>\u0000-\u001f]/.test(f.appName)) return fail('Nama aplikasi wajib diisi, maksimal 40 karakter, tanpa < >.');
  if (!isHttps(f.iconUrl)) return fail('URL ikon harus HTTPS (gambar PNG/JPG).');
  if (!isLoggedIn()) { openLogin('Login dulu untuk membuat APK.'); return; }

  const go = document.getElementById('w2a-go');
  if (go) { go.disabled = true; go.innerHTML = `${icon('Loader', 'h-4 w-4 animate-spin')} Mengirim…`; refreshIcons(); }
  try {
    const r = await fetch('/api/web2apk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...authHeaders() },
      body: JSON.stringify({ url: f.url.trim(), appName: f.appName.trim(), iconUrl: f.iconUrl.trim() }),
    });
    const j = await r.json().catch(() => ({}));
    if (r.status === 401 || j.login_required) { await refreshUser(); openLogin('Sesi login habis. Silakan login lagi.'); throw new Error(j.message || 'Sesi login habis.'); }
    if (!r.ok || !j.status) throw new Error(j.message || `Permintaan gagal (HTTP ${r.status}).`);
    const u = new URL(j.data.statusUrl, window.location.origin);
    Object.assign(W, { phase: 'building', step: 0, message: '', error: '', statusPath: u.pathname + u.search, name: j.data.appName, startedAt: Date.now() });
    saveJob(); paint(); startPolling();
    refreshUser(); // perbarui sisa kuota
  } catch (e) {
    W.error = e.message;
    paint();
  }
}

export function bindWeb2apk() {
  const root = document.getElementById('w2a-panel');
  if (!root) return;

  // lanjutkan build yang sedang berjalan (mis. halaman dimuat ulang)
  if (W.phase === 'form' && isLoggedIn()) {
    try {
      const job = JSON.parse(sessionStorage.getItem(JOB_KEY) || 'null');
      if (job?.statusPath && Date.now() - job.startedAt < MAX_WAIT_MS) { Object.assign(W, { phase: 'building', step: 1, ...job }); paint(); }
    } catch { /* abaikan */ }
  }
  if (W.phase === 'building') startPolling();

  root.addEventListener('input', (e) => {
    const t = e.target; if (!t.name || !(t.name in W.form)) return;
    W.form[t.name] = t.value;
    if (t.name === 'iconUrl') {
      const prev = document.getElementById('w2a-prev');
      if (prev) prev.innerHTML = isHttps(t.value) ? `<img src="${esc(t.value)}" alt="" referrerpolicy="no-referrer" class="h-full w-full object-cover" onerror="this.remove()">` : icon('Image', 'h-5 w-5 text-dim');
      refreshIcons();
    }
  });
  root.addEventListener('submit', (e) => { e.preventDefault(); submit(); });
  root.addEventListener('click', (e) => {
    if (e.target.closest('#w2a-new')) { reset(); return; }
    if (e.target.closest('#w2a-fav')) {
      try {
        const host = new URL(W.form.url).hostname;
        if (!host) throw new Error('x');
        W.form.iconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=256`;
        paint();
      } catch { W.error = 'Isi URL website dulu, baru ambil favicon.'; paint(); }
    }
  });
}

/** Dipanggil saat status login berubah. */
export function web2apkAuthChanged() { if (document.getElementById('w2a-panel')) paint(); }
