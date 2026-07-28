/**
 * optimize-models.mjs — GLB asset pipeline
 *
 * WHY THIS EXISTS
 * ───────────────────────────────────────────────────────────────────────────
 * The raw models exported from Tripo land at ~15.7 MB each: ~500k triangles of
 * *uncompressed* float32 geometry plus three 2k JPEG maps. Shipping one of
 * those is larger than the entire rest of the site's JS payload combined, and
 * this project has already paid for one homepage performance regression (see
 * .claude/CLAUDE.md rule 1). A 15 MB decorative centrepiece is not negotiable
 * on a portfolio that is itself the proof of "Performance Oriented".
 *
 * The pipeline below runs three lossy-but-invisible steps:
 *
 *   weld     — merge duplicate vertices so `simplify` has a real topology to
 *              collapse. FB_ngon_encoding warns here; it is a Facebook authoring
 *              hint with no runtime meaning and is safe to drop.
 *   simplify — quadric decimation. A slowly-rotating background sculpture never
 *              shows the difference between 500k and 60k triangles at the sizes
 *              we render it, but the GPU and the download very much do.
 *   resize   — cap texture maps. 2k maps cost 5.6 MB of VRAM *each* after
 *              mipmaps; 1k is indistinguishable at this on-screen size.
 *   meshopt  — EXT_meshopt_compression. Chosen over Draco deliberately: the
 *              decoder is a single ES module already vendored inside three
 *              (`three/examples/jsm/libs/meshopt_decoder.module.js`), so Vite
 *              bundles it like any other import. Draco needs its wasm/js decoder
 *              copied into `public/` and fetched at runtime — one more moving
 *              part and one more thing to 404 in production.
 *
 * Result for spiral-ring: 15.78 MB → 613 KB (hq) / 271 KB (lq). ~26x.
 *
 * USAGE
 * ───────────────────────────────────────────────────────────────────────────
 *   npm run models:optimize
 *
 * Reads every .glb in client/models-source/ and writes `<name>-hq.glb` and
 * `<name>-lq.glb` into client/public/models/. models-source/ is gitignored —
 * the raw exports are archive material, not repo material. Keep them in cloud
 * storage and drop them back in when a model needs re-tuning.
 *
 * WHY public/ AND NOT src/
 * ───────────────────────────────────────────────────────────────────────────
 * Assets under src/ are imported for their hashed URL, which is normally the
 * better deal — free cache-busting. It does not work for models. Vite's dev
 * server answers a browser `fetch()` for `/src/**\/*.glb` with the 406-byte JS
 * *module* that exports the URL, not the file (curl gets the real bytes; the
 * difference is request headers). GLTFLoader fetches, so it receives
 * "export default ..." and dies on `JSON.parse` — in dev only, while the
 * production build works fine. That is the worst possible failure shape.
 *
 * public/ is served verbatim in dev and copied verbatim at build, so dev and
 * prod agree. The trade-off is no content hash: these filenames are effectively
 * immutable, so if a model is re-exported with different geometry, BUMP THE
 * FILENAME rather than overwriting, or clients will hold the stale copy.
 */

import { execFileSync } from 'node:child_process'
import { mkdirSync, readdirSync, statSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SOURCE_DIR = join(ROOT, 'models-source')
const OUT_DIR = join(ROOT, 'public', 'models')
const TMP_DIR = join(ROOT, 'node_modules', '.cache', 'model-optimize')

/**
 * Quality tiers.
 *
 * `ratio` is the fraction of triangles to KEEP. `error` is the maximum allowed
 * deviation as a fraction of the mesh's bounding-sphere radius — the lq tier is
 * allowed 4x more because it renders smaller and dimmer.
 */
const TIERS = [
  { suffix: 'hq', ratio: 0.12, error: 0.001, texture: 1024 },
  { suffix: 'lq', ratio: 0.05, error: 0.004, texture: 512 },
]

/** gltf-transform is a build-time-only tool; run it through npx, don't vendor it. */
function gltf(args) {
  execFileSync('npx', ['--yes', '@gltf-transform/cli@4', ...args], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })
}

function mb(path) {
  return `${(statSync(path).size / 1024 / 1024).toFixed(2)} MB`
}

mkdirSync(TMP_DIR, { recursive: true })
mkdirSync(OUT_DIR, { recursive: true })

const sources = readdirSync(SOURCE_DIR).filter((f) => f.toLowerCase().endsWith('.glb'))

if (sources.length === 0) {
  console.log(
    `No .glb files in ${SOURCE_DIR}.\n` +
      'Drop the raw exports there and re-run — the optimized outputs already in ' +
      'public/models/ are committed, so this is only needed when a model changes.',
  )
  process.exit(0)
}

for (const file of sources) {
  const name = file.replace(/\.glb$/i, '')
  const input = join(SOURCE_DIR, file)
  console.log(`\n=== ${file} (${mb(input)})`)

  // `weld` is tier-independent and by far the slowest step — do it once.
  const welded = join(TMP_DIR, `${name}.weld.glb`)
  gltf(['weld', input, welded])

  for (const tier of TIERS) {
    const simplified = join(TMP_DIR, `${name}.${tier.suffix}.simplify.glb`)
    const resized = join(TMP_DIR, `${name}.${tier.suffix}.resize.glb`)
    const output = join(OUT_DIR, `${name}-${tier.suffix}.glb`)

    gltf(['simplify', welded, simplified, '--ratio', String(tier.ratio), '--error', String(tier.error)])
    gltf(['resize', simplified, resized, '--width', String(tier.texture), '--height', String(tier.texture)])
    gltf(['meshopt', resized, output, '--level', 'high'])

    console.log(`--> ${name}-${tier.suffix}.glb  ${mb(output)}`)
  }
}

rmSync(TMP_DIR, { recursive: true, force: true })
console.log(
  '\nDone. public/models/*.glb are served verbatim — reference them by absolute path (/models/<name>.glb).',
)
