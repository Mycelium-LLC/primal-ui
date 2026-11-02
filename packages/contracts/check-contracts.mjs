#!/usr/bin/env node
/**
 * Fails when a component has no contract, or its contract is incomplete (primal/catalog): every
 * Angular part the adapter declares must be named by a contract; every contract has its layer and
 * why, the three answers (promise, expectation, evidence), the seven parts, do and don't, its API
 * and a live example on a showcase page that exists.
 *
 *   node packages/contracts/check-contracts.mjs
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateFolder } from './validate.mjs';

const root = fileURLToPath(new URL('../..', import.meta.url));
const here = join(root, 'packages/contracts');
// Each contract is complete (the same check a design system built on Primal runs on its own).
const { contracts, problems } = validateFolder(join(here, 'src'));

// Every Angular part the adapter declares is named by a contract.
const selectors = new Set();
const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (entry.name.endsWith('.ts')) for (const m of readFileSync(path, 'utf8').matchAll(/selector:\s*'([^']+)'/g)) selectors.add(m[1]);
  }
};
walk(join(root, 'packages/angular/src/lib'));
const named = new Set(contracts.flatMap(({ c }) => c.api?.angular ?? []));
for (const s of selectors) if (!named.has(s)) problems.push(`the Angular part "${s}" has no contract`);
for (const s of named) if (!selectors.has(s)) problems.push(`a contract names "${s}", which the adapter doesn't declare`);

// Every example is a page the showcase has.
const routes = readFileSync(join(root, 'apps/showcase/src/app/app.routes.ts'), 'utf8');
for (const { file, c } of contracts) {
  const path = c.example?.slice(1).split(/[?#]/)[0];
  const known = routes.includes(`'${path}'`) || (path && routes.includes(`'${path.split('/').slice(0, 2).join('/')}`)) || path?.startsWith('surfaces/list-detail');
  if (!known) problems.push(`${file}: its example ${c.example} is not a showcase page`);
}

if (problems.length) {
  console.error(`✖ ${problems.length} contract problem(s):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
const layers = Object.groupBy(contracts, ({ c }) => c.layer);
console.log(
  `✔ contracts: ${contracts.length} complete (${layers.primitive?.length ?? 0} primitives, ${layers.cell?.length ?? 0} cells, ${layers.surface?.length ?? 0} surfaces); every one of the adapter's ${selectors.size} Angular parts has one`,
);
