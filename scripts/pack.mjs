#!/usr/bin/env node
/**
 * Builds Primal and packs its three packages as tarballs into dist/packs, so a project outside
 * this repository can install them before Primal is published:
 *
 *   npm run pack
 *   npm install /path/to/primal-ui/dist/packs/*.tgz      (from the other project)
 */

import { execSync } from 'node:child_process';
import { mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const out = join(root, 'dist/packs');
const run = (cmd, cwd = root) => execSync(cmd, { cwd, stdio: 'inherit' });

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

run('node packages/tokens/build.mjs');
run('npx ng build primal-angular');
for (const dir of ['packages/tokens', 'packages/css', 'dist/primal-angular']) run(`npm pack --pack-destination ${out}`, join(root, dir));

console.log(`\n✔ packed into dist/packs:\n${readdirSync(out).map((f) => `  ${f}`).join('\n')}`);
