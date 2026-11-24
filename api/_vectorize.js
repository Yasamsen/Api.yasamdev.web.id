// Gambar raster (PNG/JPG/WebP/...) -> SVG vektor yang bisa diedit (Illustrator, Inkscape, Figma, dll).
// Cara kerja: perkecil -> kuantisasi warna -> gabung warna sampai jumlah tepat -> filter garis tipis ->
//             telusuri tepi tiap warna -> sederhanakan -> kurva Bezier.
// `sharp` dimuat saat dipakai (dynamic import) supaya kalau tidak terpasang, hanya endpoint ini yang gagal.

const DETAIL = {
  low: { tol: 1.8, speckle: 24 },
  medium: { tol: 1.1, speckle: 10 },
  high: { tol: 0.7, speckle: 4 },
};
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const int = (v, d) => { const n = parseInt(v, 10); return Number.isFinite(n) ? n : d; };
const f2 = (v) => { const s = (Math.round(v * 100) / 100).toFixed(2).replace(/\.?0+$/, ''); return s === '-0' ? '0' : s; };
const hex = (r, g, b) => `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')}`;

/* ------------------------------------------------ penelusuran tepi piksel */

/** Mengembalikan daftar loop (titik sudut, y ke bawah) per label warna. */
function traceLabels(labels, W, H, nLabels, skipLabel) {
  const VW = W + 1;
  const dirs = new Uint8Array(VW * (H + 1)); // bit d terpasang = ada tepi keluar dari titik ini ke arah d (0=E 1=S 2=W 3=N)
  const starts = Array.from({ length: nLabels }, () => []);
  const delta = [1, VW, -1, -VW];

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const c = labels[y * W + x];
      if (c === skipLabel) continue;
      const tl = y * VW + x;
      if (y === 0 || labels[(y - 1) * W + x] !== c) starts[c].push(tl * 4); // atas: TL -> TR (E)
      if (x === W - 1 || labels[y * W + x + 1] !== c) starts[c].push((tl + 1) * 4 + 1); // kanan: TR -> BR (S)
      if (y === H - 1 || labels[(y + 1) * W + x] !== c) starts[c].push((tl + 1 + VW) * 4 + 2); // bawah: BR -> BL (W)
      if (x === 0 || labels[y * W + x - 1] !== c) starts[c].push((tl + VW) * 4 + 3); // kiri: BL -> TL (N)
    }
  }

  const result = Array.from({ length: nLabels }, () => []);
  for (let c = 0; c < nLabels; c++) {
    const list = starts[c];
    for (const s of list) dirs[s >> 2] |= 1 << (s & 3);
    for (const s of list) {
      const v0 = s >> 2; const d0 = s & 3;
      if (!(dirs[v0] & (1 << d0))) continue;
      const vs = []; const ds = [];
      let cur = v0; let dir = d0;
      for (let guard = 0; guard <= list.length; guard++) {
        dirs[cur] &= ~(1 << dir);
        vs.push(cur); ds.push(dir);
        const nxt = cur + delta[dir];
        if (nxt === v0) break;
        const m = dirs[nxt];
        const r = (dir + 1) & 3; const l = (dir + 3) & 3;
        const nd = m & (1 << r) ? r : m & (1 << dir) ? dir : m & (1 << l) ? l : -1; // utamakan belok kanan (pisahkan sentuhan diagonal)
        if (nd < 0) break;
        cur = nxt; dir = nd;
      }
      // simpan hanya titik sudut (arah berubah)
      const pts = [];
      for (let i = 0; i < vs.length; i++) if (ds[i] !== ds[(i + vs.length - 1) % vs.length]) pts.push([vs[i] % VW, Math.floor(vs[i] / VW)]);
      if (pts.length >= 3) result[c].push(pts);
    }
    for (const s of list) dirs[s >> 2] &= ~(1 << (s & 3)); // bersihkan sisa bit milik warna ini
  }
  return result;
}

const area = (pts) => { let a = 0; for (let i = 0; i < pts.length; i++) { const p = pts[i]; const q = pts[(i + 1) % pts.length]; a += p[0] * q[1] - q[0] * p[1]; } return a / 2; };

