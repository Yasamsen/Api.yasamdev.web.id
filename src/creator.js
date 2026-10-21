import { esc, icon } from './utils.js';

/* =========================================================
   DATA CREATOR — ganti nilai di bawah ini dengan akun asli.
   - whatsapp : nomor internasional tanpa +, spasi, atau strip (contoh: 6281234567890)
   - telegram : username tanpa @
   - instagram: username tanpa @
   ========================================================= */
export const CREATOR = {
  name: 'YasamDev',
  role: 'Creator & Developer',
  whatsapp: '62XXXXXXXXXXX',
  telegram: 'USERNAME_TELEGRAM',
  instagram: 'USERNAME_INSTAGRAM',
  waMessage: 'Halo YasamDev, saya ingin bertanya tentang SamApi.',
};

/* Wordmark "YasamDev" — pola yang sama dengan logo "SamApi": nama biasa + aksen berwarna. */
export const creatorName = (accent = 'text-gold') => `Yasam<span class="${accent}">Dev</span>`;

/* Ikon brand digambar inline (gaya outline Lucide) supaya tidak bergantung pada versi library ikon. */
const BRAND_PATHS = {
  whatsapp: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  telegram: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  instagram: '<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>',
};

export function brandIcon(key, classes = 'h-5 w-5') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide ${classes}" aria-hidden="true">${BRAND_PATHS[key] || ''}</svg>`;
}

export function creatorLinks() {
  const wa = String(CREATOR.whatsapp).replace(/[^\dX]/gi, '');
  return [
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      handle: `+${wa}`,
      hint: 'Chat langsung',
      href: `https://wa.me/${wa}?text=${encodeURIComponent(CREATOR.waMessage)}`,
      tile: '--tile:rgb(var(--green));color:rgb(20 16 43)',
    },
    {
      key: 'telegram',
      label: 'Telegram',
      handle: `@${CREATOR.telegram}`,
      hint: 'Kirim pesan',
      href: `https://t.me/${encodeURIComponent(CREATOR.telegram)}`,
      tile: '--tile:rgb(var(--gold2));color:#fff',
    },
    {
      key: 'instagram',
      label: 'Instagram',
      handle: `@${CREATOR.instagram}`,
      hint: 'Ikuti & DM',
      href: `https://instagram.com/${encodeURIComponent(CREATOR.instagram)}`,
      tile: '--tile:rgb(var(--red));color:#fff',
    },
  ];
}

const reveal = (html, d = 0, cls = '') => `<div class="reveal ${cls}" style="--d:${d}ms">${html}</div>`;

/* Blok dua kolom: kartu profil ungu (kiri) + tiga kartu kontak (kanan). */
function creatorBlock() {
  const links = creatorLinks();
  const profile = `<div class="hero-card h-full">
      <div class="relative flex items-start gap-4">
        <span class="avatar shrink-0" aria-hidden="true">YD</span>
        <div class="min-w-0">
          <span class="pill">${icon('Sparkles', 'h-3.5 w-3.5')} ${esc(CREATOR.role)}</span>
          <h3 class="font-display mt-3 text-3xl leading-none sm:text-4xl">${creatorName('text-yellow')}</h3>
        </div>
      </div>
      <p class="relative mt-6 max-w-sm text-sm leading-7 text-white/90">Pembuat SamApi. Punya pertanyaan, ide endpoint baru, atau menemukan bug? Hubungi langsung lewat salah satu kanal di samping.</p>
      <div class="relative mt-6 flex flex-wrap gap-2">
        <span class="pill">${icon('Zap', 'h-3.5 w-3.5')} SamApi</span>
        <span class="pill">${icon('Code2', 'h-3.5 w-3.5')} Open to ideas</span>
      </div>
    </div>`;

  const rows = links.map((l, i) => reveal(
    `<a href="${esc(l.href)}" target="_blank" rel="noopener noreferrer" class="card group flex items-center gap-4 p-4 sm:p-5" aria-label="${esc(l.label)} ${esc(CREATOR.name)}">
      <span class="iconbox h-12 w-12 shrink-0" style="${l.tile}">${brandIcon(l.key, 'h-5 w-5')}</span>
      <span class="min-w-0 flex-1">
        <span class="block text-sm font-extrabold">${esc(l.label)}</span>
        <span class="mt-0.5 block truncate font-mono text-[11px] text-dim">${esc(l.handle)}</span>
      </span>
      <span class="hidden text-xs font-bold text-muted sm:block">${esc(l.hint)}</span>
      ${icon('ArrowUpRight', 'h-4 w-4 text-dim transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold')}
    </a>`, 80 + i * 70));

  return `<div class="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-2">
    ${reveal(profile, 0, 'h-full')}
    <div class="flex flex-col justify-center gap-4">${rows.join('')}</div>
  </div>`;
}

/* Bagian di Home */
export function renderCreatorSection() {
  return `<section class="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-24" id="creator">
    ${reveal(`<div class="mb-10">
      <p class="sticker mb-4 text-xs">${icon('Heart', 'h-3.5 w-3.5')} Meet the creator</p>
      <h2 class="text-balance max-w-xl text-[2rem] leading-[1.1] sm:text-[2.75rem]">Dibuat oleh ${creatorName()}.</h2>
      <p class="mt-4 max-w-md text-sm leading-7 text-muted">Butuh bantuan atau mau request endpoint baru? Sapa langsung.</p>
    </div>`)}
    ${creatorBlock()}
  </section>`;
}

/* Halaman /contact */
export function renderContact() {
  return `<main>
    <section class="hero-glow pb-16 pt-[calc(var(--nav-h)+56px)] sm:pb-24 sm:pt-[calc(var(--nav-h)+96px)]">
      <div class="mx-auto max-w-7xl px-4 sm:px-8">
        <p class="seq sticker mb-6 text-sm" style="--d:.1s">${icon('MessageCircle', 'h-4 w-4')} Contact</p>
        <h1 class="seq text-balance max-w-2xl text-[clamp(2.2rem,7vw,4.2rem)] leading-[1.04]" style="--d:.2s">Hubungi <span class="whitespace-nowrap">${creatorName()}</span></h1>
        <p class="seq mt-6 mb-12 max-w-md text-base leading-8 text-muted" style="--d:.4s">Pertanyaan, kerja sama, laporan bug, atau request endpoint — pilih kanal yang paling nyaman buat kamu.</p>
        <div class="seq" style="--d:.55s">${creatorBlock()}</div>
      </div>
    </section>
  </main>`;
}
