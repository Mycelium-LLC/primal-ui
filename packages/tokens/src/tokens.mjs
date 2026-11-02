/**
 * Mycelium Primal's tokens: the one source.
 *
 * Every token has a value and a meaning. build.mjs emits them as CSS custom properties
 * (primal-tokens.css) and JSON (primal-tokens.json); check-contrast.mjs reads the same
 * values. A product re-themes Primal by overriding the CSS custom properties, never by
 * editing components.
 *
 * Colour is three choices and a harmony (colour-model.mjs); every colour role derives from them.
 */

export const PREFIX = 'pr';

/** Colour lives in colour-model.mjs: three choices (black, white, primary) and a harmony; every role derives from them. */
export * from './colour-model.mjs';

/** Fluid type: each step grows linearly from a 320px to a 1440px wide viewport. */
export const type = {
  family: {
    sans: {
      meaning: 'All interface and reading text, in English and Hebrew: Google Sans, bundled with Primal, falling back to the system font.',
      value: '"Google Sans", system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", "Noto Sans Hebrew", Arial, sans-serif',
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
 * small inside a component).
 */
export const space = {
  'gap-component': { meaning: 'Inside a component: icon to label, label to field.', value: '0.5rem' },
  'gap-group': { meaning: 'Between the elements of one group: fields in a form, items in a list.', value: '1rem' },
  'gap-section': { meaning: 'Between sections. Clearly larger than a group gap, so grouping reads.', value: 'clamp(2rem, 1.6rem + 2vw, 3rem)' },
  gutter: { meaning: 'The space between the viewport edge and content.', value: 'clamp(1rem, 0.6rem + 2vw, 2rem)' },
  'control-height': { meaning: 'The height of a single-line control.', value: '2.5rem' },
  'control-inset': { meaning: 'Horizontal padding inside a control.', value: '0.75rem' },
  'track-thickness': { meaning: 'The thickness of a progress or meter track.', value: '0.5rem' },
  'target-min': { meaning: 'The smallest pointer target (WCAG 2.2 AA asks 24px).', value: '1.5rem' },
  'choice-size': { meaning: 'The box of a checkbox or a radio: the size of a capital letter and a little more.', value: '1.25rem' },
};

export const layout = {
  'container-reading': { meaning: 'The maximum width of reading pages and documentation.', value: '72rem' },
  'field-width': { meaning: 'The widest a single-line field grows: as wide as the answer it asks for.', value: '28rem' },
  'choice-card-min': { meaning: 'The narrowest a choice card gets before the cards wrap to fewer columns.', value: '14rem' },
  'drop-zone-height': { meaning: 'The least height of a drop zone: a target big enough to aim a dragged file at.', value: '9rem' },
  'menu-width': { meaning: 'The narrowest a menu gets: room for a command of a few words.', value: '12rem' },
  'tooltip-width': { meaning: 'The widest a tooltip grows: a short phrase, never a paragraph.', value: '20rem' },
  'dialog-width': { meaning: 'The widest a dialog grows: one question and its answers, read at a glance.', value: '32rem' },
  'card-min': { meaning: 'The narrowest a card gets before a collection of cards wraps to fewer columns.', value: '16rem' },
  'avatar-size': { meaning: 'An avatar beside a name: the height of a control.', value: '2.5rem' },
  'nav-width': { meaning: 'The width of a side navigation: room for a place name of a few words.', value: '15rem' },
  'list-pane-width': { meaning: 'The width of the list beside its detail: an item\'s name and a line about it.', value: '22rem' },
  'toast-width': { meaning: 'The widest a toast grows: one short sentence and its action.', value: '24rem' },
  'list-height': { meaning: 'The tallest an open list of options grows before it scrolls: about eight options.', value: '20rem' },
  'container-full': { meaning: 'Full width, for app surfaces that use the whole screen.', value: '100%' },
};

/** Every treatment completes the sentence "this style means: …". */
export const shape = {
  'radius-control': { meaning: 'This is something you operate (a button, a field).', value: '0.375rem' },
  'radius-well': { meaning: 'This holds content of another kind (code, a key).', value: '0.25rem' },
  'radius-layer': { meaning: 'This sits on top of the page (a popover, a dialog).', value: '0.5rem' },
  'radius-round': { meaning: 'This is a person or a single status (an avatar, a dot).', value: '999px' },
  'border-width': { meaning: 'A line that separates or outlines.', value: '1px' },
  'border-width-choice': { meaning: 'The edge of a checkbox or radio: thicker than a line, so a small control still reads.', value: '1.5px' },
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
  'loop-spin': { meaning: 'One turn of a spinner: steady, never urgent. A loop, so reduced motion swaps it for a slow fade rather than stopping it.', value: '800ms' },
  'loop-shimmer': { meaning: 'One pass of the light across a skeleton: slow, so waiting never looks frantic.', value: '1600ms' },
};
