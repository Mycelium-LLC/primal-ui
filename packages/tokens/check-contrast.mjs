#!/usr/bin/env node
/**
 * Check every colour pair Primal's roles name, in light and dark, against WCAG 2.2 AA (4.5:1 for
 * text, 3:1 for interface edges): for Primal's own choices, and for a sweep of primaries round the
 * wheel at several lightnesses, because the roles promise to stay readable for any primary; and
 * for any black and white a project chooses, within BLACK_MAX and WHITE_MIN, tinted or not.
 *
 *   node packages/tokens/check-contrast.mjs
 */

import { BLACK_MAX, DEFAULTS, SCHEMES, WHITE_MIN, audit } from './src/colour-model.mjs';

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
let pages = 0;
for (const bl of [0.04, 0.12, BLACK_MAX]) {
  for (const wl of [WHITE_MIN, 0.975, 1]) {
    for (const tint of [30, 90, 250]) {
      const black = [bl, 0.015, tint];
      const white = [wl, wl === 1 ? 0 : 0.012, tint];
      pages++;
      for (let h = 0; h < 360; h += 30) {
        for (const [l, c] of [[0.3, 0.1], [0.59, 0.23], [0.85, 0.12]]) run({ ...DEFAULTS, black, white, primary: [l, c, h] }, `black ${bl}/${tint} white ${wl} primary ${l}/${h}`);
      }
    }
  }
}

if (misses.length) {
  console.error(`✖ ${misses.length} contrast miss(es):`);
  for (const m of misses) console.error(`  - ${m}`);
  process.exit(1);
}
console.log(`✔ contrast: ${checked} pairs meet WCAG 2.2 AA (Primal's choices in every scheme, 36 primaries round the wheel, and each on ${pages} blacks and whites)`);
