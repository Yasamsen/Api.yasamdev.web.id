import { esc, icon } from './utils.js';

/* =========================================================
   KATEGORI KURASI
   Satu endpoint = satu kategori. Urutan array ini = urutan tampil di seluruh situs.
   Label lama yang tidak konsisten (Tools / Utility / Information / Media / Image / ...)
   dirapikan lewat pemetaan di bawah, jadi file endpoint tidak perlu diubah satu per satu.
   ========================================================= */

const v = (name) => `rgb(var(--${name}))`;
const INK = '#14102b';

export const CATEGORIES = [
  { id: 'downloader', label: 'Downloader', short: 'Unduh video, musik & file dari link', icon: 'download', tile: v('gold2'), fg: '#ffffff',
    desc: 'Tempel link dari TikTok, Instagram, YouTube, Spotify dan layanan lain — dapatkan link unduhan langsung.',
    hint: 'kamu sudah punya link dan ingin file-nya',
    keywords: 'download unduh save simpan' },
  { id: 'ai', label: 'AI', short: 'Chat, buat gambar & edit foto dengan AI', icon: 'sparkles', tile: v('yellow'), fg: INK,
    desc: 'Ngobrol dengan AI, bikin gambar dari teks, edit foto, atau ubah video menjadi prompt.',
    hint: 'kamu ingin AI yang mengerjakannya',
    keywords: 'ai kecerdasan buatan' },
  { id: 'image', label: 'Gambar & Foto', short: 'Hapus background, OCR, perjelas foto', icon: 'image', tile: '#ff7eb6', fg: INK,
    desc: 'Olah gambar yang sudah kamu punya: hapus background, baca teks di foto (OCR), perjelas, perbesar, atau buat gambar bertulisan.',
    hint: 'kamu punya gambar yang ingin diolah',
    keywords: 'foto gambar image photo' },
  { id: 'audio', label: 'Musik & Audio', short: 'Lirik, album, nada dering & suara', icon: 'music', tile: v('green'), fg: INK,
    desc: 'Cari lirik dan album, nada dering, ubah teks menjadi suara, atau ubah video menjadi MP3.',
    hint: 'kamu mencari sesuatu seputar musik atau suara',
    keywords: 'musik lagu music audio suara' },
  { id: 'profile', label: 'Cek Profil', short: 'Lihat info akun publik', icon: 'users', tile: '#5bc0ff', fg: INK,
    desc: 'Lihat informasi publik akun GitHub, Instagram, X, YouTube, dan paket NPM hanya dengan username.',
    hint: 'kamu hanya punya username',
    keywords: 'stalk stalker profil profile akun username' },
  { id: 'game', label: 'Game', short: 'Cek akun & kalkulator game', icon: 'gamepad-2', tile: v('red'), fg: '#ffffff',
    desc: 'Cek akun Free Fire dan Mobile Legends, serta kalkulator Prime Free Fire.',
    hint: 'kamu sedang bermain game',
    keywords: 'game' },
  { id: 'info', label: 'Info & Pencarian', short: 'Cuaca, gempa, Wikipedia, resep', icon: 'compass', tile: '#ff9f43', fg: INK,
    desc: 'Cari tahu sesuatu: cuaca, gempa terkini, Wikipedia, resep makanan, serta pencarian Pinterest dan TikTok.',
    hint: 'kamu ingin mencari tahu sesuatu',
    keywords: 'cari search informasi' },
  { id: 'tools', label: 'Utilitas & Developer', short: 'Screenshot web, QR, email sementara, cek host', icon: 'wrench', tile: '#2dd4bf', fg: INK,
    desc: 'Alat bantu praktis: screenshot website, QR code, email sementara, upload file jadi URL, cek host/IP, dan lainnya.',
    hint: 'kamu butuh alat bantu cepat atau sedang membangun aplikasi',
    keywords: 'tools utilitas developer alat' },
  { id: 'social', label: 'WhatsApp & Akun', short: 'Reaction channel WA & akun Alight Motion', icon: 'message-circle', tile: '#a3e635', fg: INK,
    desc: 'Layanan terkait WhatsApp Channel dan akun Alight Motion.',
    hint: 'kamu sedang mengurus akun atau channel',
    keywords: 'whatsapp wa akun' },
  { id: 'fun', label: 'Anime & Wallpaper', short: 'Gambar anime, quotes & wallpaper acak', icon: 'sticker', tile: '#c4b5fd', fg: INK,
    desc: 'Gambar anime, kutipan anime, wallpaper, dan gambar acak dari berbagai sumber.',
    hint: 'kamu mencari hiburan atau wallpaper',
    keywords: 'anime wallpaper acak random' },
  { id: 'adult', label: 'Dewasa 18+', short: 'Khusus usia 18 tahun ke atas', icon: 'shield-alert', tile: '#2a2250', fg: '#ffffff', adult: true,
    desc: 'Konten dewasa. Hanya untuk pengguna berusia 18 tahun ke atas.',
    hint: 'kamu ingin nonton bareng pacar',
    keywords: 'nsfw 18+ dewasa' },
];

