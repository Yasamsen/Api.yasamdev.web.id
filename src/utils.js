export const BASE_URL = 'https://samapi.example.com';

export function esc(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

export function icon(name, classes = 'h-5 w-5') {
  // Keep every endpoint icon renderable: Lucide does not contain brand logos,
  // and some older endpoint metadata stores a favicon URL instead of an icon name.
  const raw = String(name ?? '').trim();
  const brandOrLegacy = {
    'alight motion': 'Sparkles',
    twitter: 'MessageCircle',
    x: 'MessageCircle',
    instagram: 'Camera',
    facebook: 'Users',
    github: 'Code2',
    youtube: 'CirclePlay',
  };
  let resolved = brandOrLegacy[raw.toLowerCase()];
  if (!resolved && /^https?:\/\//i.test(raw)) {
    const host = raw.toLowerCase();
    resolved = host.includes('tiktok') ? 'Music2'
      : host.includes('pinterest') ? 'Images'
      : host.includes('live3d') ? 'Box'
      : 'Globe';
  }
  if (!resolved && /^[a-z][a-z0-9-]*$/i.test(raw)) resolved = raw;
  if (!resolved) resolved = 'Activity';
  return `<i data-lucide="${esc(resolved)}" class="${classes}"></i>`;
}

export function refreshIcons() {
  if (window.lucide) window.lucide.createIcons({ attrs: { 'stroke-width': 2 } });
}

export async function copyText(text) {
  await navigator.clipboard.writeText(text);
}
