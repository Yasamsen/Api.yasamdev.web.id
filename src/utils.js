export const BASE_URL = 'https://samapi.example.com';

export function esc(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

export function icon(name, classes = 'h-5 w-5') {
  // Normalize legacy PascalCase metadata to Lucide's kebab-case icon names.
  const raw = String(name ?? '').trim();
  const aliases = {
    'alight motion': 'sparkles', twitter: 'message-circle', x: 'message-circle',
    instagram: 'camera', facebook: 'users', github: 'code-2', youtube: 'circle-play',
    package: 'package', qrcode: 'qr-code', 'qr-code': 'qr-code',
    'wand-sparkles': 'wand-sparkles', imageplus: 'image-plus', images: 'images',
    bot: 'bot', music2: 'music-2', cloudsun: 'cloud-sun', gamepad2: 'gamepad-2',
    monitorplay: 'monitor-play', userplus: 'user-plus',
  };
  let resolved = aliases[raw.toLowerCase()];
  if (!resolved && /^https?:\/\//i.test(raw)) {
    const host = raw.toLowerCase();
    resolved = host.includes('tiktok') ? 'music-2'
      : host.includes('pinterest') ? 'images'
      : host.includes('whatsapp') ? 'message-circle'
      : host.includes('live3d') ? 'box'
      : 'globe';
  }
  if (!resolved && /^[a-z][a-z0-9]*$/i.test(raw)) {
    resolved = raw.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }
  if (!resolved && /^[a-z][a-z0-9-]*$/i.test(raw)) resolved = raw.toLowerCase();
  if (!resolved) resolved = 'activity';
  return `<i data-lucide="${esc(resolved)}" class="${classes}"></i>`;
}

export function refreshIcons() {
  if (window.lucide) window.lucide.createIcons({ attrs: { 'stroke-width': 2 } });
}

export async function copyText(text) {
  await navigator.clipboard.writeText(text);
}
