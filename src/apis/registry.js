// Auto-discovery registry. Every JS file under ./endpoints/** is detected by Vite at build time.
const modules = import.meta.glob('./endpoints/**/*.js', { eager: true, import: 'default' });

export const apiDefinitions = Object.values(modules)
  .filter(Boolean)
  .map((api) => normalizeApi(api))
  .sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));

function normalizeApi(api) {
  const fallbackSlug = String(api.slug || api.name || api.endpoint || 'api')
    .toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return {
    slug: fallbackSlug,
    name: api.name || titleFromSlug(fallbackSlug),
    description: api.description || `API endpoint for ${titleFromSlug(fallbackSlug)}.`,
    category: api.category || categoryFromEndpoint(api.endpoint || ''),
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

export function getCategories() {
  return [...new Set(apiDefinitions.map((api) => api.category))];
}
