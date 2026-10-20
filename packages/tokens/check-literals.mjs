#!/usr/bin/env node
/**
 * Check that no core or component style uses a literal colour, length or duration: every such
 * value must come from a token, so overriding tokens re-themes everything (primal/tokens,
 * primal/themes). Relative units (em, %, viewport units) and 0 are allowed.
 *
 *   node packages/tokens/check-literals.mjs
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../..', import.meta.url));
const SCAN = ['packages/css/src', 'packages/angular/src'];
const LITERAL = [
  [/#[0-9a-f]{3,8}\b/gi, 'colour'],
  [/\b(?:rgba?|hsla?|oklch|oklab|lab|lch|color)\(/gi, 'colour'],
  [/(?<![\w-])\d*\.?\d+(?:px|rem)\b/g, 'length'],
  [/(?<![\w-])\d*\.?\d+m?s\b/g, 'duration'],
];

const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (/\.(css|scss)$/.test(name) || /\.ts$/.test(name)) files.push(path);
  }
};
for (const dir of SCAN) walk(join(root, dir));

const misses = [];
for (const file of files) {
  let text = readFileSync(file, 'utf8')
    .split('\n')
    .map((line) => (/allow-literal: \S/.test(line) ? '' : line))
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '');
  // In TypeScript, only inline styles are style: the contents of styles: `...`.
  if (file.endsWith('.ts')) text = [...text.matchAll(/styles:\s*`([\s\S]*?)`/g)].map((m) => m[1]).join('\n');
  text.split('\n').forEach((line, i) => {
    for (const [pattern, kind] of LITERAL) {
      for (const m of line.matchAll(pattern)) if (kind === "colour" || parseFloat(m[0]) !== 0) misses.push(`${relative(root, file)}:${i + 1}: literal ${kind} ${m[0]}`);
    }
  });
}

if (misses.length) {
  console.error(`✖ ${misses.length} literal value(s) outside the tokens:`);
  for (const m of misses) console.error(`  - ${m}`);
  process.exit(1);
}
console.log(`✔ no literal values: ${files.length} core and component files take every colour, length and duration from tokens`);
