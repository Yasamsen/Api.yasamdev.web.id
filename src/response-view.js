import { esc, icon, refreshIcons } from './utils.js';

/* Deteksi URL media oke (download) di dalam respons JSON.
   Thumbnail / cover / avatar / banner sengaja diabaikan: yang dipreview adalah URL download aslinya. */

const EXT = {
  video: /\.(mp4|webm|mov|m4v|mkv)(?:[?#]|$)/i,
  audio: /\.(mp3|m4a|wav|ogg|opus|aac|flac)(?:[?#]|$)/i,
  image: /\.(jpe?g|png|gif|webp|avif|bmp|svg)(?:[?#]|$)/i,
};
const THUMB_KEY = /thumb|cover|avatar|profile|banner|icon|logo|poster|favicon|(^|_)pic$/i;
const THUMB_URL = /profile_images|profile_banners|\/avatar|\/favicon/i;
const DOWNLOAD_KEY = /download|nowm|nowatermark|stream|video|audio|mp3|mp4/i;
const MAX_ITEMS = 12;

function typeFromKey(key) {
  if (/audio|mp3/i.test(key)) return 'audio';
  if (/video|mp4|nowm|nowatermark/i.test(key)) return 'video';
  return 'file';
}

function detectType(key, url) {
  if (!/^https?:\/\//i.test(url)) return null;
  const isAudioVideo = EXT.audio.test(url) || EXT.video.test(url);
  if (!isAudioVideo && (THUMB_KEY.test(key) || THUMB_URL.test(url))) return null;
  if (EXT.video.test(url)) return 'video';
  if (EXT.audio.test(url)) return 'audio';
  if (EXT.image.test(url)) return 'image';
  if (DOWNLOAD_KEY.test(key)) return typeFromKey(key);
  return null;
}

export function extractMedia(data) {
  const found = [];
  const seen = new Set();
  const walk = (value, path, depth) => {
    if (depth > 6 || found.length >= MAX_ITEMS) return;
    if (typeof value === 'string') {
      const key = path.split('.').pop().replace(/\[\d+\]$/, '');
      const type = detectType(key, value.trim());
      if (type && !seen.has(value)) {
        seen.add(value);
        found.push({ path, url: value.trim(), type });
      }
    } else if (Array.isArray(value)) {
      value.forEach((item, i) => walk(item, `${path}[${i}]`, depth + 1));
    } else if (value && typeof value === 'object') {
      Object.entries(value).forEach(([k, v]) => walk(v, path ? `${path}.${k}` : k, depth + 1));
    }
  };
  walk(data, '', 0);
  return found;
}

export function mediaFromBlob(blobUrl, contentType) {
  const type = contentType.startsWith('video/') ? 'video' : contentType.startsWith('audio/') ? 'audio' : contentType.startsWith('image/') ? 'image' : null;
  if (!type) return null;
  const ext = (contentType.split('/')[1] || 'bin').split(';')[0].replace('mpeg', 'mp3').replace('svg+xml', 'svg');
  return { path: 'response', url: blobUrl, type, filename: `response.${ext}` };
}

const TYPE_LABEL = { image: 'Image', video: 'Video', audio: 'Audio', file: 'File' };
const TYPE_ICON = { image: 'Image', video: 'Video', audio: 'Music', file: 'File' };

function preview(item) {
  const src = esc(item.url);
  if (item.type === 'image') return `<div class="flex justify-center rounded-xl bg-fg/[0.04] p-3"><img src="${src}" alt="Media preview" loading="lazy" referrerpolicy="no-referrer" class="max-w-full rounded-lg" style="max-height:340px"></div>`;
  if (item.type === 'video') return `<video src="${src}" controls playsinline preload="metadata" referrerpolicy="no-referrer" class="w-full rounded-xl bg-black" style="max-height:380px"></video>`;
  if (item.type === 'audio') return `<audio src="${src}" controls preload="none" class="w-full"></audio>`;
  return `<div class="flex items-center gap-2 rounded-xl bg-fg/[0.04] px-4 py-3 text-xs text-muted">${icon('File', 'h-4 w-4')}<span>Preview tidak tersedia untuk tipe file ini. Gunakan tombol download.</span></div>`;
}

function mediaCard(item) {
  const filename =
    item.filename ||
    `media.${
      item.type === 'video'
        ? 'mp4'
        : item.type === 'audio'
        ? 'mp3'
        : item.type === 'image'
        ? 'jpg'
        : 'bin'
    }`;

  const downloadUrl =
    `/api/media-download?url=${encodeURIComponent(item.url)}&filename=${encodeURIComponent(filename)}`;

  return `<div class="card !rounded-2xl p-4" data-media-card>
    <div class="mb-3 flex items-center gap-2 text-[11px] font-bold text-muted">
      ${icon(TYPE_ICON[item.type], 'h-3.5 w-3.5')}
      <span class="uppercase tracking-wider">${TYPE_LABEL[item.type]}</span>
    </div>

    ${preview(item)}

    <div class="mt-3">
      <a
        href="${esc(downloadUrl)}"
        class="btn btn-gold btn-sm w-full"
      >
        ${icon('Download', 'h-3.5 w-3.5')}
        <span>Download</span>
      </a>
    </div>
  </div>`;
}

/* Bungkus respons dengan toggle JSON / Media.
   - Ada media  -> tombol JSON + Media (user pilih)
   - Tidak ada  -> hanya JSON, tanpa tombol
   - Respons biner (mediaOnly) -> hanya Media */
export function renderResponse(box, { statusHtml = '', jsonHtml = '', media = [], mediaOnly = false, initial = 'json' }) {
  if (!media.length && !mediaOnly) {
    box.innerHTML = `${statusHtml}${jsonHtml}`;
    refreshIcons();
    return;
  }
  const cards = media.map(mediaCard).join('');
  if (mediaOnly) {
    box.innerHTML = `${statusHtml}<div class="grid gap-3">${cards}</div>`;
    refreshIcons();
    return;
  }
  const tab = (id, label, ic, extra = '') =>
    `<button type="button" data-rv-tab="${id}" class="btn btn-sm flex-1 sm:flex-none">${icon(ic, 'h-3.5 w-3.5')}<span>${label}${extra}</span></button>`;
  box.innerHTML = `${statusHtml}
    <div class="mb-3 flex gap-2">${tab('json', 'JSON', 'Braces')}${tab('media', 'Media', 'Image', ` <span class="opacity-70">(${media.length})</span>`)}</div>
    <div data-rv-panel="json">${jsonHtml}</div>
    <div data-rv-panel="media" class="hidden"><div class="grid gap-3">${cards}</div></div>`;

  const select = (id) => {
    box.querySelectorAll('[data-rv-tab]').forEach((b) => {
      const active = b.dataset.rvTab === id;
      b.classList.toggle('btn-gold', active);
      b.classList.toggle('btn-ghost', !active);
      b.setAttribute('aria-pressed', String(active));
    });
    box.querySelectorAll('[data-rv-panel]').forEach((p) => p.classList.toggle('hidden', p.dataset.rvPanel !== id));
    if (id !== 'media') box.querySelectorAll('video, audio').forEach((m) => m.pause());
  };
  box.querySelectorAll('[data-rv-tab]').forEach((b) => b.addEventListener('click', () => select(b.dataset.rvTab)));
  select(initial);
  refreshIcons();
}
