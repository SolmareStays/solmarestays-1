/**
 * Generate src/data/faqs.json from the FAQ arrays in scripts/prerender.mjs.
 *
 * 🔴 Why this exists: all 20 prerendered pages shipped FAQPage schema whose 68 Q&As
 * appeared NOWHERE in the visible page — a Google structured-data policy violation,
 * and 68 finished answers (including the management-fee and book-direct objections)
 * hidden from every human visitor. The React side needs the same data to render them.
 *
 * ⚖ prerender.mjs stays the single source; this file is GENERATED. Never hand-edit
 * src/data/faqs.json — edit the faq: array in prerender.mjs and rebuild. Runs as the
 * `prebuild` step so Vite always compiles against current data.
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = readFileSync(join(ROOT, 'scripts/prerender.mjs'), 'utf8');

// Find each `route: '...'` and the `faq: [...]` that follows it before the next route.
const routeRe = /^\s{4}route:\s*'([^']+)'/gm;
const marks = [];
let m;
while ((m = routeRe.exec(src))) marks.push({ route: m[1], idx: m.index });

const out = {};
for (let i = 0; i < marks.length; i++) {
  const start = marks[i].idx;
  const end = i + 1 < marks.length ? marks[i + 1].idx : src.length;
  const chunk = src.slice(start, end);
  const fi = chunk.indexOf('\n    faq: [');
  if (fi === -1) continue;
  // brace/bracket match from the opening [
  const open = chunk.indexOf('[', fi);
  let depth = 0, j = open;
  for (; j < chunk.length; j++) {
    const c = chunk[j];
    if (c === '[') depth++;
    else if (c === ']') { depth--; if (depth === 0) break; }
  }
  const literal = chunk.slice(open, j + 1);
  let arr;
  try { arr = eval(literal); } catch (e) { console.error('FAIL', marks[i].route, e.message); continue; }
  out[marks[i].route] = arr.map(({ q, a }) => ({ q, a }));
}
writeFileSync(join(ROOT, 'src/data/faqs.json'), JSON.stringify(out, null, 2) + '\n');
const routes = Object.keys(out);
console.log(`routes with FAQ: ${routes.length}`);
console.log(`total Q&As: ${routes.reduce((n, r) => n + out[r].length, 0)}`);
for (const r of routes) console.log(`  ${r.padEnd(52)} ${out[r].length}`);
