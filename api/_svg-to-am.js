// SVG -> XML Alight Motion (shape vektor). Tanpa dependensi, agar mudah diuji.
// Format shape mengikuti ekspor Alight Motion 5.x: <scene> berisi <shape> dengan <transform><location>,
// <fillColor>, <path-stroke> dan <path d="M x y L x y C x1 y1, x2 y2, x y">. Warna #AARRGGBB.
// Batasan Alight Motion yang diketahui: lubang pada satu <path> tidak tampil (tiap potongan digambar penuh),
// jadi tiap potongan dijadikan shape sendiri; potongan terbesar di bawah, terkecil di atas.

const KAPPA = 0.5522847498307936;
const NAMED = {
  black: '#000000', white: '#ffffff', red: '#ff0000', green: '#008000', blue: '#0000ff', yellow: '#ffff00', cyan: '#00ffff', aqua: '#00ffff',
  magenta: '#ff00ff', fuchsia: '#ff00ff', gray: '#808080', grey: '#808080', silver: '#c0c0c0', maroon: '#800000', olive: '#808000', lime: '#00ff00',
  teal: '#008080', navy: '#000080', purple: '#800080', orange: '#ffa500', pink: '#ffc0cb', brown: '#a52a2a', gold: '#ffd700', violet: '#ee82ee',
  indigo: '#4b0082', crimson: '#dc143c', coral: '#ff7f50', salmon: '#fa8072', khaki: '#f0e68c', tan: '#d2b48c', beige: '#f5f5dc', ivory: '#fffff0',
  lightgray: '#d3d3d3', lightgrey: '#d3d3d3', darkgray: '#a9a9a9', darkgrey: '#a9a9a9', dimgray: '#696969', lightblue: '#add8e6', darkblue: '#00008b',
  skyblue: '#87ceeb', lightgreen: '#90ee90', darkgreen: '#006400', darkred: '#8b0000', transparent: '#00000000',
};

/* ---------------------------------------------------------- XML mini parser */

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
const decode = (s) => s.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e) => (e[0] === '#' ? String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)) : ENT[e] ?? m));

export function parseXml(src) {
  const text = String(src).replace(/<\?[\s\S]*?\?>/g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/<!DOCTYPE[^>[]*(\[[\s\S]*?\])?\s*>/gi, '').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, (_, c) => c.replace(/</g, '&lt;'));
  const root = { name: '#root', attrs: {}, children: [], text: '' };
  const stack = [root];
  const re = /<(\/?)([A-Za-z_][\w:.-]*)((?:\s+[^\s=/>]+(?:\s*=\s*(?:"[^"]*"|'[^']*'))?)*)\s*(\/?)>|([^<]+)/g;
  let m;
  while ((m = re.exec(text))) {
    if (m[5] !== undefined) { stack[stack.length - 1].text += m[5]; continue; }
    const [, close, name, rawAttrs, selfClose] = m;
    const cur = stack[stack.length - 1];
    if (close) {
      for (let i = stack.length - 1; i > 0; i--) if (stack[i].name === name) { stack.length = i; break; }
      continue;
    }
    const attrs = {};
    for (const a of rawAttrs.matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'))?/g)) attrs[a[1]] = decode(a[2] ?? a[3] ?? '');
    const node = { name: name.replace(/^.*:/, ''), attrs, children: [], text: '' };
    cur.children.push(node);
    if (!selfClose) stack.push(node);
  }
  return root.children.find((n) => n.name === 'svg') || null;
}

/* ---------------------------------------------------------- matriks & warna */

const I = [1, 0, 0, 1, 0, 0];
const mul = (m, n) => [m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1], m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3], m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5]];
const apply = (m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];

function parseTransform(str) {
  let m = I;
  if (!str) return m;
  for (const t of String(str).matchAll(/(matrix|translate|scale|rotate|skewX|skewY)\s*\(([^)]*)\)/g)) {
    const a = (t[2].match(/[-+]?(?:\d*\.\d+|\d+\.?)(?:e[-+]?\d+)?/gi) || []).map(Number);
    let n = I;
    switch (t[1]) {
      case 'matrix': if (a.length >= 6) n = a.slice(0, 6); break;
      case 'translate': n = [1, 0, 0, 1, a[0] || 0, a[1] || 0]; break;
      case 'scale': n = [a[0] ?? 1, 0, 0, a[1] ?? a[0] ?? 1, 0, 0]; break;
      case 'rotate': {
        const r = ((a[0] || 0) * Math.PI) / 180; const c = Math.cos(r); const s = Math.sin(r);
        n = [c, s, -s, c, 0, 0];
        if (a.length >= 3) n = mul(mul([1, 0, 0, 1, a[1], a[2]], n), [1, 0, 0, 1, -a[1], -a[2]]);
        break;
      }
      case 'skewX': n = [1, 0, Math.tan(((a[0] || 0) * Math.PI) / 180), 1, 0, 0]; break;
      case 'skewY': n = [1, Math.tan(((a[0] || 0) * Math.PI) / 180), 0, 1, 0, 0]; break;
      default: break;
    }
    m = mul(m, n);
  }
  return m;
}

