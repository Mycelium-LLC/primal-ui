/**
 * Primal's colour model: a project chooses three colours (its black, its white and its primary)
 * and a harmony; every colour role is derived from them.
 *
 * Each role is written once, twice over: as CSS (relative colours and color-mix, so a product
 * that overrides the inputs gets the whole palette re-derived by the browser) and as a JavaScript
 * evaluator that computes the same colour, so the contrast check and the showcase's picker see
 * what the browser shows. Colours are OKLCH triples [lightness 0–1, chroma, hue].
 */

/** The three choices, with Primal's own defaults: a cool near-black, a clean white, a restrained blue. */
export const INPUTS = {
  black: { meaning: "The project's black: text in light, the page in dark. Need not be #000.", value: [0.22, 0.01, 255] },
  white: { meaning: "The project's white: the page in light, text in dark. Need not be #fff.", value: [0.995, 0, 0] },
  primary: { meaning: "The project's one theme colour. Roles derive from it, adjusted for contrast.", value: [0.5, 0.17, 255] },
};

/** Harmony schemes: how far round the colour wheel the companion and the tertiary sit from the primary. */
export const SCHEMES = {
  complementary: { label: 'Complementary', meaning: 'The companion opposite the primary; the tertiary its neighbour.', companion: 180, tertiary: 30 },
  analogous: { label: 'Analogous', meaning: 'Both neighbours of the primary, one on each side. Calm.', companion: 30, tertiary: -30 },
  triadic: { label: 'Triadic', meaning: 'Three hues evenly round the wheel. Lively.', companion: 120, tertiary: -120 },
  split: { label: 'Split complementary', meaning: 'The two hues either side of the opposite. Contrast, softened.', companion: 150, tertiary: -150 },
};
export const DEFAULT_SCHEME = 'complementary';

// ---------------------------------------------------------------- colour maths

const wrap = (h) => ((h % 360) + 360) % 360;

/** color-mix(in oklch, a p%, b): interpolates L, C and hue (shorter arc); an achromatic side takes the other's hue. */
export function mix(a, p, b) {
  const t = p / 100;
  let ha = a[1] < 0.0001 ? b[2] : a[2];
  let hb = b[1] < 0.0001 ? a[2] : b[2];
  let d = hb - ha;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return [a[0] * t + b[0] * (1 - t), a[1] * t + b[1] * (1 - t), wrap(hb - d * t)];
}

