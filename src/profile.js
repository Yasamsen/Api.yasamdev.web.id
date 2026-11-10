import { esc, icon, refreshIcons } from './utils.js';
import { auth, isLoggedIn, avatar, openLogin, logout, regenerateKey, refreshUser, copyWithFlash, toast } from './auth.js';

/* =========================================================
   PROFIL — /profile
   ========================================================= */

const fmtDate = (s) => (s ? new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '–');
const fmtNum = (n) => Number(n || 0).toLocaleString('id-ID');
const resetText = (secs) => {
  const h = Math.floor(secs / 3600); const m = Math.floor((secs % 3600) / 60);
  return h ? `${h} jam ${m} menit lagi` : `${Math.max(1, m)} menit lagi`;
};
let keyVisible = false;
let lastRefresh = 0;
const mask = (k) => (k ? k.slice(0, 4) + '•'.repeat(18) + k.slice(-4) : '');

function loggedOut() {
  return `<main class="mx-auto max-w-xl px-4 pb-24 pt-[calc(var(--nav-h)+48px)] sm:px-8 sm:pt-[calc(var(--nav-h)+90px)]">
    <div class="card page-enter p-7 text-center sm:p-10">
      <span class="iconbox mx-auto mb-6 h-16 w-16" style="--tile:rgb(var(--yellow));--tile-fg:#14102b">${icon('UserRound', 'h-7 w-7')}</span>
      <h1 class="text-3xl">Profil kamu</h1>
      <p class="mx-auto mt-3 max-w-sm text-sm leading-7 text-muted">Login dengan Google untuk membuka semua endpoint, melihat API key pribadi, dan memantau sisa kuota harian.</p>
      <button data-login class="btn btn-gold mt-8 w-full sm:w-auto">${icon('LogIn', 'h-4 w-4')} Login dengan Google</button>
    </div></main>`;
}

