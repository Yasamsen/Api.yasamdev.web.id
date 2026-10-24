// Auto-discovery registry. Every JS file under ./endpoints/** is detected by Vite at build time.
import { CATEGORIES, resolveCategory } from '../categories.js';

const modules = import.meta.glob('./endpoints/**/*.js', { eager: true, import: 'default' });

export const apiDefinitions = Object.values(modules)
  .filter(Boolean)
  .map((api) => normalizeApi(api))
  .sort((a, b) => categoryIndex(a) - categoryIndex(b) || a.name.localeCompare(b.name));

function categoryIndex(api) {
  return CATEGORIES.findIndex((c) => c.id === api.categoryId);
}

function normalizeApi(api) {
  const fallbackSlug = String(api.slug || api.name || api.endpoint || 'api')
    .toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  // Kategori dirapikan lewat src/categories.js (label lama di file endpoint tetap aman).
  const cat = resolveCategory(fallbackSlug, api.category || categoryFromEndpoint(api.endpoint || ''));
  return {
    slug: fallbackSlug,
    name: api.name || titleFromSlug(fallbackSlug),
    description: api.description || `API endpoint for ${titleFromSlug(fallbackSlug)}.`,
    category: cat.label,
    categoryId: cat.id,
    method: api.method || 'GET',
    endpoint: api.endpoint || `/api/${fallbackSlug}`,
    icon: api.icon || 'Activity',
    parameters: Array.isArray(api.parameters) ? api.parameters : [],
    responseExample: api.responseExample || { success: true, data: {} },
    responseFields: Array.isArray(api.responseFields) ? api.responseFields : [],
    exampleRequest: api.exampleRequest || `${api.method || 'GET'} https://samapi.example.com${api.endpoint || `/api/${fallbackSlug}`}`,
  };
}

function titleFromSlug(slug) {
  return slug.split('-').filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function categoryFromEndpoint(endpoint) {
  const clean = endpoint.replace(/^\//, '').split('/').filter(Boolean);
  const joined = clean.join('/').toLowerCase();
  if (joined.includes('download')) return 'Downloader';
  if (joined.includes('/ai') || joined.startsWith('ai/')) return 'AI';
  return 'Utility';
}

export function getApiBySlug(slug) {
  return apiDefinitions.find((api) => api.slug === slug);
}

/** Kategori yang punya endpoint, sesuai urutan kurasi, lengkap dengan jumlah & daftar API-nya. */
export function getCategories() {
  return CATEGORIES
    .map((c) => { const apis = apiDefinitions.filter((a) => a.categoryId === c.id); return { ...c, count: apis.length, apis }; })
    .filter((c) => c.count > 0);
}