/** -> [r,g,b,a(0-1)], null (none), atau undefined (tidak dikenali). */
export function parseColor(v) {
  if (v == null) return undefined;
  let s = String(v).trim().toLowerCase();
  if (!s || s === 'inherit') return undefined;
  if (s === 'none') return null;
  if (s === 'currentcolor') s = '#000000';
  if (NAMED[s]) s = NAMED[s];
  let m = s.match(/^#([0-9a-f]{3,8})$/);
  if (m) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join('');
    if (h.length === 6) return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), 1];
    if (h.length === 8) return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), parseInt(h.slice(6, 8), 16) / 255];
    return undefined;
  }
  m = s.match(/^rgba?\(([^)]+)\)$/);
  if (m) {
    const p = m[1].split(/[\s,/]+/).filter(Boolean);
    const ch = (x) => (x.endsWith('%') ? (parseFloat(x) / 100) * 255 : parseFloat(x));
    const al = p[3] === undefined ? 1 : p[3].endsWith('%') ? parseFloat(p[3]) / 100 : parseFloat(p[3]);
    return [ch(p[0]), ch(p[1]), ch(p[2]), al].map((x, i) => (i < 3 ? Math.max(0, Math.min(255, Math.round(x))) : Math.max(0, Math.min(1, x))));
  }
  return undefined;
}

const hex2 = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
const amColor = ([r, g, b, a]) => `#${hex2(a * 255)}${hex2(r)}${hex2(g)}${hex2(b)}`;

/* ---------------------------------------------------------- path -> subpath */

/** Subpath: { start:[x,y], segs:[{t:'L',p}|{t:'C',c1,c2,p}], closed } */
function arcToCubics(x1, y1, rx, ry, phiDeg, fa, fs, x2, y2) {
  if (x1 === x2 && y1 === y2) return [];
  rx = Math.abs(rx); ry = Math.abs(ry);
  if (!rx || !ry) return [{ t: 'L', p: [x2, y2] }];
  const phi = (phiDeg * Math.PI) / 180; const cp = Math.cos(phi); const sp = Math.sin(phi);
  const dx = (x1 - x2) / 2; const dy = (y1 - y2) / 2;
  const x1p = cp * dx + sp * dy; const y1p = -sp * dx + cp * dy;
  const lam = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lam > 1) { const k = Math.sqrt(lam); rx *= k; ry *= k; }
  const num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
  const den = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
  const co = (fa === fs ? -1 : 1) * Math.sqrt(Math.max(0, num / den));
  const cxp = (co * rx * y1p) / ry; const cyp = (-co * ry * x1p) / rx;
  const cx = cp * cxp - sp * cyp + (x1 + x2) / 2; const cy = sp * cxp + cp * cyp + (y1 + y2) / 2;
  const ang = (ux, uy, vx, vy) => Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
  const th1 = ang(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry);
  let dth = ang((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry);
  if (!fs && dth > 0) dth -= 2 * Math.PI; else if (fs && dth < 0) dth += 2 * Math.PI;
  const n = Math.max(1, Math.ceil(Math.abs(dth) / (Math.PI / 2) - 1e-9));
  const step = dth / n; const t = (4 / 3) * Math.tan(step / 4);
  const out = [];
  for (let i = 0; i < n; i++) {
    const a1 = th1 + i * step; const a2 = a1 + step;
    // titik pada elips di sudut a, digeser sepanjang garis singgung sebesar (dxr, dyr) * jari-jari
    const p = (a, dxr, dyr) => { const X = rx * (Math.cos(a) - dxr * Math.sin(a)); const Y = ry * (Math.sin(a) + dyr * Math.cos(a)); return [cp * X - sp * Y + cx, sp * X + cp * Y + cy]; };
    out.push({ t: 'C', c1: p(a1, t, t), c2: p(a2, -t, -t), p: i === n - 1 ? [x2, y2] : p(a2, 0, 0) });
  }
  return out;
}

