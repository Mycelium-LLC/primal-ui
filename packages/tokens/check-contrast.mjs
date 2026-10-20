#!/usr/bin/env node
/**
 * Check every colour pair Primal's roles name, in light and dark, against WCAG 2.2 AA (4.5:1 for
 * text, 3:1 for interface edges): for Primal's own choices, and for a sweep of primaries round the
 * wheel at several lightnesses, because the roles promise to stay readable for any primary.
 *
 *   node packages/tokens/check-contrast.mjs
 */

import { DEFAULTS, SCHEMES, audit } from './src/colour-model.mjs';

const misses = [];
let checked = 0;
const run = (choices, label) => {
  for (const r of audit(choices)) {
    checked++;
    if (!r.ok) misses.push(`${label} ${r.mode}: ${r.fg} on ${r.bg} is ${r.ratio.toFixed(2)}:1, needs ${r.need}:1`);
  }
};

for (const scheme of Object.keys(SCHEMES)) run({ ...DEFAULTS, scheme }, `defaults/${scheme}`);
for (let h = 0; h < 360; h += 30) {
  for (const l of [0.3, 0.55, 0.85]) run({ ...DEFAULTS, primary: [l, 0.15, h] }, `primary ${l}/${h}`);
}

if (misses.length) {
  console.error(`✖ ${misses.length} contrast miss(es):`);
  for (const m of misses) console.error(`  - ${m}`);
  process.exit(1);
}
console.log(`✔ contrast: ${checked} pairs meet WCAG 2.2 AA (Primal's choices in every scheme, and 36 primaries round the wheel)`);
