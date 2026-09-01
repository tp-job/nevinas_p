/**
 * copy-data.mjs — ship the JSON data store with the compiled output.
 *
 * WHY THIS EXISTS
 *
 * `npm run build` is `tsc`, and tsc emits .js only — it does not copy .json.
 * At runtime `fileManager.ts` resolves its data directory as:
 *
 *     process.env.DATA_DIR || path.join(__dirname, '../data')
 *
 * In development `server/.env` sets `DATA_DIR=src/data`, so the real files are
 * found. `.env` is gitignored and has never been committed, so a deployed
 * instance does not get it, and the fallback applies: __dirname is
 * `dist/services`, making the data directory `dist/data` — which tsc left
 * empty.
 *
 * `init()` then does the damaging part: when a file is missing it writes an
 * empty one and carries on. Nothing throws, nothing 500s, and the API serves
 * `{"success":true,"count":0,"data":[]}` forever. That is exactly what the
 * deployed backend was returning for /api/blogs and /api/gallery while the
 * frontend was blamed for "not showing content".
 *
 * This script closes the gap at build time so `dist` is self-contained and the
 * deploy no longer depends on an env var that only exists on one machine.
 *
 * It is also deliberately LOUD. A missing or empty source file is the precise
 * condition that produced the silent outage, so it fails the build (or warns)
 * rather than quietly copying nothing — the build is the last place this can
 * still be caught cheaply.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const SERVER_ROOT = join(here, '..');
const SRC = join(SERVER_ROOT, 'src', 'data');
const OUT = join(SERVER_ROOT, 'dist', 'data');
const FILE_MANAGER = join(SERVER_ROOT, 'src', 'services', 'fileManager.ts');

/* The files the DataStore actually opens. Deliberately an explicit list and
   NOT a *.json glob: src/data also holds github.json.bak, which is a sync
   artifact the server never reads and must not ship. */
const DATA_FILES = ['blogs.json', 'projects.json', 'gallery.json', 'github.json'];

let failed = false;
const fail = (msg) => { console.error(`  ERROR  ${msg}`); failed = true; };
const warn = (msg) => console.warn(`  WARN   ${msg}`);

console.log('copy-data: src/data -> dist/data');

/* ── Drift guard ───────────────────────────────────────────────────────────
   fileManager.ts owns the real list. If someone adds a fifth collection there
   and not here, production would serve it empty and look fine — the same
   failure this script exists to prevent, one collection over. Catch it here
   instead of in a bug report three weeks later. */
if (existsSync(FILE_MANAGER)) {
  const declared = new Set(
    [...readFileSync(FILE_MANAGER, 'utf-8').matchAll(/['"`]([a-z0-9_-]+\.json)['"`]/gi)]
      .map((m) => m[1]),
  );
  for (const f of declared) {
    if (!DATA_FILES.includes(f)) {
      fail(`fileManager.ts reads "${f}" but copy-data.mjs does not copy it. ` +
           `Add it to DATA_FILES, or production will serve it empty.`);
    }
  }
} else {
  warn(`could not find ${FILE_MANAGER} — drift guard skipped`);
}

if (!existsSync(SRC)) {
  fail(`source directory missing: ${SRC}`);
} else {
  mkdirSync(OUT, { recursive: true });

  for (const file of DATA_FILES) {
    const from = join(SRC, file);
    if (!existsSync(from)) {
      fail(`${file} not found in src/data — the server would create an empty one at runtime`);
      continue;
    }

    const raw = readFileSync(from, 'utf-8');

    /* Parse rather than blind-copy: shipping malformed JSON turns a silent
       empty response into a runtime crash on first read. Better to know now. */
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      fail(`${file} is not valid JSON — ${err.message}`);
      continue;
    }

    const count = Array.isArray(parsed)
      ? parsed.length
      : Object.values(parsed).reduce((n, v) => n + (Array.isArray(v) ? v.length : 0), 0);

    if (count === 0) {
      warn(`${file} is empty — the deployed API will report count: 0 for it`);
    }

    writeFileSync(join(OUT, file), raw, 'utf-8');
    console.log(`  copied ${file.padEnd(15)} ${String(count).padStart(4)} records`);
  }

  const stray = readdirSync(OUT).filter((f) => !DATA_FILES.includes(f));
  if (stray.length) warn(`unexpected files in dist/data: ${stray.join(', ')}`);
}

if (failed) {
  console.error('copy-data: FAILED — dist/data is not usable, build stopped.');
  process.exit(1);
}
console.log('copy-data: ok');