function toLinear([L, C, h]) {
  const a = C * Math.cos((h * Math.PI) / 180);
  const b = C * Math.sin((h * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const clip = (x) => Math.min(1, Math.max(0, x));
  return [
    clip(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    clip(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    clip(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

export const luminance = (c) => {
  const [r, g, b] = toLinear(c);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const contrast = (x, y) => {
  const [hi, lo] = [luminance(x), luminance(y)].sort((p, q) => q - p);
  return (hi + 0.05) / (lo + 0.05);
};

export function toHex(c) {
  const enc = (x) => (x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055);
  return `#${toLinear(c)
    .map((x) => Math.round(enc(x) * 255).toString(16).padStart(2, '0'))
    .join('')}`;
}

export function fromHex(hex) {
  const dec = (x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4);
  const [r, g, b] = [1, 3, 5].map((i) => dec(parseInt(hex.slice(i, i + 2), 16) / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.hypot(A, B);
  return [+L.toFixed(4), C < 0.0002 ? 0 : +C.toFixed(4), C < 0.0002 ? 0 : +wrap((Math.atan2(B, A) * 180) / Math.PI).toFixed(2)];
}

export const css = ([l, c, h, a]) => `oklch(${+(l * 100).toFixed(2)}% ${+c.toFixed(4)} ${+h.toFixed(2)}${a === undefined ? '' : ` / ${a}`})`;

// ---------------------------------------------------------------- the roles

/** The system colours keep their hues in every project, outside the harmony; only their backgrounds mix with the page. */
export const SYSTEM = {
  danger: { meaning: 'Something failed, or cannot be undone.', light: [0.52, 0.19, 27], dark: [0.74, 0.14, 27] },
  warning: { meaning: 'Needs attention soon; nothing has failed.', light: [0.5, 0.11, 65], dark: [0.8, 0.12, 80] },
  info: { meaning: 'Worth knowing; nothing to do.', light: [0.5, 0.13, 235], dark: [0.76, 0.11, 235] },
  success: { meaning: 'Done, resolved, safe.', light: [0.48, 0.12, 150], dark: [0.76, 0.13, 150] },
};

/**
 * The derived roles. `css` is the browser's derivation; `value(x)` computes it for one scheme,
 * where x = { mode: 'light' | 'dark', black, white, primary, companionAngle, tertiaryAngle }.
 * `pairs` names what each foreground is read against: 'text' needs 4.5:1, 'ui' needs 3:1.
 */
const paper = (x) => (x.mode === 'light' ? x.white : x.black);
const ink = (x) => (x.mode === 'light' ? x.black : x.white);
const primaryRole = (x) =>
  x.mode === 'light' ? [Math.min(x.primary[0], 0.5), x.primary[1], x.primary[2]] : [Math.max(x.primary[0], 0.76), Math.min(x.primary[1], 0.15), x.primary[2]];

export const ROLES = {
  surface: {
    meaning: 'The page itself. The white in light, the black in dark.',
    css: 'light-dark(var(--pr-white), var(--pr-black))',
    value: paper,
  },
  text: {
    meaning: 'Text and icons that carry content. The black in light, the white in dark.',
    css: 'light-dark(var(--pr-black), var(--pr-white))',
    value: ink,
    pairs: { surface: 'text', 'surface-raised': 'text', 'surface-sunken': 'text' },
  },
  'text-muted': {
    meaning: 'Text that supports other text: descriptions, captions, metadata.',
    css: 'color-mix(in oklch, var(--pr-color-text) 62%, var(--pr-color-surface))',
    value: (x) => mix(ink(x), 62, paper(x)),
    pairs: { surface: 'text', 'surface-raised': 'text', 'surface-sunken': 'text' },
  },
  'surface-raised': {
    meaning: 'Something on top of the page: a menu, a popover, a dialog.',
    css: 'light-dark(var(--pr-white), color-mix(in oklch, var(--pr-white) 7%, var(--pr-black)))',
    value: (x) => (x.mode === 'light' ? x.white : mix(x.white, 7, x.black)),
  },
  'surface-sunken': {
    meaning: 'A well in the page holding content of another kind: code, a table header.',
    css: 'oklch(from var(--pr-color-surface) calc(l - 0.035) c h)',
    value: (x) => [paper(x)[0] - 0.035, paper(x)[1], paper(x)[2]],
  },
  border: {
    meaning: 'A line that separates: a divider, a table rule. Decoration, so faint.',
    css: 'color-mix(in oklch, var(--pr-color-text) 13%, var(--pr-color-surface))',
    value: (x) => mix(ink(x), 13, paper(x)),
  },
  'border-control': {
    meaning: 'The edge of something you operate: a field, a checkbox. Meets 3:1.',
    css: 'color-mix(in oklch, var(--pr-color-text) 50%, var(--pr-color-surface))',
    value: (x) => mix(ink(x), 50, paper(x)),
    pairs: { surface: 'ui', 'surface-raised': 'ui' },
  },
  primary: {
    meaning: 'Where something happens: the primary action, links, the current place, focus. The primary, darkened or lightened until it reads.',
    css: 'light-dark(oklch(from var(--pr-primary) min(l, 0.5) c h), oklch(from var(--pr-primary) max(l, 0.76) min(c, 0.15) h))',
    value: primaryRole,
    pairs: { surface: 'text', 'surface-raised': 'text', 'surface-sunken': 'text' },
  },
  'on-primary': {
    meaning: 'Text and icons on a primary fill: black or white, whichever reads.',
    css: 'oklch(from var(--pr-color-primary) clamp(0, (0.64 - l) * 1000, 1) 0 0)',
    value: (x) => (primaryRole(x)[0] < 0.64 ? [1, 0, 0] : [0, 0, 0]),
    pairs: { primary: 'text' },
  },
  companion: {
    meaning: 'Goes with the primary: a second emphasis, a highlight, a second series. Never an action.',
    css: 'oklch(from var(--pr-color-primary) calc(l + var(--pr-companion-lightness)) c calc(h + var(--pr-companion-angle)))',
    value: (x) => {
      const p = primaryRole(x);
      return [p[0] + x.companionLightness, p[1], wrap(p[2] + x.companionAngle)];
    },
    pairs: { surface: 'ui' },
  },
  tertiary: {
    meaning: 'A third hue for decoration and a third series. Never an action.',
    css: 'oklch(from var(--pr-color-primary) calc(l + var(--pr-tertiary-lightness)) c calc(h + var(--pr-tertiary-angle)))',
    value: (x) => {
      const p = primaryRole(x);
      return [p[0] + x.tertiaryLightness, p[1], wrap(p[2] + x.tertiaryAngle)];
    },
    pairs: { surface: 'ui' },
  },
  selection: {
    meaning: 'Text the person has selected.',
    css: 'color-mix(in oklch, var(--pr-color-primary) 28%, var(--pr-color-surface))',
    value: (x) => mix(primaryRole(x), 28, paper(x)),
  },
  backdrop: {
    meaning: 'Covers the page behind something that interrupts.',
    css: 'oklch(from var(--pr-black) l c h / 0.55)',
    value: (x) => [...x.black, 0.55],
  },
  ...Object.fromEntries(
    Object.entries(SYSTEM).flatMap(([name, s]) => [
      [
        name,
        {
          meaning: s.meaning,
          css: `light-dark(${css(s.light)}, ${css(s.dark)})`,
          value: (x) => s[x.mode],
          pairs: { surface: 'text', [`${name}-surface`]: 'text' },
        },
      ],
      [
        `${name}-surface`,
        {
          meaning: `The quiet background behind a${name === 'info' ? 'n' : ''} ${name} message.`,
          css: `color-mix(in oklch, var(--pr-color-${name}) 12%, var(--pr-color-surface))`,
          value: (x) => mix(s[x.mode], 12, paper(x)),
        },
      ],
    ]),
  ),
};

/**
 * A light adjustment of the harmony: the companion and the tertiary can each turn a little round
 * the wheel from where the scheme puts them, and be a little lighter or darker than the primary.
 */
export const ADJUST = {
  hue: { min: -20, max: 20, step: 1, meaning: 'Degrees round the wheel from where the harmony puts it.' },
  lightness: { min: -0.12, max: 0.12, step: 0.01, meaning: 'Lighter or darker than the primary.' },
};
export const NO_ADJUST = { companion: { hue: 0, lightness: 0 }, tertiary: { hue: 0, lightness: 0 } };

/** The four harmony values a set of choices resolves to: the scheme's angles plus any adjustment. */
export function harmony({ scheme = DEFAULT_SCHEME, adjust = NO_ADJUST }) {
  const s = SCHEMES[scheme];
  return {
    companionAngle: s.companion + adjust.companion.hue,
    tertiaryAngle: s.tertiary + adjust.tertiary.hue,
    companionLightness: adjust.companion.lightness,
    tertiaryLightness: adjust.tertiary.lightness,
  };
}

/** Every role's colour for one set of choices, in one mode. */
export function palette(choices, mode) {
  const { black, white, primary } = choices;
  const x = { mode, black, white, primary, ...harmony(choices) };
  return Object.fromEntries(Object.entries(ROLES).map(([name, r]) => [name, r.value(x)]));
}

/** Every contrast pair the roles name, in light and dark: [{ mode, fg, bg, kind, ratio, need, ok }]. */
export function audit(choices) {
  const NEED = { text: 4.5, ui: 3 };
  const out = [];
  for (const mode of ['light', 'dark']) {
    const p = palette(choices, mode);
    for (const [fg, role] of Object.entries(ROLES)) {
      for (const [bg, kind] of Object.entries(role.pairs ?? {})) {
        const ratio = contrast(p[fg], p[bg]);
        out.push({ mode, fg, bg, kind, ratio, need: NEED[kind], ok: ratio >= NEED[kind] });
      }
    }
  }
  return out;
}

export const DEFAULTS = {
  black: INPUTS.black.value,
  white: INPUTS.white.value,
  primary: INPUTS.primary.value,
  scheme: DEFAULT_SCHEME,
  adjust: NO_ADJUST,
};
