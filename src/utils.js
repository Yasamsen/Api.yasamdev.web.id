export const BASE_URL = 'https://samapi.example.com';

export function esc(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

export function icon(name, classes = 'h-5 w-5') {
  return `<i data-lucide="${esc(name || 'Activity')}" class="${classes}"></i>`;
}

export function refreshIcons() {
  if (window.lucide) window.lucide.createIcons({ attrs: { 'stroke-width': 2 } });
}

export async function copyText(text) {
  await navigator.clipboard.writeText(text);
}
