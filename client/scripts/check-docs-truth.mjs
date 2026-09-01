/**
 * check-docs-truth.mjs
 *
 * Asserts that what the Docs page CLAIMS matches what the repository IS.
 *
 * WHY: this page shipped describing an application that does not exist — MongoDB
 * + Mongoose, JWT + bcryptjs, MUI, MUI X-Charts and nodemon, none of which are
 * dependencies; a folder tree with a `models/` directory that was never created;
 * setup steps telling the reader to run `mongod`; and 8 of 12 endpoints
 * documented. Prose drifts silently because nothing fails when it goes stale.
 * This is the check that fails.
 *
 *     node scripts/check-docs-truth.mjs
 *
 * Exits non-zero on any mismatch, so it can gate CI.
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const client = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = join(client, "..");
const server = join(repo, "server");

const failures = [];
const notes = [];
const fail = (m) => failures.push(m);

const docData = readFileSync(join(client, "src/data/docData.ts"), "utf8");

/* ── 1. Endpoints: every real route must be documented, and vice versa ───── */

const routeFiles = readdirSync(join(server, "src/routes"));
const mountMatch = readFileSync(join(server, "src/server.ts"), "utf8").matchAll(
  /app\.use\(\s*['"](\/api\/[a-z]+)['"]\s*,\s*(\w+)/g,
);
const mounts = {}; // routerVarName -> base path
for (const m of mountMatch) mounts[m[2]] = m[1];

const real = new Set();
for (const f of routeFiles) {
  const src = readFileSync(join(server, "src/routes", f), "utf8");
  // Map the file to its mount by matching the router variable name loosely.
  const base =
    Object.entries(mounts).find(([v]) =>
      v.toLowerCase().startsWith(f.replace(/\.ts$/, "").toLowerCase().slice(0, 4)),
    )?.[1] ?? `/api/${f.replace(/\.ts$/, "")}`;
  for (const m of src.matchAll(/router\.(get|post|put|delete)\(\s*'([^']*)'/g)) {
    const path = (base + (m[2] === "/" ? "" : m[2])) || base;
    real.add(`${m[1].toUpperCase()} ${path}`);
  }
}

const documented = new Set();
for (const m of docData.matchAll(
  /method:\s*"(GET|POST|PUT|DELETE)"[^}]*?path:\s*"([^"]+)"/gs,
)) {
  documented.add(`${m[1]} ${m[2]}`);
}

for (const r of real) if (!documented.has(r)) fail(`endpoint NOT documented: ${r}`);
for (const d of documented) if (!real.has(d)) fail(`endpoint documented but does NOT exist: ${d}`);
notes.push(`endpoints: ${real.size} real, ${documented.size} documented`);

/* ── 2. Architecture: no claim may name a package that is not installed ──── */

const deps = (p) => {
  const j = JSON.parse(readFileSync(join(p, "package.json"), "utf8"));
  return { ...(j.dependencies ?? {}), ...(j.devDependencies ?? {}) };
};
const installed = new Set(
  [...Object.keys(deps(client)), ...Object.keys(deps(server))].map((d) =>
    d.toLowerCase(),
  ),
);

// Names that must NOT appear in the architecture block unless actually installed.
const watched = {
  mongodb: ["mongodb", "mongoose"],
  mongoose: ["mongoose"],
  mui: ["@mui/material", "@mui/x-charts"],
  "x-charts": ["@mui/x-charts"],
  jwt: ["jsonwebtoken"],
  bcryptjs: ["bcryptjs"],
  nodemon: ["nodemon"],
  prisma: ["prisma", "@prisma/client"],
  postgres: ["pg", "postgres"],
};

const archBlock = docData.slice(
  docData.indexOf("export const architecture"),
  docData.indexOf("export const projectDetailByRepo"),
);
for (const [claim, pkgs] of Object.entries(watched)) {
  if (!new RegExp(claim, "i").test(archBlock)) continue;
  const present = pkgs.some((p) => installed.has(p.toLowerCase()));
  if (!present)
    fail(
      `architecture claims "${claim}" but none of [${pkgs.join(", ")}] is installed`,
    );
}
notes.push(`architecture: scanned ${Object.keys(watched).length} watched claims`);

/* ── 3. Folder structure: every path it draws must exist ─────────────────── */

const fsBlock = docData.slice(
  docData.indexOf("export const folderStructure"),
  docData.indexOf("export const gettingStarted"),
);
// Pull trailing directory names off the tree drawing, e.g. "│   ├── routes/".
const drawn = [...fsBlock.matchAll(/[├└]──\s+([A-Za-z0-9._-]+)\/(?=\s|$)/gm)].map(
  (m) => m[1],
);
const realDirs = new Set([
  ...readdirSync(join(client, "src"), { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name),
  ...readdirSync(join(client, "src/components"), { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name),
  ...readdirSync(join(server, "src"), { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name),
  "client",
  "server",
  "scripts",
  "src",
  "nevinas_ka_i",
]);
for (const d of new Set(drawn)) {
  if (!realDirs.has(d)) fail(`folderStructure draws "${d}/" which does not exist`);
}
notes.push(`folderStructure: checked ${new Set(drawn).size} directories`);

/* ── 4. Getting started: no step may reference a missing file or script ──── */

const gsBlock = docData.slice(
  docData.indexOf("export const gettingStarted"),
  docData.indexOf("export const designSystem"),
);
const serverScripts = Object.keys(
  JSON.parse(readFileSync(join(server, "package.json"), "utf8")).scripts ?? {},
);
for (const m of gsBlock.matchAll(/npm run ([a-z:]+)/g)) {
  if (!serverScripts.includes(m[1]) )
    fail(`gettingStarted runs "npm run ${m[1]}" which is not a server script`);
}
if (/mongod\b|MONGODB_URI/i.test(gsBlock))
  fail("gettingStarted still references MongoDB, which this project does not use");
for (const m of gsBlock.matchAll(/src\/(\w+\.js)\b/g))
  fail(`gettingStarted references ${m[1]} — the server is TypeScript`);
notes.push(`gettingStarted: validated against ${serverScripts.length} server scripts`);

// The dev ports the docs promise must match vite.config.ts and the server default.
const viteCfg = readFileSync(join(client, "vite.config.ts"), "utf8");
const clientPort = viteCfg.match(/port:\s*(\d+)/)?.[1];
if (clientPort && !gsBlock.includes(clientPort))
  fail(`gettingStarted does not mention the real client dev port ${clientPort}`);
notes.push(`ports: client dev port ${clientPort}`);

/* ── Report ─────────────────────────────────────────────────────────────── */

for (const n of notes) console.log(`  ${n}`);
if (failures.length) {
  console.error(`\n${failures.length} docs-truth failure(s):`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log("\ndocs-truth: all checks passed");
