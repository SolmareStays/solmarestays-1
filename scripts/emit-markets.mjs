/**
 * Compile src/data/markets.ts and emit the PUBLISHED markets as JSON so
 * scripts/prerender.mjs can build a static page per market.
 *
 * ⚖ markets.ts stays the single source — it carries the types, the sources and the
 * reasoning. This file exists only because prerender.mjs is plain ESM and cannot
 * import TypeScript. Never hand-edit src/data/markets.generated.json.
 *
 * 🔴 Only markets with `verified: true` are emitted. That flag means every permit and
 * tax claim on the page was read from the jurisdiction's own ordinance or finance page.
 * An unverified market silently stays out of the build rather than shipping a guess
 * about what is legal at somebody's address.
 */
import { build } from 'esbuild';
import { readFileSync, writeFileSync, unlinkSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const tmp = join(ROOT, 'src/data/.markets.tmp.mjs');

await build({
  entryPoints: [join(ROOT, 'src/data/markets.ts')],
  outfile: tmp,
  format: 'esm',
  platform: 'node',
  bundle: false,
  logLevel: 'silent',
});

const { MARKETS, PUBLISHED_MARKETS } = await import(`file://${tmp}?t=${Date.now()}`);
unlinkSync(tmp);

writeFileSync(
  join(ROOT, 'src/data/markets.generated.json'),
  JSON.stringify(PUBLISHED_MARKETS, null, 2) + '\n',
);

const held = MARKETS.filter(m => !m.verified).map(m => m.slug);
console.log(`markets: ${PUBLISHED_MARKETS.length} published, ${held.length} held for verification`);
if (held.length) console.log(`  held: ${held.join(', ')}`);