/** Douglas-Peucker untuk poligon tertutup. */
function simplifyClosed(pts, tol) {
  const n = pts.length;
  if (n <= 4) return pts;
  let far = 0; let best = -1;
  for (let i = 1; i < n; i++) { const d = (pts[i][0] - pts[0][0]) ** 2 + (pts[i][1] - pts[0][1]) ** 2; if (d > best) { best = d; far = i; } }
  const keep = new Uint8Array(n); keep[0] = 1; keep[far] = 1;
  const stack = [[0, far], [far, n]]; // ruas [a,b] (b boleh = n -> kembali ke titik 0)
  while (stack.length) {
    const [a, b] = stack.pop();
    const A = pts[a]; const B = pts[b % n];
    const dx = B[0] - A[0]; const dy = B[1] - A[1]; const len = Math.hypot(dx, dy) || 1e-9;
    let md = -1; let mi = -1;
    for (let i = a + 1; i < b; i++) {
      const P = pts[i];
      const d = Math.abs(dy * (P[0] - A[0]) - dx * (P[1] - A[1])) / len;
      if (d > md) { md = d; mi = i; }
    }
    if (md > tol && mi > 0) { keep[mi] = 1; stack.push([a, mi], [mi, b]); }
  }
  const out = []; for (let i = 0; i < n; i++) if (keep[i]) out.push(pts[i]);
  return out.length >= 3 ? out : pts.slice(0, 3);
}

/** Potong sudut tangga piksel: tiap sudut diganti dua titik (maks 1 piksel dari sudut) -> diagonal mulus, sudut asli nyaris utuh. */
function cutCorners(pts) {
  const n = pts.length; const out = [];
  for (let i = 0; i < n; i++) {
    const p = pts[(i + n - 1) % n]; const c = pts[i]; const q = pts[(i + 1) % n];
    const la = Math.hypot(c[0] - p[0], c[1] - p[1]) || 1; const lb = Math.hypot(q[0] - c[0], q[1] - c[1]) || 1;
    const ca = Math.min(1, la / 2); const cb = Math.min(1, lb / 2);
    out.push([c[0] + ((p[0] - c[0]) / la) * ca, c[1] + ((p[1] - c[1]) / la) * ca], [c[0] + ((q[0] - c[0]) / lb) * cb, c[1] + ((q[1] - c[1]) / lb) * cb]);
  }
  return out;
}

