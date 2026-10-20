/**
 * Mycelium Primal's tokens: the one source.
 *
 * Every token has a value and a meaning. build.mjs emits them as CSS custom properties
 * (primal-tokens.css) and JSON (primal-tokens.json); check-contrast.mjs reads the same
 * values. A product re-themes Primal by overriding the CSS custom properties, never by
 * editing components.
 *
 * Colours are written in OKLCH: [lightness 0–1, chroma, hue]. Each colour token has a
 * light and a dark value, and a value for more contrast in each.
 */

export const PREFIX = 'pr';

/** A neutral grey with the faintest cool tint, and one restrained blue. No brand. */
const HUE = 255;

/**
 * Colour roles. `pairs` names what each foreground is read against, for the contrast check:
 * 'text' needs 4.5:1 (WCAG 1.4.3), 'ui' needs 3:1 (WCAG 1.4.11).
 */
export const colour = {
  surface: {
    meaning: 'The page itself. Everything sits on it.',
    light: [0.995, 0, 0],
    dark: [0.17, 0.005, HUE],
  },
  'surface-raised': {
    meaning: 'Something on top of the page: a menu, a popover, a dialog. Always paired with an elevation.',
    light: [1, 0, 0],
    dark: [0.22, 0.006, HUE],
  },
  'surface-sunken': {
    meaning: 'A well inside the page that holds content of another kind: code, a quoted block, a table header.',
    light: [0.965, 0.003, HUE],
    dark: [0.14, 0.005, HUE],
  },
  text: {
    meaning: 'Text and icons that carry content.',
    light: [0.22, 0.01, HUE],
    dark: [0.94, 0.005, HUE],
    lightMore: [0, 0, 0],
    darkMore: [1, 0, 0],
    pairs: { surface: 'text', 'surface-raised': 'text', 'surface-sunken': 'text' },
  },
  'text-muted': {
    meaning: 'Text that supports other text: descriptions, captions, metadata. Steps back, still readable.',
    light: [0.46, 0.01, HUE],
    dark: [0.74, 0.008, HUE],
    lightMore: [0.22, 0.01, HUE],
    darkMore: [0.94, 0.005, HUE],
    pairs: { surface: 'text', 'surface-raised': 'text', 'surface-sunken': 'text' },
  },
  border: {
    meaning: 'A line that separates: a divider, a table rule. Decorative, so it stays faint.',
    light: [0.89, 0.004, HUE],
    dark: [0.3, 0.006, HUE],
    lightMore: [0.22, 0.01, HUE],
    darkMore: [0.94, 0.005, HUE],
  },
  'border-control': {
    meaning: 'The edge of something you operate: a field, a checkbox. Must be seen, so it meets 3:1.',
    light: [0.6, 0.01, HUE],
    dark: [0.56, 0.01, HUE],
    lightMore: [0.22, 0.01, HUE],
    darkMore: [0.94, 0.005, HUE],
    pairs: { surface: 'ui', 'surface-raised': 'ui' },
  },
  accent: {
    meaning: 'Where something happens: links, the primary action, the current place, focus.',
    light: [0.5, 0.17, HUE],
    dark: [0.74, 0.12, HUE],
    lightMore: [0.36, 0.17, HUE],
    darkMore: [0.86, 0.09, HUE],
    pairs: { surface: 'text', 'surface-raised': 'text', 'surface-sunken': 'text' },
  },
  'on-accent': {
    meaning: 'Text and icons on an accent fill.',
    light: [1, 0, 0],
    dark: [0.17, 0.005, HUE],
    lightMore: [1, 0, 0],
    darkMore: [0, 0, 0],
    pairs: { accent: 'text' },
  },
  danger: {
    meaning: 'Something failed, or an action cannot be undone.',
    light: [0.52, 0.19, 27],
    dark: [0.74, 0.14, 27],
    lightMore: [0.4, 0.17, 27],
    darkMore: [0.86, 0.09, 27],
    pairs: { surface: 'text', 'surface-raised': 'text', 'danger-surface': 'text' },
  },
  'danger-surface': {
    meaning: 'The quiet ground behind a danger message.',
    light: [0.96, 0.025, 27],
    dark: [0.24, 0.05, 27],
  },
  warning: {
    meaning: 'Something needs attention soon, but nothing has failed.',
    light: [0.5, 0.11, 65],
    dark: [0.8, 0.12, 80],
    lightMore: [0.38, 0.09, 65],
    darkMore: [0.9, 0.09, 85],
    pairs: { surface: 'text', 'surface-raised': 'text', 'warning-surface': 'text' },
  },
  'warning-surface': {
    meaning: 'The quiet ground behind a warning message.',
    light: [0.965, 0.04, 85],
    dark: [0.25, 0.04, 75],
  },
  success: {
    meaning: 'Done, resolved, safe.',
    light: [0.48, 0.12, 150],
    dark: [0.76, 0.13, 150],
    lightMore: [0.36, 0.1, 150],
    darkMore: [0.88, 0.1, 150],
    pairs: { surface: 'text', 'surface-raised': 'text', 'success-surface': 'text' },
  },
  'success-surface': {
    meaning: 'The quiet ground behind a success message.',
    light: [0.96, 0.03, 150],
    dark: [0.24, 0.04, 150],
  },
  selection: {
    meaning: 'Text the person has selected.',
    light: [0.88, 0.06, HUE],
    dark: [0.36, 0.08, HUE],
  },
  backdrop: {
    meaning: 'Covers the page behind something that interrupts (a modal dialog).',
    light: [0.2, 0.01, HUE, 0.4],
    dark: [0, 0, 0, 0.6],
  },
};

