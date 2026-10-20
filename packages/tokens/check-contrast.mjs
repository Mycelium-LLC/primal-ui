#!/usr/bin/env node
/**
 * Check every foreground and background pair Primal names, in every mode
 * (light, dark, light with more contrast, dark with more contrast), against WCAG 2.2 AA:
 * 4.5:1 for text (1.4.3) and 3:1 for interface edges (1.4.11). Exit 1 on any miss.
 *
 *   node packages/tokens/check-contrast.mjs
 */

import { colour } from './src/tokens.mjs';

const NEED = { text: 4.5, ui: 3 };
const MODES = ['light', 'dark', 'lightMore', 'darkMore'];

/** OKLCH → relative luminance (via OKLab → linear sRGB, clipped to gamut). */
function luminance([L, C, h]) {
  const a = C * Math.cos((h * Math.PI) / 180);
  const b = C * Math.sin((h * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const clip = (x) => Math.min(1, Math.max(0, x));
  const r = clip(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s);
  const g = clip(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s);
  const bl = clip(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s);
  return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
}

const ratio = (x, y) => {
  const [hi, lo] = [luminance(x), luminance(y)].sort((p, q) => q - p);
  return (hi + 0.05) / (lo + 0.05);
};

/** A mode's value: the "more" modes fall back to the standard value where none is given. */
const at = (token, mode) => token[mode] ?? token[mode.replace('More', '')];

const misses = [];
let checked = 0;
for (const [fg, token] of Object.entries(colour)) {
  for (const [bg, kind] of Object.entries(token.pairs ?? {})) {
    if (!colour[bg]) {
      misses.push(`${fg} is paired with ${bg}, which is not a colour token`);
      continue;
    }
    for (const mode of MODES) {
      const r = ratio(at(token, mode), at(colour[bg], mode));
      checked++;
      if (r < NEED[kind]) misses.push(`${mode}: ${fg} on ${bg} is ${r.toFixed(2)}:1, needs ${NEED[kind]}:1 (${kind})`);
    }
  }
}

if (misses.length) {
  console.error(`✖ ${misses.length} contrast miss(es):`);
  for (const m of misses) console.error(`  - ${m}`);
  process.exit(1);
}
console.log(`✔ contrast: ${checked} pairs across ${MODES.length} modes meet WCAG 2.2 AA`);