export function parsePathData(d) {
  const tokens = String(d || '').match(/[MmLlHhVvCcSsQqTtAaZz]|[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g) || [];
  const subs = []; let cur = null; let i = 0; let cmd = ''; let x = 0; let y = 0; let sx = 0; let sy = 0; let lastC = null; let lastQ = null;
  const num = () => { const v = parseFloat(tokens[i++]); return Number.isFinite(v) ? v : 0; };
  const flag = () => { const t = tokens[i++]; return t === '1' ? 1 : 0; };
  const isNum = () => i < tokens.length && !/^[A-Za-z]$/.test(tokens[i]);
  const begin = (px, py) => { cur = { start: [px, py], segs: [], closed: false }; subs.push(cur); sx = px; sy = py; };
  while (i < tokens.length) {
    if (/^[A-Za-z]$/.test(tokens[i])) cmd = tokens[i++]; else if (!cmd) { i++; continue; }
    const rel = cmd === cmd.toLowerCase(); const C = cmd.toUpperCase();
    if (C === 'Z') { if (cur) { cur.closed = true; x = sx; y = sy; cur = null; } lastC = lastQ = null; if (!isNum()) continue; cmd = rel ? 'l' : 'L'; continue; }
    if (!isNum()) { cmd = ''; continue; }
    if (C === 'M') {
      x = num() + (rel ? x : 0); y = num() + (rel ? y : 0); begin(x, y); cmd = rel ? 'l' : 'L'; lastC = lastQ = null;
    } else {
      if (!cur) begin(x, y);
      if (C === 'L') { x = num() + (rel ? x : 0); y = num() + (rel ? y : 0); cur.segs.push({ t: 'L', p: [x, y] }); lastC = lastQ = null; }
      else if (C === 'H') { x = num() + (rel ? x : 0); cur.segs.push({ t: 'L', p: [x, y] }); lastC = lastQ = null; }
      else if (C === 'V') { y = num() + (rel ? y : 0); cur.segs.push({ t: 'L', p: [x, y] }); lastC = lastQ = null; }
      else if (C === 'C') {
        const c1 = [num() + (rel ? x : 0), num() + (rel ? y : 0)]; const c2 = [num() + (rel ? x : 0), num() + (rel ? y : 0)]; const p = [num() + (rel ? x : 0), num() + (rel ? y : 0)];
        cur.segs.push({ t: 'C', c1, c2, p }); lastC = c2; lastQ = null; [x, y] = p;
      } else if (C === 'S') {
        const c1 = lastC ? [2 * x - lastC[0], 2 * y - lastC[1]] : [x, y];
        const c2 = [num() + (rel ? x : 0), num() + (rel ? y : 0)]; const p = [num() + (rel ? x : 0), num() + (rel ? y : 0)];
        cur.segs.push({ t: 'C', c1, c2, p }); lastC = c2; lastQ = null; [x, y] = p;
      } else if (C === 'Q' || C === 'T') {
        let q;
        if (C === 'Q') q = [num() + (rel ? x : 0), num() + (rel ? y : 0)]; else q = lastQ ? [2 * x - lastQ[0], 2 * y - lastQ[1]] : [x, y];
        const p = [num() + (rel ? x : 0), num() + (rel ? y : 0)];
        cur.segs.push({ t: 'C', c1: [x + (2 / 3) * (q[0] - x), y + (2 / 3) * (q[1] - y)], c2: [p[0] + (2 / 3) * (q[0] - p[0]), p[1] + (2 / 3) * (q[1] - p[1])], p });
        lastQ = q; lastC = null; [x, y] = p;
      } else if (C === 'A') {
        const rx = num(); const ry = num(); const rot = num(); const fa = flag(); const fs = flag();
        const p = [num() + (rel ? x : 0), num() + (rel ? y : 0)];
        for (const s of arcToCubics(x, y, rx, ry, rot, fa, fs, p[0], p[1])) cur.segs.push(s);
        [x, y] = p; lastC = lastQ = null;
      } else { i++; }
    }
  }
  return subs.filter((s) => s.segs.length);
}

const ellipseSub = (cx, cy, rx, ry) => ({
  start: [cx + rx, cy], closed: true,
  segs: [
    { t: 'C', c1: [cx + rx, cy + ry * KAPPA], c2: [cx + rx * KAPPA, cy + ry], p: [cx, cy + ry] },
    { t: 'C', c1: [cx - rx * KAPPA, cy + ry], c2: [cx - rx, cy + ry * KAPPA], p: [cx - rx, cy] },
    { t: 'C', c1: [cx - rx, cy - ry * KAPPA], c2: [cx - rx * KAPPA, cy - ry], p: [cx, cy - ry] },
    { t: 'C', c1: [cx + rx * KAPPA, cy - ry], c2: [cx + rx, cy - ry * KAPPA], p: [cx + rx, cy] },
  ],
});
const polyline = (pts, closed) => ({ start: pts[0], segs: pts.slice(1).map((p) => ({ t: 'L', p })), closed });

/* ---------------------------------------------------------- geometri */

const flatten = (sub) => {
  const pts = [sub.start]; let c = sub.start;
  for (const s of sub.segs) {
    if (s.t === 'L') pts.push(s.p);
    else for (let k = 1; k <= 8; k++) { const t = k / 8; const u = 1 - t; pts.push([u * u * u * c[0] + 3 * u * u * t * s.c1[0] + 3 * u * t * t * s.c2[0] + t * t * t * s.p[0], u * u * u * c[1] + 3 * u * u * t * s.c1[1] + 3 * u * t * t * s.c2[1] + t * t * t * s.p[1]]); }
    c = s.p;
  }
  return pts;
};
const signedArea = (pts) => { let a = 0; for (let i = 0; i < pts.length; i++) { const p = pts[i]; const q = pts[(i + 1) % pts.length]; a += p[0] * q[1] - q[0] * p[1]; } return a / 2; };
const inside = (pt, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { if ((poly[i][1] > pt[1]) !== (poly[j][1] > pt[1]) && pt[0] < ((poly[j][0] - poly[i][0]) * (pt[1] - poly[i][1])) / (poly[j][1] - poly[i][1]) + poly[i][0]) c = !c; } return c; };
const bbox = (pts) => { let x0 = Infinity; let y0 = Infinity; let x1 = -Infinity; let y1 = -Infinity; for (const [x, y] of pts) { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; } return [x0, y0, x1, y1]; };

/* ---------------------------------------------------------- SVG -> daftar bentuk */

const num = (v, d = 0) => { const n = parseFloat(v); return Number.isFinite(n) ? n : d; };
const parseStyle = (s) => Object.fromEntries(String(s || '').split(';').map((p) => p.split(':').map((x) => x.trim())).filter((p) => p.length >= 2 && p[0]).map((p) => [p[0], p.slice(1).join(':')]));
const PROPS = ['fill', 'stroke', 'opacity', 'fill-opacity', 'stroke-opacity', 'stroke-width', 'fill-rule', 'display', 'visibility'];

function collect(svg, warnings) {
  // gradient -> warna stop pertama (pendekatan)
  const grads = {};
  (function scan(n) {
    if (/Gradient$/.test(n.name) && n.attrs.id) {
      const stop = n.children.find((c) => c.name === 'stop');
      const st = stop ? { ...parseStyle(stop.attrs.style), ...(stop.attrs['stop-color'] ? { 'stop-color': stop.attrs['stop-color'] } : {}) } : {};
      grads[n.attrs.id] = { color: parseColor(st['stop-color']) || null, href: (n.attrs.href || n.attrs['xlink:href'] || '').replace(/^#/, '') };
    }
    n.children.forEach(scan);
  }(svg));
  const resolvePaint = (v) => {
    const m = String(v || '').match(/url\(\s*#([^)\s]+)\s*\)/);
    if (!m) return parseColor(v);
    let g = grads[m[1]]; let guard = 0;
    while (g && !g.color && g.href && guard++ < 5) g = grads[g.href];
    warnings.add('Gradient diganti warna pertamanya (XML Alight Motion ini hanya mendukung warna solid).');
    return g && g.color ? g.color : [128, 128, 128, 1];
  };

  const out = []; // { subs (sudah ditransform), fill, stroke, evenodd }
  const SKIP = new Set(['defs', 'clipPath', 'mask', 'symbol', 'marker', 'pattern', 'style', 'title', 'desc', 'metadata', 'linearGradient', 'radialGradient', 'filter']);
  const UNSUPPORTED = new Set(['text', 'image', 'use', 'foreignObject']);

  (function walk(n, mat, inh) {
    if (SKIP.has(n.name)) {
      if (n.name === 'style' && n.text.trim()) warnings.add('Blok <style> (CSS) tidak didukung: gunakan atribut fill/stroke langsung.');
      if (n.name === 'clipPath' || n.name === 'mask') warnings.add('clipPath/mask diabaikan.');
      return;
    }
    if (UNSUPPORTED.has(n.name)) { warnings.add(`Elemen <${n.name}> tidak didukung dan dilewati.`); return; }
    const a = { ...n.attrs, ...parseStyle(n.attrs.style) };
    const st = { ...inh };
    for (const k of PROPS) if (a[k] !== undefined && a[k] !== 'inherit') st[k] = a[k];
    if (st.display === 'none' || st.visibility === 'hidden') return;
    const m = mul(mat, parseTransform(a.transform));
    const opacity = (inh._op ?? 1) * (a.opacity !== undefined ? num(a.opacity, 1) : 1);
    st._op = opacity;

    let subs = null;
    switch (n.name) {
      case 'path': subs = parsePathData(a.d); break;
      case 'rect': {
        const x = num(a.x); const y = num(a.y); const w = num(a.width); const h = num(a.height);
        if (w <= 0 || h <= 0) break;
        let rx = a.rx !== undefined ? num(a.rx) : a.ry !== undefined ? num(a.ry) : 0; let ry = a.ry !== undefined ? num(a.ry) : rx;
        rx = Math.min(rx, w / 2); ry = Math.min(ry, h / 2);
        if (rx > 0 && ry > 0) {
          const kx = rx * KAPPA; const ky = ry * KAPPA;
          subs = [{ start: [x + rx, y], closed: true, segs: [
            { t: 'L', p: [x + w - rx, y] }, { t: 'C', c1: [x + w - rx + kx, y], c2: [x + w, y + ry - ky], p: [x + w, y + ry] },
            { t: 'L', p: [x + w, y + h - ry] }, { t: 'C', c1: [x + w, y + h - ry + ky], c2: [x + w - rx + kx, y + h], p: [x + w - rx, y + h] },
            { t: 'L', p: [x + rx, y + h] }, { t: 'C', c1: [x + rx - kx, y + h], c2: [x, y + h - ry + ky], p: [x, y + h - ry] },
            { t: 'L', p: [x, y + ry] }, { t: 'C', c1: [x, y + ry - ky], c2: [x + rx - kx, y], p: [x + rx, y] },
          ] }];
        } else subs = [polyline([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], true)];
        break;
      }
      case 'circle': { const r = num(a.r); if (r > 0) subs = [ellipseSub(num(a.cx), num(a.cy), r, r)]; break; }
      case 'ellipse': { const rx = num(a.rx); const ry = num(a.ry); if (rx > 0 && ry > 0) subs = [ellipseSub(num(a.cx), num(a.cy), rx, ry)]; break; }
      case 'line': subs = [polyline([[num(a.x1), num(a.y1)], [num(a.x2), num(a.y2)]], false)]; break;
      case 'polyline': case 'polygon': {
        const v = (String(a.points || '').match(/[-+]?(?:\d*\.\d+|\d+\.?)(?:e[-+]?\d+)?/gi) || []).map(Number); const pts = [];
        for (let k = 0; k + 1 < v.length; k += 2) pts.push([v[k], v[k + 1]]);
        if (pts.length >= 2) subs = [polyline(pts, n.name === 'polygon')];
        break;
      }
      default: break;
    }
    if (subs && subs.length) {
      const isLine = n.name === 'line' || n.name === 'polyline';
      let fill = st.fill === undefined ? [0, 0, 0, 1] : resolvePaint(st.fill);
      if (fill === undefined) fill = [0, 0, 0, 1];
      if (isLine && st.fill === undefined) fill = null;
      let stroke = st.stroke === undefined ? null : resolvePaint(st.stroke);
      if (stroke === undefined) stroke = null;
      const fo = st['fill-opacity'] !== undefined ? num(st['fill-opacity'], 1) : 1; const so = st['stroke-opacity'] !== undefined ? num(st['stroke-opacity'], 1) : 1;
      if (fill) fill = [fill[0], fill[1], fill[2], fill[3] * fo * opacity];
      if (stroke) stroke = [stroke[0], stroke[1], stroke[2], stroke[3] * so * opacity];
      // garis sewarna yang tipis = penutup celah hasil tracing, bukan outline
      if (fill && stroke && fill[0] === stroke[0] && fill[1] === stroke[1] && fill[2] === stroke[2] && num(st['stroke-width'], 1) <= 1.5) stroke = null;
      const tsubs = subs.map((s) => ({ start: apply(m, s.start), closed: s.closed, segs: s.segs.map((g) => (g.t === 'L' ? { t: 'L', p: apply(m, g.p) } : { t: 'C', c1: apply(m, g.c1), c2: apply(m, g.c2), p: apply(m, g.p) })) }));
      if (fill || stroke) out.push({ subs: tsubs, fill, stroke, evenodd: st['fill-rule'] === 'evenodd' });
    }
    for (const c of n.children) walk(c, m, st);
  }(svg, I, {}));
  return out;
}

/* ---------------------------------------------------------- keluaran XML */

const f2 = (v) => { const s = (Math.round(v * 100) / 100).toFixed(2); return s === '-0.00' ? '0.00' : s; };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

function pathD(sub, mapPt, closeIt) {
  let d = `M ${f2(mapPt(sub.start)[0])} ${f2(mapPt(sub.start)[1])}`;
  for (const s of sub.segs) {
    if (s.t === 'L') { const p = mapPt(s.p); d += `L ${f2(p[0])} ${f2(p[1])}`; }
    else { const a = mapPt(s.c1); const b = mapPt(s.c2); const p = mapPt(s.p); d += `C ${f2(a[0])} ${f2(a[1])}, ${f2(b[0])} ${f2(b[1])}, ${f2(p[0])} ${f2(p[1])}`; }
  }
  if (closeIt) { const last = sub.segs[sub.segs.length - 1].p; if (Math.abs(last[0] - sub.start[0]) > 1e-6 || Math.abs(last[1] - sub.start[1]) > 1e-6) { const p = mapPt(sub.start); d += `L ${f2(p[0])} ${f2(p[1])}`; } }
  return d;
}

/**
 * @param {string} svgText
 * @param {{width?:number,height?:number,fps?:number,duration?:number,bgcolor?:string,scale?:number,title?:string,maxShapes?:number,order?:'document'|'area',ffver?:number,amver?:number}} o
 * @returns {{xml:string, shapes:number, width:number, height:number, order:string, warnings:string[], dropped:{holes:number,tiny:number,limit:number}}}
 */
export function svgToAlightXml(svgText, o = {}) {
  const warnings = new Set();
  if (String(svgText).length > 6_000_000) throw Object.assign(new Error('SVG terlalu besar.'), { code: 'TOO_COMPLEX' });
  const svg = parseXml(svgText);
  if (!svg) throw Object.assign(new Error('Berkas bukan SVG yang valid (tag <svg> tidak ditemukan).'), { code: 'BAD_SVG' });

  const W = Math.round(Math.max(16, Math.min(8192, num(o.width, 1080))));
  const H = Math.round(Math.max(16, Math.min(8192, num(o.height, 1920))));
  const fps = Math.round(Math.max(1, Math.min(240, num(o.fps, 60))));
  const total = Math.round(Math.max(100, Math.min(600000, num(o.duration, 5000))));
  const fit = Math.max(0.05, Math.min(1, num(o.scale, 0.9)));
  const maxShapes = Math.round(Math.max(1, Math.min(3000, num(o.maxShapes, 500))));
  const bg = /^#[0-9a-f]{8}$/i.test(o.bgcolor || '') ? o.bgcolor.toLowerCase() : '#ff000000';
  // urutan tumpukan: 'document' (SVG desain) atau 'area' (hasil tracing: terbesar di bawah).
  // Otomatis: 'area' bila SVG ditandai data-order="area" (dibuat oleh Image to SVG).
  const order = o.order === 'area' || o.order === 'document' ? o.order : svg.attrs['data-order'] === 'area' ? 'area' : 'document';

  const items = collect(svg, warnings);
  if (!items.length) throw Object.assign(new Error('Tidak ada bentuk yang bisa dikonversi di SVG ini.'), { code: 'EMPTY_SVG' });
  const totalSubs = items.reduce((n, it) => n + it.subs.length, 0);
  if (totalSubs > 30000) throw Object.assign(new Error(`SVG terlalu kompleks (${totalSubs} potongan, maksimal 30.000). Sederhanakan SVG atau kurangi detail.`), { code: 'TOO_COMPLEX' });

  // area gambar: viewBox > width/height > bbox isi
  let vb = String(svg.attrs.viewBox || '').split(/[\s,]+/).map(Number);
  if (vb.length !== 4 || vb.some((v) => !Number.isFinite(v)) || vb[2] <= 0 || vb[3] <= 0) {
    const w = parseFloat(svg.attrs.width); const h = parseFloat(svg.attrs.height);
    if (w > 0 && h > 0 && !/%/.test(svg.attrs.width + svg.attrs.height)) vb = [0, 0, w, h];
    else { const all = items.flatMap((it) => it.subs.flatMap(flatten)); const b = bbox(all); vb = [b[0], b[1], Math.max(1, b[2] - b[0]), Math.max(1, b[3] - b[1])]; }
  }
  const s = Math.min(W / vb[2], H / vb[3]) * fit;
  const cx = vb[0] + vb[2] / 2; const cy = vb[1] + vb[3] / 2;
  const mapPt = ([x, y]) => [(x - cx) * s, (y - cy) * s]; // pusat gambar -> (0,0); lokasi shape = pusat kanvas

  // tiap potongan = shape sendiri (besar -> kecil); lubang dibuang
  const shapes = []; const dropped = { holes: 0, tiny: 0, limit: 0 };
  for (const it of items) {
    const info = it.subs.map((sub) => {
      const pts = flatten(sub).map(mapPt);
      const sa = signedArea(pts);
      return { sub, poly: pts, bb: bbox(pts), area: Math.abs(sa), sign: Math.sign(sa) || 1, start: pts[0] };
    });
    const sorted = [...info].sort((a, b) => b.area - a.area);
    for (const cand of sorted) {
      const closedFill = !!it.fill && cand.poly.length >= 3 && sorted.length <= 4000; // >4000 potongan: lewati deteksi lubang (hindari O(n^2))
      if (closedFill) {
        const containers = sorted.filter((o2) => o2 !== cand && o2.area > cand.area
          && cand.start[0] >= o2.bb[0] && cand.start[0] <= o2.bb[2] && cand.start[1] >= o2.bb[1] && cand.start[1] <= o2.bb[3] && inside(cand.start, o2.poly));
        const hole = it.evenodd ? containers.length % 2 === 1 : containers.length > 0 && containers[containers.length - 1].sign !== cand.sign && containers.length % 2 === 1;
        if (hole && !it.stroke) { dropped.holes++; continue; }
      }
      if (cand.area < 0.25 && !it.stroke) { dropped.tiny++; continue; }
      shapes.push({ it, cand, area: cand.area });
    }
  }
  if (order === 'area') shapes.sort((a, b) => b.area - a.area); // stabil: sama besar tetap urut dokumen
  if (dropped.holes) warnings.add(`${dropped.holes} lubang dibuang: Alight Motion tidak menampilkan lubang pada shape. Bentuk di dalam lubang yang digambar di atasnya tetap tampil.`);
  if (items.some((it) => it.stroke)) warnings.add('Lebar garis tepi (stroke) belum dibawa ke Alight Motion; dipakai lebar bawaan.');

  let keep = shapes;
  if (shapes.length > maxShapes) {
    const cut = [...shapes].map((x) => x.area).sort((a, b) => b - a)[maxShapes - 1];
    keep = shapes.filter((x) => x.area >= cut).slice(0, maxShapes);
    dropped.limit = shapes.length - keep.length;
    warnings.add(`${dropped.limit} shape terkecil dibuang karena melebihi batas ${maxShapes} (naikkan max_shapes bila perlu).`);
  }

  const seed = 100000 + Math.floor(Math.random() * 800000);
  const body = keep.map((x, i) => {
    const { it, cand } = x;
    const filled = !!it.fill;
    const d = pathD(cand.sub, mapPt, (cand.sub.closed || filled) && cand.sub.segs.length > 0);
    return `  <shape id="${seed + i}" label="${esc(`Shape ${i + 1}`)}" startTime="0" endTime="${total}" fillType="color" mediaFillMode="fill">
    <transform>
      <location value="${f2(W / 2)},${f2(H / 2)},0.000000" />
    </transform>
    <fillColor value="${amColor(it.fill || [0, 0, 0, 0])}" />${it.stroke ? `
    <path-stroke direction="centered" end-size="1.500000">
      <color value="${amColor(it.stroke)}" />
    </path-stroke>` : ''}
    <path d="${d}" />
  </shape>`;
  });

  const title = esc(String(o.title || 'SVG Vector').slice(0, 60));
  const xml = `<?xml version='1.0' encoding='UTF-8' ?>
<scene title="${title}" width="${W}" height="${H}" exportWidth="${W}" exportHeight="${H}" precompose="dynamicResolution" bgcolor="${bg}" totalTime="${total}" fps="${fps}" modifiedTime="${Date.now()}" amver="${Math.round(num(o.amver, 103719))}" ffver="${Math.round(num(o.ffver, 106))}">
${body.join('\n')}
</scene>
`;
  return { xml, shapes: keep.length, width: W, height: H, order, warnings: [...warnings], dropped };
}