/** Fluid type: each step grows linearly from a 320px to a 1440px wide viewport. */
export const type = {
  family: {
    sans: {
      meaning: 'All interface and reading text. The system font, so Primal carries no typeface of its own.',
      value: 'system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", "Helvetica Neue", Arial, sans-serif',
    },
    mono: {
      meaning: 'Code, keys and sample output.',
      value: 'ui-monospace, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
    },
  },
  // [min px at 320, max px at 1440]
  size: {
    small: { meaning: 'Fine print, captions, metadata.', px: [13, 14] },
    body: { meaning: 'Body text and controls.', px: [16, 17] },
    large: { meaning: 'Lead text and heading level 4.', px: [18, 20] },
    xl: { meaning: 'Heading level 3.', px: [20, 24] },
    '2xl': { meaning: 'Heading level 2.', px: [24, 30] },
    '3xl': { meaning: 'Heading level 1.', px: [28, 38] },
    display: { meaning: 'A display title, at most one per page.', px: [34, 50] },
  },
  leading: {
    body: { meaning: 'Line height for reading text.', value: '1.55' },
    tight: { meaning: 'Line height for headings and single-line controls.', value: '1.2' },
  },
  weight: {
    regular: { meaning: 'Body text.', value: '400' },
    strong: { meaning: 'Headings and emphasis. One step, so weight keeps meaning rank.', value: '600' },
  },
  measure: { meaning: 'The longest comfortable line for reading text.', value: '68ch' },
};

/**
 * The three gaps (Niko's book: large between sections, medium between elements of a group,
 * small inside a component) and the dense mode, where they tighten.
 */
export const space = {
  'gap-component': { meaning: 'Inside a component: icon to label, label to field.', comfortable: '0.5rem', dense: '0.25rem' },
  'gap-group': { meaning: 'Between the elements of one group: fields in a form, items in a list.', comfortable: '1rem', dense: '0.5rem' },
  'gap-section': { meaning: 'Between sections. Clearly larger than a group gap, so grouping reads.', comfortable: 'clamp(2rem, 1.6rem + 2vw, 3rem)', dense: '1.5rem' },
  gutter: { meaning: 'The space between the viewport edge and content.', comfortable: 'clamp(1rem, 0.6rem + 2vw, 2rem)', dense: 'clamp(0.75rem, 0.5rem + 1.25vw, 1.25rem)' },
  'control-height': { meaning: 'The height of a single-line control.', comfortable: '2.5rem', dense: '2rem' },
  'control-inset': { meaning: 'Horizontal padding inside a control.', comfortable: '0.75rem', dense: '0.5rem' },
  'target-min': { meaning: 'The smallest pointer target (WCAG 2.2 AA asks 24px).', comfortable: '1.5rem', dense: '1.5rem' },
};

export const layout = {
  'container-reading': { meaning: 'The maximum width of reading pages and documentation.', value: '72rem' },
  'container-full': { meaning: 'Full width, for app surfaces that use the whole screen.', value: '100%' },
};

/** Every treatment completes the sentence "this style means: …". */
export const shape = {
  'radius-control': { meaning: 'This is something you operate (a button, a field).', value: '0.375rem' },
  'radius-layer': { meaning: 'This sits on top of the page (a popover, a dialog).', value: '0.5rem' },
  'radius-round': { meaning: 'This is a person or a single status (an avatar, a dot).', value: '999px' },
  'border-width': { meaning: 'A line that separates or outlines.', value: '1px' },
  'focus-width': { meaning: 'The width of the focus ring: here is where the keyboard is.', value: '2px' },
  'focus-offset': { meaning: 'The gap between an element and its focus ring.', value: '2px' },
};

export const elevation = {
  0: { meaning: 'Part of the page. No shadow.', value: 'none' },
  1: { meaning: 'On top of the page but not interrupting it: a menu, a popover, a tooltip.', value: '0 1px 2px oklch(0% 0 0 / 0.08), 0 4px 12px oklch(0% 0 0 / 0.08)' },
  2: { meaning: 'Interrupts the page: a dialog. Only one at a time.', value: '0 2px 4px oklch(0% 0 0 / 0.1), 0 12px 32px oklch(0% 0 0 / 0.16)' },
};

export const layer = {
  base: { meaning: 'The page.', value: '0' },
  sticky: { meaning: 'Something that stays while the page scrolls (a table header, a toolbar).', value: '100' },
  overlay: { meaning: 'A layer above the page that is not in the browser top layer.', value: '1000' },
  toast: { meaning: 'A message that must stay visible over everything else on the page.', value: '1100' },
};

export const motion = {
  'duration-fast': { meaning: 'Acknowledgement: hover, press, a state change.', value: '120ms' },
  'duration-base': { meaning: 'Something entering or leaving: a popover, a disclosure.', value: '200ms' },
  'duration-slow': { meaning: 'A large layer entering: a dialog, a panel.', value: '280ms' },
  'ease-standard': { meaning: 'A change in place.', value: 'cubic-bezier(0.2, 0, 0, 1)' },
  'ease-enter': { meaning: 'Arriving: fast start, gentle stop.', value: 'cubic-bezier(0, 0, 0, 1)' },
  'ease-exit': { meaning: 'Leaving: gentle start, fast end.', value: 'cubic-bezier(0.3, 0, 1, 1)' },
};
