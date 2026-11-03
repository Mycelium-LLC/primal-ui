#!/usr/bin/env node
/**
 * Builds an app that uses Primal (the starter, the acceptance app) the way a stranger would: from
 * the packed packages, never from the source. Copies the app to a temporary folder, installs the
 * tarballs from dist/packs (run `npm run pack` first), and builds it.
 *
 *   node scripts/check-app.mjs starter
 *   node scripts/check-app.mjs acceptance -- --base-href /demo/
 */
import { execSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const [app, , ...buildArgs] = process.argv.slice(2);
const packs = join(root, 'dist/packs');
const tarballs = readdirSync(packs).filter((f) => f.endsWith('.tgz')).map((f) => join(packs, f));
if (!app || !tarballs.length) throw new Error('usage: node scripts/check-app.mjs <app folder>, after npm run pack');

const work = mkdtempSync(join(tmpdir(), `primal-${app}-`));
cpSync(join(root, app), work, { recursive: true, filter: (src) => !/node_modules|dist|\.angular/.test(src) });
const pkg = JSON.parse(readFileSync(join(work, 'package.json'), 'utf8'));
for (const name of Object.keys(pkg.dependencies)) if (name.startsWith('@mycelium-llc/')) delete pkg.dependencies[name];
writeFileSync(join(work, 'package.json'), JSON.stringify(pkg, null, 2));
const run = (cmd) => execSync(cmd, { cwd: work, stdio: 'inherit' });
run('npm install --no-audit --no-fund');
run(`npm install --no-audit --no-fund ${tarballs.map((t) => JSON.stringify(t)).join(' ')}`);
run(`npx ng build ${buildArgs.join(' ')}`);
console.log(`✔ ${app} builds from the packed packages`);
rmSync(work, { recursive: true, force: true });