/* Pemetaan kurasi: slug endpoint -> id kategori. */
const SLUGS = {
  downloader: ['instagram', 'tiktok', 'facebook', 'twitter-video', 'capcut', 'terabox', 'omdown', 'motionbgs', 'spotify', 'youtube-mp3', 'ytplay'],
  ai: ['ai-chat', 'rudder-chat', 'ai-image', 'autoai', 'editimg', 'photoeditor-ai', 'video-to-prompt'],
  image: ['bgremover', 'brat', 'ocr', 'unblur-img', 'unwatermark-nano-banana', 'upscale-image'],
  audio: ['album-search', 'lyrics', 'ringtone', 'text-to-speech', 'freeconvert-video-to-mp3'],
  profile: ['githubstalk', 'instagram-stalker', 'x-stalker', 'youtube-stalker', 'npmstalk'],
  game: ['ff-stalk', 'mlstalk', 'prime-ff'],
  info: ['weather', 'earthquake', 'wikipedia', 'mealdb', 'pinterest-search', 'tiktok-search'],
  tools: ['ssweb', 'qrcode', 'tempmail', 'tourl', 'web2apk', 'check-host', 'ip-lookup', 'add-subdomain'],
  social: ['reaction-wa', 'alight-send', 'alight-verify'],
  fun: ['alya', 'quotes-anime', 'waifuimg', 'zerochan', 'alphacoders-random', 'deviantart-random'],
  adult: ['nsfw-random', 'nsfw-random1', 'tai1', 'tai', 'imgviral'],
};
const SLUG_TO_ID = Object.fromEntries(Object.entries(SLUGS).flatMap(([id, list]) => list.map((slug) => [slug, id])));

/* Cadangan untuk endpoint BARU yang slug-nya belum ada di daftar di atas:
   label lama dipetakan ke kategori baru. */
const RAW_TO_ID = {
  downloader: 'downloader', youtube: 'downloader', ai: 'ai', image: 'image', music: 'audio', converter: 'tools',
  stalker: 'profile', social: 'profile', games: 'game', game: 'game',
  information: 'info', search: 'info', weather: 'info', food: 'info',
  tools: 'tools', utility: 'tools', generator: 'tools', uploader: 'tools',
  whatsapp: 'social', anime: 'fun', random: 'fun', media: 'fun',
};

/* Warna untuk kategori yang dibuat otomatis (jika ada label baru yang tidak dikenal). */
const EXTRA_TILES = ['#f9a8d4', '#fcd34d', '#86efac', '#93c5fd'];

export const ALL = { id: '', label: 'Semua API', short: 'Lihat semua endpoint', icon: 'layout-grid', tile: v('fg'), fg: v('bg') };

export function categoryById(id) {
  return CATEGORIES.find((c) => c.id === id);
}

/** Tentukan kategori sebuah endpoint. Endpoint dengan label baru otomatis dibuatkan kategorinya. */
export function resolveCategory(slug, raw = '') {
  const key = String(raw || '').trim().toLowerCase();
  let id = SLUG_TO_ID[slug]
    || CATEGORIES.find((c) => c.id === key || c.label.toLowerCase() === key)?.id
    || RAW_TO_ID[key];
  if (!id) {
    const label = String(raw || '').trim() || 'Lainnya';
    id = `x-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    if (!categoryById(id)) {
      CATEGORIES.push({
        id, label, short: `Endpoint ${label}`, desc: `Kumpulan endpoint ${label}.`, hint: '', keywords: label.toLowerCase(),
        icon: 'folder', tile: EXTRA_TILES[CATEGORIES.length % EXTRA_TILES.length], fg: INK,
      });
    }
  }
  return categoryById(id);
}

/* Padanan kata Indonesia -> Inggris, karena deskripsi sebagian endpoint berbahasa Inggris. */
const ALIASES = {
  cuaca: ['weather'], gempa: ['earthquake'], resep: ['recipe', 'meal'], lagu: ['song', 'music'], gambar: ['image', 'picture'],
  foto: ['photo', 'image'], hapus: ['remove'], unduh: ['download'], suara: ['speech', 'voice'], cari: ['search'],
  pencarian: ['search'], akun: ['account'], video: ['video'], musik: ['music'], bahasa: ['language'],
};

/** Pencarian: semua kata harus cocok. Kata kunci kategori ikut dihitung ("unduh" -> semua Downloader). */
export function matchApi(api, query) {
  const terms = String(query || '').toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  const c = categoryById(api.categoryId);
  const hay = [api.name, api.description, api.category, api.slug, api.endpoint, c?.keywords].join(' ').toLowerCase();
  return terms.every((t) => hay.includes(t) || (ALIASES[t] || []).some((a) => hay.includes(a)));
}

/** Kotak ikon berwarna sesuai kategori. */
export function catTile(c, size = 'h-10 w-10', iconSize = 'h-4 w-4') {
  return `<span class="iconbox ${size} shrink-0" style="--tile:${c.tile};--tile-fg:${c.fg}">${icon(c.icon, iconSize)}</span>`;
}

export const adultNotice = '<div class="mb-4 flex items-start gap-2.5 rounded-2xl border-2 border-ink bg-red/15 px-4 py-3 text-xs font-bold leading-5"><span class="mt-0.5 shrink-0 rounded-md border-2 border-ink bg-red px-1.5 text-[10px] font-extrabold text-white">18+</span><span>Kategori ini berisi konten dewasa dan hanya boleh diakses oleh pengguna berusia 18 tahun ke atas.</span></div>';

/* State filter yang bertahan saat tema diganti / halaman dirender ulang. */
export const uiState = {
  home: { q: '', cat: '' },
  docs: { q: '', cat: '' },
};

export { esc };
