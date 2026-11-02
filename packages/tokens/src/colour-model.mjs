/**
 * Primal's colour model: a project chooses three colours (its black, its white and its primary)
 * and a harmony; every colour role is derived from them.
 *
 * Each role is written once, twice over: as CSS (relative colours and color-mix, so a product
 * that overrides the inputs gets the whole palette re-derived by the browser) and as a JavaScript
 * evaluator that computes the same colour, so the contrast check and the showcase's picker see
 * what the browser shows. Colours are OKLCH triples [lightness 0–1, chroma, hue].
 */

/**
 * The three choices, with Primal's defaults from the Mycelium brand book: ink #0B0B0D, white #FFFFFF
 * and Magma #E61924 (decision 25). A project replaces them with its own.
 */
export const INPUTS = {
  black: { meaning: "The project's black: text in light, the page in dark. Need not be #000. Primal's is Mycelium ink, #0B0B0D.", value: [0.1505, 0.0042, 285.88] },
  white: { meaning: "The project's white: the page in light, text in dark. Need not be #fff. Primal's is white, #FFFFFF.", value: [1, 0, 0] },
  primary: { meaning: "The project's one theme colour. Every primary role, state and step derives from it. Primal's is Mycelium Magma, #E61924.", value: [0.5889, 0.23, 26.6] },
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

/**
 * color-mix(in oklab, a p%, b). OKLab, not OKLCH: Primal's black and white keep a faint hue of their
 * own, and mixing in OKLCH would swing every tint towards it (Magma's quiet fill would turn violet).
 */
export function mix(a, p, b) {
  const lab = ([L, C, h]) => [L, C * Math.cos((h * Math.PI) / 180), C * Math.sin((h * Math.PI) / 180)];
  const [x, y] = [lab(a), lab(b)];
  const [L, A, B] = x.map((v, i) => (v * p) / 100 + y[i] * (1 - p / 100));
  const C = Math.hypot(A, B);
  return [L, C, C < 0.0002 ? 0 : wrap((Math.atan2(B, A) * 180) / Math.PI)];
}

/** OKLCH to linear sRGB, unclipped: out-of-gamut colours give channels below 0 or above 1. */
function toLinearRaw([L, C, h]) {
  const a = C * Math.cos((h * Math.PI) / 180);
  const b = C * Math.sin((h * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

/** OKLCH to linear sRGB, clipped to the screen's gamut, as the browser shows it. */
const toLinear = (c) => toLinearRaw(c).map((x) => Math.min(1, Math.max(0, x)));

/** Linear sRGB to OKLCH. */
function fromLinear([r, g, b]) {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.hypot(A, B);
  return [+L.toFixed(4), C < 0.0002 ? 0 : +C.toFixed(4), C < 0.0002 ? 0 : +wrap((Math.atan2(B, A) * 180) / Math.PI).toFixed(2)];
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
  return fromLinear([1, 3, 5].map((i) => dec(parseInt(hex.slice(i, i + 2), 16) / 255)));
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

/**
 * The primary is moved in luminance, never in hue, and only as far as reading needs (decision 26).
 * As a fill it is darkened, in linear light, until its luminance is at most LIGHT_CAP, so white
 * text on it reads (4.5:1); a primary already inside the limit stays exactly as chosen: Magma is
 * Magma, in light and in dark.
 */
export const LIGHT_CAP = 0.178;
/**
 * The fill is the same in light and dark (Niko, 2026-10-20: "keep exact magma"): white text on it
 * in both. In dark it is only lifted, towards white, if it would sink into the page: below
 * FILL_FLOOR it misses 3:1 against the dark surfaces.
 */
export const FILL_FLOOR = 0.13;
/** Primary text (links, the current place) must also read on the sunken well and the primary's own quiet fill, so it goes a little further. */
export const TEXT_CAP = 0.14;
export const TEXT_FLOOR = 0.3;
// Channels are clamped to the screen's gamut first, so the luminance measured is the one shown.
const ch = (c) => `clamp(0, ${c}, 1)`;
const Y = `(0.2126 * ${ch('r')} + 0.7152 * ${ch('g')} + 0.0722 * ${ch('b')})`;
const darkenTo = (cap) => `color(from var(--pr-primary) srgb-linear ${['r', 'g', 'b'].map((c) => `calc(${ch(c)} * min(1, ${cap} / ${Y}))`).join(' ')})`;
/** Lifts a colour (by default the primary) towards white until its luminance is at least `floor`. */
const lift = (floor, from) =>
  `color(from ${from} srgb-linear ${['r', 'g', 'b'].map((c) => `calc(1 - (1 - ${ch(c)}) * min(1, ${+(1 - floor).toFixed(3)} / (1 - ${Y})))`).join(' ')})`;
const lightenTo = (floor) =>
  `color(from var(--pr-primary) srgb-linear ${['r', 'g', 'b'].map((c) => `calc(1 - (1 - ${ch(c)}) * min(1, ${+(1 - floor).toFixed(3)} / (1 - ${Y})))`).join(' ')})`;
const lum = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
const moved = (x, cap, floor) => {
  const lin = toLinear(x.primary);
  const y = lum(lin);
  if (x.mode === 'light') return y <= cap ? x.primary : fromLinear(lin.map((v) => v * (cap / y)));
  return y >= floor ? x.primary : fromLinear(lin.map((v) => 1 - (1 - v) * ((1 - floor) / (1 - y))));
};
const primaryRole = (x) => {
  const fill = moved({ ...x, mode: 'light' }, LIGHT_CAP, 0);
  if (x.mode === 'light') return fill;
  return moved({ ...x, mode: 'dark', primary: fill }, 1, FILL_FLOOR);
};
const primaryText = (x) => moved(x, TEXT_CAP, TEXT_FLOOR);

/** Pressing deepens the fill, in light and dark: a step on hover, two when pressed. Magma pressed is the brand's magma-deep, #C0121C. */
const STATE = { hover: { l: 0.0375, c: 0.94 }, pressed: { l: 0.075, c: 0.875 } };
// The fill keeps white text in both modes, so its states deepen in both: Magma pressed is magma-deep.
const stateCss = ({ l, c }) => `oklch(from var(--pr-color-primary) calc(l - ${l}) calc(c * ${c}) h)`;
const stateValue = ({ l, c }) => (x) => {
  const p = primaryRole(x);
  return [p[0] - l, p[1] * c, p[2]];
};

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
    css: 'color-mix(in oklab, var(--pr-color-text) 62%, var(--pr-color-surface))',
    value: (x) => mix(ink(x), 62, paper(x)),
    pairs: { surface: 'text', 'surface-raised': 'text', 'surface-sunken': 'text' },
  },
  'surface-raised': {
    meaning: 'Something on top of the page: a menu, a popover, a dialog.',
    css: 'light-dark(var(--pr-white), color-mix(in oklab, var(--pr-white) 7%, var(--pr-black)))',
    value: (x) => (x.mode === 'light' ? x.white : mix(x.white, 7, x.black)),
  },
  'surface-sunken': {
    meaning: 'A well in the page holding content of another kind: code, a table header.',
    css: 'oklch(from var(--pr-color-surface) calc(l - 0.035) c h)',
    value: (x) => [paper(x)[0] - 0.035, paper(x)[1], paper(x)[2]],
  },
  border: {
    meaning: 'A line that separates: a divider, a table rule. Decoration, so faint.',
    css: 'color-mix(in oklab, var(--pr-color-text) 13%, var(--pr-color-surface))',
    value: (x) => mix(ink(x), 13, paper(x)),
  },
  'border-control': {
    meaning: 'The edge of something you operate: a field, a checkbox. Meets 3:1.',
    css: 'color-mix(in oklab, var(--pr-color-text) 50%, var(--pr-color-surface))',
    value: (x) => mix(ink(x), 50, paper(x)),
    pairs: { surface: 'ui', 'surface-raised': 'ui' },
  },
  primary: {
    meaning: 'Where something happens: the primary action\'s fill, a checked control, an accent. The primary as chosen, the same in light and dark: darkened only if white text on it would not read, lifted in dark only if it would sink into the page.',
    css: `light-dark(${darkenTo(LIGHT_CAP)}, ${lift(FILL_FLOOR, darkenTo(LIGHT_CAP))})`,
    value: primaryRole,
    pairs: { surface: 'ui', 'surface-raised': 'ui', 'surface-sunken': 'ui' },
  },
  'primary-text': {
    meaning: 'The primary as text: links, the current place, a primary label. A shade further than the fill when needed, so it reads on every surface.',
    css: `light-dark(${darkenTo(TEXT_CAP)}, ${lightenTo(TEXT_FLOOR)})`,
    value: primaryText,
    pairs: { surface: 'text', 'surface-raised': 'text', 'surface-sunken': 'text', 'primary-surface': 'text' },
  },
  'primary-hover': {
    meaning: 'A primary fill under the pointer: a step deeper.',
    css: stateCss(STATE.hover),
    value: stateValue(STATE.hover),
  },
  'primary-pressed': {
    meaning: 'A primary fill being pressed: two steps deeper.',
    css: stateCss(STATE.pressed),
    value: stateValue(STATE.pressed),
  },
  'on-primary': {
    meaning: 'Text and icons on a primary fill in any state: white, in light and dark, because the fill is kept dark enough for it.',
    css: 'oklch(1 0 0)',
    value: () => [1, 0, 0],
    pairs: { primary: 'text', 'primary-hover': 'text', 'primary-pressed': 'text' },
  },
  focus: {
    meaning: 'The focus ring: where the keyboard is. The primary, so it is never mistaken for an error or a divider.',
    css: 'var(--pr-color-primary)',
    value: primaryRole,
    pairs: { surface: 'ui', 'surface-raised': 'ui', 'surface-sunken': 'ui' },
  },
  'primary-surface': {
    meaning: 'The primary at a whisper: behind the current item, a chosen option, a note that belongs to the primary.',
    css: 'color-mix(in oklab, var(--pr-color-primary) 12%, var(--pr-color-surface))',
    value: (x) => mix(primaryRole(x), 12, paper(x)),
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
    css: 'color-mix(in oklab, var(--pr-color-primary) 28%, var(--pr-color-surface))',
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
          css: `color-mix(in oklab, var(--pr-color-${name}) 12%, var(--pr-color-surface))`,
          value: (x) => mix(s[x.mode], 12, paper(x)),
        },
      ],
    ]),
  ),
  'on-danger': {
    meaning: 'Text on a danger fill, the last step of an action that cannot be undone: the page colour, white in light and ink in dark.',
    css: 'light-dark(var(--pr-white), var(--pr-black))',
    value: paper,
    pairs: { danger: 'text' },
  },
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

/**
 * The primary's scale: eleven steps from near the white to near the black, for illustration,
 * charts and anything the roles do not name. Step 500 is the primary as chosen; the others mix it
 * with the project's white (lighter steps) or black (darker steps). The same in light and dark.
 */
export const SCALE = { 50: ['white', 8], 100: ['white', 16], 200: ['white', 32], 300: ['white', 52], 400: ['white', 76], 500: null, 600: ['black', 82], 700: ['black', 64], 800: ['black', 48], 900: ['black', 32], 950: ['black', 20] };
export const scaleCss = (step) => (SCALE[step] ? `color-mix(in oklab, var(--pr-primary) ${SCALE[step][1]}%, var(--pr-${SCALE[step][0]}))` : 'var(--pr-primary)');
export const scale = (choices) =>
  Object.fromEntries(Object.entries(SCALE).map(([step, s]) => [step, s ? mix(choices.primary, s[1], choices[s[0]]) : choices.primary]));

export const DEFAULTS = {
  black: INPUTS.black.value,
  white: INPUTS.white.value,
  primary: INPUTS.primary.value,
  scheme: DEFAULT_SCHEME,
  adjust: NO_ADJUST,
};