/** Poligon -> path SVG: sudut tajam dipertahankan, tepi melengkung dihaluskan jadi kurva cubic. */
function smoothPath(pts, cornerDeg = 62) {
  const n = pts.length;
  const T = new Array(n); const corner = new Array(n);
  const cosLim = Math.cos((cornerDeg * Math.PI) / 180);
  for (let i = 0; i < n; i++) {
    const p = pts[(i + n - 1) % n]; const c = pts[i]; const q = pts[(i + 1) % n];
    const ax = c[0] - p[0]; const ay = c[1] - p[1]; const bx = q[0] - c[0]; const by = q[1] - c[1];
    const la = Math.hypot(ax, ay) || 1e-9; const lb = Math.hypot(bx, by) || 1e-9;
    corner[i] = (ax * bx + ay * by) / (la * lb) < cosLim;
    const tx = q[0] - p[0]; const ty = q[1] - p[1]; const tl = Math.hypot(tx, ty) || 1e-9;
    T[i] = [tx / tl, ty / tl];
  }
  let d = `M${f2(pts[0][0])} ${f2(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n; const a = pts[i]; const b = pts[j];
    if (corner[i] && corner[j]) { d += `L${f2(b[0])} ${f2(b[1])}`; continue; }
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]); const k = len / 3;
    const sx = b[0] - a[0]; const sy = b[1] - a[1]; const sl = len || 1e-9;
    const t1 = corner[i] ? [sx / sl, sy / sl] : T[i];
    const t2 = corner[j] ? [sx / sl, sy / sl] : T[j];
    d += `C${f2(a[0] + t1[0] * k)} ${f2(a[1] + t1[1] * k)} ${f2(b[0] - t2[0] * k)} ${f2(b[1] - t2[1] * k)} ${f2(b[0])} ${f2(b[1])}`;
  }
  return `${d}Z`;
}

/** Filter modus 3x3 (label terbanyak di sekitar menang; seri -> tetap). Menghapus garis tipis dan bercak 1-2 piksel. */
function modeFilter(labels, W, H, n, passes) {
  let src = labels; let dst = new Uint8Array(labels.length);
  const cnt = new Uint16Array(n);
  for (let k = 0; k < passes; k++) {
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const y0 = y > 0 ? y - 1 : 0; const y1 = y < H - 1 ? y + 1 : H - 1; const x0 = x > 0 ? x - 1 : 0; const x1 = x < W - 1 ? x + 1 : W - 1;
        for (let yy = y0; yy <= y1; yy++) for (let xx = x0; xx <= x1; xx++) cnt[src[yy * W + xx]]++;
        const own = src[y * W + x]; let best = own; let bc = cnt[own];
        for (let yy = y0; yy <= y1; yy++) for (let xx = x0; xx <= x1; xx++) { const l = src[yy * W + xx]; if (cnt[l] > bc) { bc = cnt[l]; best = l; } }
        dst[y * W + x] = best;
        for (let yy = y0; yy <= y1; yy++) for (let xx = x0; xx <= x1; xx++) cnt[src[yy * W + xx]] = 0;
      }
    }
    [src, dst] = [dst, src];
  }
  if (src !== labels) labels.set(src);
}

/* ------------------------------------------------ pipeline utama */

/**
 * @param {Buffer} buffer berkas gambar
 * @param {{colors?:number,size?:number,detail?:'low'|'medium'|'high',removeBackground?:boolean,maxPaths?:number}} o
 */
export async function vectorizeImage(buffer, o = {}) {
  let sharp;
  try { sharp = (await import('sharp')).default; } catch { throw Object.assign(new Error('Pustaka sharp belum terpasang di server.'), { code: 'NO_SHARP' }); }

  const colors = clamp(int(o.colors, 12), 2, 32);
  const size = clamp(int(o.size, 640), 100, 1200);
  const detail = DETAIL[o.detail] || DETAIL.medium;
  const maxPaths = clamp(int(o.maxPaths, 3000), 50, 10000);

  let raw;
  try {
    raw = await sharp(buffer, { failOn: 'none', limitInputPixels: 60_000_000 }).rotate()
      .resize({ width: size, height: size, fit: 'inside', kernel: 'lanczos3' })
      .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  } catch (e) {
    throw Object.assign(new Error('Gambar tidak bisa dibaca. Gunakan PNG, JPG, atau WebP yang valid.'), { code: 'BAD_IMAGE', cause: e });
  }
  const { data, info } = raw;
  const W = info.width; const H = info.height;

  // piksel hampir transparan -> kosong; sisanya dibuat solid agar palet bersih
  const px = Buffer.from(data);
  for (let i = 0; i < px.length; i += 4) { if (px[i + 3] < 128) { px[i] = px[i + 1] = px[i + 2] = px[i + 3] = 0; } else px[i + 3] = 255; }
  let hasTransparency = false;
  for (let i = 3; i < px.length; i += 4) if (px[i] === 0) { hasTransparency = true; break; }

  // kuantisasi warna (libimagequant lewat sharp), lalu baca kembali sebagai RGBA
  const quantPng = await sharp(px, { raw: { width: W, height: H, channels: 4 } }).png({ palette: true, colors, dither: 0, effort: 7 }).toBuffer();
  const q = (await sharp(quantPng).ensureAlpha().raw().toBuffer({ resolveWithObject: true })).data;

  const index = new Map(); const pal = [];
  const labels = new Uint8Array(W * H);
  const counts = [];
  for (let i = 0, p = 0; p < W * H; i += 4, p++) {
    const key = q[i + 3] === 0 ? -1 : (q[i] << 16) | (q[i + 1] << 8) | q[i + 2];
    let id = index.get(key);
    if (id === undefined) { id = pal.length; index.set(key, id); pal.push(key === -1 ? null : [q[i], q[i + 1], q[i + 2]]); counts.push(0); }
    labels[p] = id; counts[id]++;
  }

  // sharp membulatkan palet ke pangkat dua (6 -> 16, 24 -> 256): gabungkan warna terdekat sampai tepat `colors`
  {
    const mean = pal.map((c) => (c ? [...c] : null));
    const live = pal.map((_, i) => i).filter((i) => pal[i]);
    const remap = pal.map((_, i) => i);
    while (live.length > colors) {
      let best = Infinity; let ba = 0; let bb = 1;
      for (let a = 0; a < live.length; a++) {
        const ia = live[a];
        for (let b = a + 1; b < live.length; b++) {
          const ib = live[b];
          const d = ((counts[ia] * counts[ib]) / (counts[ia] + counts[ib])) * ((mean[ia][0] - mean[ib][0]) ** 2 + (mean[ia][1] - mean[ib][1]) ** 2 + (mean[ia][2] - mean[ib][2]) ** 2);
          if (d < best) { best = d; ba = a; bb = b; }
        }
      }
      const ia = live[ba]; const ib = live[bb]; const tot = counts[ia] + counts[ib];
      for (let k = 0; k < 3; k++) mean[ia][k] = (mean[ia][k] * counts[ia] + mean[ib][k] * counts[ib]) / tot;
      counts[ia] = tot; counts[ib] = 0;
      live.splice(bb, 1);
      for (let k = 0; k < remap.length; k++) if (remap[k] === ib) remap[k] = ia;
    }
    if (live.length !== pal.filter(Boolean).length) {
      const keepIds = pal.map((c, i) => (c === null ? i : null)).filter((i) => i !== null).concat(live); // label transparan + warna tersisa
      const newId = new Map(keepIds.map((id, n) => [id, n]));
      const nPal = keepIds.map((id) => (pal[id] === null ? null : mean[id].map(Math.round)));
      const nCounts = keepIds.map((id) => counts[id]);
      const lut = new Uint8Array(pal.length);
      for (let k = 0; k < pal.length; k++) lut[k] = newId.get(remap[k]);
      for (let p = 0; p < labels.length; p++) labels[p] = lut[labels[p]];
      pal.length = 0; pal.push(...nPal); counts.length = 0; counts.push(...nCounts);
    }
  }

  let skip = pal.findIndex((c) => c === null); // label transparan
  if (o.removeBackground && skip < 0) { // buang warna latar = warna paling sering di tepi gambar
    const edge = new Map();
    const bump = (x, y) => { const l = labels[y * W + x]; edge.set(l, (edge.get(l) || 0) + 1); };
    for (let x = 0; x < W; x++) { bump(x, 0); bump(x, H - 1); }
    for (let y = 0; y < H; y++) { bump(0, y); bump(W - 1, y); }
    skip = [...edge.entries()].sort((a, b) => b[1] - a[1])[0][0];
  }

  modeFilter(labels, W, H, pal.length, 2); // buang garis/warna peralihan setipis 1-3 piksel
  const loopsByLabel = traceLabels(labels, W, H, pal.length, skip);

  // saring bercak kecil; naikkan ambang otomatis bila jumlah path terlalu banyak
  let speckle = detail.speckle; let layers = [];
  for (let attempt = 0; attempt < 4; attempt++) {
    layers = []; let total = 0;
    for (let c = 0; c < pal.length; c++) {
      if (c === skip || !pal[c]) continue;
      const loops = loopsByLabel[c].filter((l) => Math.abs(area(l)) >= speckle);
      if (!loops.length) continue;
      total += loops.length;
      layers.push({ c, loops });
    }
    if (total <= maxPaths) break;
    speckle *= 2.5;
  }
  const pixelCount = new Map();
  for (let p = 0; p < labels.length; p++) pixelCount.set(labels[p], (pixelCount.get(labels[p]) || 0) + 1);
  layers.sort((a, b) => (pixelCount.get(b.c) || 0) - (pixelCount.get(a.c) || 0)); // warna terbanyak digambar paling bawah

  let paths = 0;
  const body = layers.map(({ c, loops }) => {
    const d = loops.map((l) => smoothPath(simplifyClosed(cutCorners(l), detail.tol))).join('');
    paths += loops.length;
    const col = hex(...pal[c]);
    return `<path fill="${col}" stroke="${col}" stroke-width="0.6" stroke-linejoin="round" fill-rule="evenodd" d="${d}"/>`;
  });

  // data-order="area": penanda untuk SVG to XML agar shape ditumpuk berdasarkan luas (besar di bawah)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" data-order="area" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">\n${body.join('\n')}\n</svg>\n`;
  return { svg, width: W, height: H, colors: layers.length, paths, hasTransparency, speckle };
}
