#!/usr/bin/env node
/**
 * Builds what primal.myceliumllc.dev serves, into dist/site:
 *   /            the landing page (apps/site), on Primal's own CSS
 *   /showcase/   the showcase, built for that address
 *   /demo/       the acceptance app, built from the packed packages
 *   /version.json the version, the commit and when it was built
 * Run after `npm run build`, or on its own: it builds the showcase itself.
 */
import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'dist/site');
const run = (cmd) => execSync(cmd, { cwd: root, stdio: 'inherit' });

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

// The landing page and what it loads from Primal.
cpSync(join(root, 'apps/site'), out, { recursive: true });
const primal = join(out, 'primal');
mkdirSync(primal);
cpSync(join(root, 'packages/tokens/primal-tokens.css'), join(primal, 'primal-tokens.css'));
cpSync(join(root, 'packages/tokens/src/colour-model.mjs'), join(primal, 'colour-model.mjs'));
cpSync(join(root, 'packages/css/src/primal.css'), join(primal, 'primal.css'));
cpSync(join(root, 'packages/css/src/fonts'), join(primal, 'fonts'), { recursive: true });
cpSync(join(root, 'packages/contracts/contracts.json'), join(primal, 'contracts.json'));
mkdirSync(join(out, 'character'));
for (const f of ['20-watering.png', 'square-peg.woff2', 'SQUARE-PEG-OFL.txt']) cpSync(join(root, 'apps/showcase/public/character', f), join(out, 'character', f));

// The showcase, at /showcase/.
run('npx ng build showcase --base-href /showcase/ --output-path dist/site-showcase');
cpSync(join(root, 'dist/site-showcase/browser'), join(out, 'showcase'), { recursive: true });
rmSync(join(root, 'dist/site-showcase'), { recursive: true, force: true });

// The acceptance app, at /demo/, built from the packed packages as a stranger would.
if (existsSync(join(root, 'acceptance'))) {
  run('npm run pack');
  run('node scripts/check-app.mjs acceptance --out dist/site/demo -- --base-href /demo/');
}

// What the running site says it is.
const version = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version;
const commit = execSync('git rev-parse --short HEAD', { cwd: root }).toString().trim();
writeFileSync(join(out, 'version.json'), JSON.stringify({ app: 'primal', version, commit, builtAt: new Date().toISOString() }, null, 2) + '\n');
console.log(`✔ dist/site: the landing page, the showcase at /showcase/, version ${version} (${commit})`);