function loggedIn(u) {
  const pct = Math.min(100, Math.round((u.used / u.limit) * 100));
  const tone = pct >= 90 ? 'meter-bad' : pct >= 70 ? 'meter-warn' : '';
  const origin = window.location.origin;
  const sampleUrl = `${origin}/api/weather?city=Bandung&apikey=${u.apikey}`;
  const curl = `curl "${origin}/api/weather?city=Bandung" \\\n  -H "x-api-key: ${u.apikey}"`;
  return `<main class="mx-auto max-w-3xl px-4 pb-24 pt-[calc(var(--nav-h)+28px)] sm:px-8 sm:pt-[calc(var(--nav-h)+56px)]">
    <div class="page-enter">
      <section class="card flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:p-8 sm:text-left">
        <span class="shrink-0">${avatar(u, 'h-20 w-20 sm:h-24 sm:w-24 !border-[3px]')}</span>
        <div class="min-w-0 flex-1">
          <span class="sticker mb-2 text-xs">${icon('BadgeCheck', 'h-3.5 w-3.5')} Akun Google</span>
          <h1 class="truncate text-[clamp(1.5rem,5vw,2.25rem)]">${esc(u.name)}</h1>
          <p class="truncate text-sm text-muted">${esc(u.email)}</p>
          <p class="mt-1 text-xs text-dim">Bergabung ${fmtDate(u.createdAt)}</p>
        </div>
        <button id="pf-logout" class="btn btn-ghost btn-sm w-full sm:w-auto">${icon('LogOut', 'h-4 w-4')} Keluar</button>
      </section>

      <section class="card mt-5 p-6 sm:p-7" aria-labelledby="pf-usage">
        <div class="mb-4 flex items-end justify-between gap-3">
          <div><h2 id="pf-usage" class="text-lg">Kuota hari ini</h2><p class="mt-0.5 text-xs text-muted">Reset otomatis tengah malam WIB · ${resetText(u.resetIn)}</p></div>
          <p class="font-display text-3xl leading-none sm:text-4xl"><span id="pf-used">${fmtNum(u.used)}</span><span class="text-lg text-dim"> / ${fmtNum(u.limit)}</span></p>
        </div>
        <div class="meter ${tone}" role="progressbar" aria-valuenow="${u.used}" aria-valuemin="0" aria-valuemax="${u.limit}" aria-label="Pemakaian kuota harian"><span style="width:${pct}%"></span></div>
        <div class="mt-4 grid grid-cols-2 gap-3">
          <div class="stat-box !p-3 sm:!p-4"><div class="font-display text-2xl">${fmtNum(Math.max(0, u.limit - u.used))}</div><div class="mt-0.5 text-[11px] font-bold">Sisa hari ini</div></div>
          <div class="stat-box !p-3 sm:!p-4"><div class="font-display text-2xl">${fmtNum(u.total)}</div><div class="mt-0.5 text-[11px] font-bold">Total request</div></div>
        </div>
      </section>

      <section class="card mt-5 p-6 sm:p-7" aria-labelledby="pf-key">
        <h2 id="pf-key" class="text-lg">API key kamu</h2>
        <p class="mt-1 text-xs leading-5 text-muted">Dipakai untuk bot atau script lewat <code class="font-mono font-bold text-fg">?apikey=KEY</code>. Jangan dibagikan ke orang lain.</p>
        <div class="code-url mt-4 flex items-center gap-2 py-2.5 pl-3.5 pr-2.5">
          <code id="pf-keytext" class="min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-[12px]">${esc(keyVisible ? u.apikey : mask(u.apikey))}</code>
          <button id="pf-eye" class="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[#a79fcb] transition-colors hover:bg-white/10 hover:text-white" aria-label="${keyVisible ? 'Sembunyikan' : 'Tampilkan'} key">${icon(keyVisible ? 'EyeOff' : 'Eye', 'h-4 w-4')}</button>
          <button id="pf-copykey" class="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[#a79fcb] transition-colors hover:bg-white/10 hover:text-white" aria-label="Salin API key">${icon('Copy', 'h-4 w-4')}</button>
        </div>
        <button id="pf-regen" class="btn btn-ghost btn-sm mt-4 w-full sm:w-auto">${icon('RefreshCw', 'h-3.5 w-3.5')} Buat ulang key</button>
      </section>

      <section class="card mt-5 p-6 sm:p-7" aria-labelledby="pf-how">
        <h2 id="pf-how" class="text-lg">Cara memakai</h2>
        <div class="mt-4 grid gap-4">
          <div class="flex items-start gap-3"><span class="iconbox h-9 w-9 shrink-0" style="--tile:rgb(var(--green));--tile-fg:#14102b">${icon('Globe', 'h-4 w-4')}</span><div><p class="text-sm font-extrabold">Lewat website</p><p class="mt-0.5 text-xs leading-5 text-muted">Otomatis. Selama login, buka halaman dokumentasi lalu klik “Send request”. Tidak perlu memasukkan key.</p></div></div>
          <div class="flex items-start gap-3"><span class="iconbox h-9 w-9 shrink-0" style="--tile:#cdbfff;--tile-fg:#14102b">${icon('Bot', 'h-4 w-4')}</span><div class="min-w-0 flex-1"><p class="text-sm font-extrabold">Lewat bot / script</p><p class="mt-0.5 text-xs leading-5 text-muted">Tambahkan API key di URL, atau kirim lewat header <code class="font-mono font-bold text-fg">x-api-key</code>.</p></div></div>
        </div>
        <div class="code mt-4"><div class="code-head"><span class="font-mono text-[11px] font-bold text-[#a79fcb]">url</span><button data-copy="${esc(sampleUrl)}" class="sn-act">${icon('Copy', 'h-3.5 w-3.5')}Salin</button></div>
          <pre class="p-4 text-[12px] leading-6"><code class="block w-max min-w-full whitespace-pre">${esc(origin)}/api/weather?city=Bandung&amp;apikey=<span class="tk-s">${esc(keyVisible ? u.apikey : 'KEY_KAMU')}</span></code></pre></div>
        <div class="code mt-3"><div class="code-head"><span class="font-mono text-[11px] font-bold text-[#a79fcb]">curl</span><button data-copy="${esc(curl)}" class="sn-act">${icon('Copy', 'h-3.5 w-3.5')}Salin</button></div>
          <pre class="p-4 text-[12px] leading-6"><code class="block w-max min-w-full whitespace-pre">${esc(keyVisible ? curl : curl.replace(u.apikey, 'KEY_KAMU'))}</code></pre></div>
      </section>

      <div class="mt-6 flex flex-col gap-3 sm:flex-row">
        <button data-nav="/docs" class="btn btn-gold flex-1">${icon('BookOpen', 'h-4 w-4')} Jelajahi API</button>
        <button data-nav="/snippet" class="btn btn-ghost flex-1">${icon('Code', 'h-4 w-4')} Snippet</button>
      </div>
    </div></main>`;
}

export function renderProfile() { return isLoggedIn() ? loggedIn(auth.user) : loggedOut(); }

export function bindProfile() {
  if (!isLoggedIn()) return;
  const $ = (id) => document.getElementById(id);
  if (Date.now() - lastRefresh > 15000) { lastRefresh = Date.now(); refreshUser(); } // listener auth yang me-render ulang

  $('pf-logout')?.addEventListener('click', () => logout());
  $('pf-eye')?.addEventListener('click', () => { keyVisible = !keyVisible; window.__render?.({ silent: true }); });
  $('pf-copykey')?.addEventListener('click', (e) => copyWithFlash(e.currentTarget, auth.user.apikey, icon('Check', 'h-4 w-4 text-ok')));
  $('pf-regen')?.addEventListener('click', async (e) => {
    if (!confirm('Buat ulang API key? Key lama langsung tidak berlaku, bot yang memakainya harus diperbarui.')) return;
    const btn = e.currentTarget; btn.disabled = true;
    try { await regenerateKey(); keyVisible = true; toast('API key baru dibuat'); }
    catch (err) { toast(err.message); btn.disabled = false; }
  });
  refreshIcons();
}
