const CATEGORY_RULES = [
  [/download|youtube-mp3|ytplay|tiktok|instagram|facebook|terabox|capcut|twitter-video|omdown/, 'Downloader'],
  [/ai|brat|upscale|unblur|bgremover|editimg|photoeditor|video-to-prompt|ocr/, 'AI & Image'],
  [/spotify|album|lyrics|ringtone|text-to-speech/, 'Music & Audio'],
  [/stalk|mlstalk|githubstalk|npmstalk|ff-stalk|prime-ff/, 'Profile & Games'],
  [/weather|earthquake|ip-lookup|check-host|wikipedia/, 'Information'],
  [/search|pinterest|zerochan/, 'Search'],
  [/anime|waifu|deviantart|alphacoders|motionbgs|imgviral|tai/, 'Images & Anime'],
  [/qrcode|tourl|web2apk|subdomain|tempmail|alight|ssweb|convert/, 'Developer Tools'],
  [/mealdb|food/, 'Food'],
];

function normalizeCategory(category, slug, endpoint) {
  const value = String(category || '').trim();
  if (value && !['Utility', 'Utilities', 'Other', 'General'].includes(value)) return value;
  const key = `${slug} ${endpoint}`.toLowerCase();
  return CATEGORY_RULES.find(([pattern]) => pattern.test(key))?.[1] || 'Utilities';
}

function describeEndpoint(slug) {
  const name = titleFromSlug(slug);
  return `Gunakan ${name} untuk memproses permintaan melalui API ini. Buka dokumentasi untuk melihat parameter, contoh, dan format respons.`;
}


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
    description: api.description || describeEndpoint(fallbackSlug),
    category: normalizeCategory(api.category, fallbackSlug, api.endpoint || ''),
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
