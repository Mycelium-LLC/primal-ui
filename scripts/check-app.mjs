#!/usr/bin/env node
/**
 * Builds an app that uses Primal (the starter, the acceptance app) the way a stranger would: from
 * the packed packages, never from the source. Copies the app to a temporary folder, installs the
 * tarballs from dist/packs (run `npm run pack` first), and builds it.
 *
 *   node scripts/check-app.mjs starter
 *   node scripts/check-app.mjs acceptance --out dist/site/demo -- --base-href /demo/
 *
 * With --out, the built app (its browser folder) is copied there.
 */
import { execSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const app = args[0];
const outAt = args.indexOf('--out');
const out = outAt > 0 ? join(root, args[outAt + 1]) : null;
const buildArgs = args.includes('--') ? args.slice(args.indexOf('--') + 1) : [];
const packs = join(root, 'dist/packs');
const tarballs = readdirSync(packs).filter((f) => f.endsWith('.tgz')).map((f) => join(packs, f));
if (!app || !tarballs.length) throw new Error('usage: node scripts/check-app.mjs <app folder>, after npm run pack');

const work = mkdtempSync(join(tmpdir(), `primal-${app}-`));
cpSync(join(root, app), work, { recursive: true, filter: (src) => !/node_modules|dist|\.angular/.test(src) });
const pkg = JSON.parse(readFileSync(join(work, 'package.json'), 'utf8'));
// The packages' scope, read from the tokens package, so a fork that renames them checks its own.
const scope = JSON.parse(readFileSync(join(root, 'packages/tokens/package.json'), 'utf8')).name.split('/')[0] + '/';
for (const name of Object.keys(pkg.dependencies)) if (name.startsWith(scope)) delete pkg.dependencies[name];
writeFileSync(join(work, 'package.json'), JSON.stringify(pkg, null, 2));
const run = (cmd) => execSync(cmd, { cwd: work, stdio: 'inherit' });
run('npm install --no-audit --no-fund');
run(`npm install --no-audit --no-fund ${tarballs.map((t) => JSON.stringify(t)).join(' ')}`);
run(`npx ng build --output-path dist/app ${buildArgs.join(' ')}`);
if (out) cpSync(join(work, 'dist/app/browser'), out, { recursive: true });
console.log(`✔ ${app} builds from the packed packages${out ? `, copied to ${out}` : ''}`);
rmSync(work, { recursive: true, force: true });
