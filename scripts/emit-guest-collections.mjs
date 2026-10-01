/**
 * Compile src/data/guestCollections.ts and emit it as JSON so scripts/prerender.mjs
 * can build a static page per guest-intent collection.
 *
 * ⚖ guestCollections.ts stays the single source — it carries the types and the
 * reasoning about which intents justify a page. This exists only because
 * prerender.mjs is plain ESM and cannot import TypeScript.
 * ⛔ Never hand-edit src/data/guestCollections.generated.json.
 */
import { build } from 'esbuild';
import { unlinkSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const tmp = join(ROOT, 'src/data/.gc.tmp.mjs');

await build({
  entryPoints: [join(ROOT, 'src/data/guestCollections.ts')],
  outfile: tmp,
  format: 'esm',
  platform: 'node',
  bundle: false,
  logLevel: 'silent',
});

const { GUEST_COLLECTIONS } = await import(`file://${tmp}?t=${Date.now()}`);
unlinkSync(tmp);

writeFileSync(
  join(ROOT, 'src/data/guestCollections.generated.json'),
  JSON.stringify(GUEST_COLLECTIONS, null, 2) + '\n',
);

console.log(
  `guest collections: ${GUEST_COLLECTIONS.length} (${GUEST_COLLECTIONS.map(c => c.slug).join(', ')})`,
);
