#!/usr/bin/env node
/**
 * Checks contracts against Primal's contract schema: every part present, nothing the schema
 * doesn't know, no answer too thin to say anything. Primal's own check uses it, and a design
 * system built on Primal can check its own contracts with it:
 *
 *   npx -p @mycelium-llc/primal-contracts primal-contracts-check path/to/contracts      (a folder of <id>.json contracts, and nothing else)
 */

import { readFileSync, readdirSync, realpathSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const schema = JSON.parse(readFileSync(fileURLToPath(new URL('./schema.json', import.meta.url)), 'utf8'));

/** Every problem with one contract, as sentences; none means it is complete. */
export function validateContract(c, file = `${c.id}.json`) {
  const problems = [];
  for (const key of schema.required) {
    const v = c[key];
    const empty = v === undefined || v === '' || (Array.isArray(v) && !v.length);
    if (empty) problems.push(`${file}: no ${key}`);
    const min = schema.properties[key]?.minLength;
    if (typeof v === 'string' && min && v.length < min) problems.push(`${file}: ${key} is too thin to say anything ("${v}")`);
    if (Array.isArray(v) && v.some((line) => typeof line !== 'string' || line.trim().length < 3)) problems.push(`${file}: ${key} has an empty line`);
  }
  for (const key of Object.keys(c)) if (!(key in schema.properties)) problems.push(`${file}: unknown part "${key}"`);
  if (!schema.properties.layer.enum.includes(c.layer)) problems.push(`${file}: layer "${c.layer}" is not primitive, cell or surface`);
  if (c.id && `${c.id}.json` !== file) problems.push(`${file}: its id is "${c.id}"; the file must be named for it`);
  if (c.usage && !c.usage.markup) problems.push(`${file}: its usage has no markup to copy`);
  if (c.api?.angular?.length && !c.usage?.import) problems.push(`${file}: an Angular part needs an import line in its usage`);
  return problems;
}

/** Reads every contract in a folder, and every problem with them. */
export function validateFolder(dir) {
  const files = readdirSync(dir).filter((f) => f.endsWith('.json'));
  const contracts = files.map((file) => ({ file, c: JSON.parse(readFileSync(join(dir, file), 'utf8')) }));
  return { contracts, problems: contracts.flatMap(({ file, c }) => validateContract(c, file)) };
}

// Run as a command (npx links to it, so compare real paths), not when imported by another script.
if (process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) {
  const dir = resolve(process.argv[2] ?? '.');
  const { contracts, problems } = validateFolder(dir);
  if (problems.length) {
    console.error(`✖ ${problems.length} contract problem(s):`);
    for (const p of problems) console.error(`  - ${p}`);
    process.exit(1);
  }
  console.log(`✔ ${contracts.length} contract(s) complete in ${dir}`);
}
