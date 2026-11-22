// Membuat api/_quota-map.js dari field `cost` di metadata tiap endpoint (src/apis/endpoints/**).
// Backend membaca file hasilnya untuk menentukan biaya kuota per request.
// Jalan otomatis di `npm run build` / `npm run dev`; jalankan manual dengan `npm run quota`.
import { readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'src/apis/endpoints');
const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.js') ? [path.join(d, e.name)] : []));

const map = {};
const warn = [];
for (const file of walk(dir).sort()) {
  const rel = path.relative(root, file);
  let api;
  try { api = (await import(pathToFileURL(file).href)).default; } catch (e) { warn.push(`${rel}: gagal dibaca (${e.message})`); continue; }
  if (!api) continue;

  const slug = String(api.slug || api.name || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const route = String(api.endpoint || '').replace(/^\/api\//, '').replace(/[?#].*$/, '').replace(/\/+$/, '');
  const keys = [...new Set([route, slug].filter(Boolean))]; // backend memakai nama rute; slug ikut sebagai cadangan
  if (!keys.length) continue;

  let cost = 1;
  if (api.cost !== undefined) {
    if (Number.isInteger(api.cost) && api.cost >= 1 && api.cost <= 100) cost = api.cost;
    else warn.push(`${rel}: cost "${api.cost}" tidak valid (harus bilangan bulat 1-100), dipakai 1`);
  }
  for (const k of keys) {
    if (k in map && map[k] !== cost) warn.push(`${rel}: nama rute "${k}" sudah dipakai endpoint lain dengan biaya ${map[k]}; dipakai yang terbesar`);
    map[k] = Math.max(map[k] || 1, cost);
  }
}

const out = `// FILE OTOMATIS — jangan diedit. Sumber: field "cost" di src/apis/endpoints/**. Dibuat oleh scripts/gen-quota-map.mjs
// nama rute (bagian setelah /api/) -> biaya kuota per request. Rute yang tidak ada di sini berbiaya 1.
export const QUOTA_MAP = ${JSON.stringify(map, null, 1)};
`;
writeFileSync(path.join(root, 'api/_quota-map.js'), out);
const heavier = Object.entries(map).filter(([, c]) => c > 1);
console.log(`quota map: ${Object.keys(map).length} nama rute, ${heavier.length} berbiaya lebih dari 1`);
for (const w of warn) console.warn('  PERINGATAN ' + w);
