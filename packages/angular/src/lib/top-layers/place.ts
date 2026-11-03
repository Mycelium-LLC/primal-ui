/** Which side of its trigger a layer prefers. It moves to the other side when this one has no room. */
export type PrimalSide = 'below' | 'above';

/** The space between a trigger and its layer, and between a layer and the window's edge. */
const GAP = 6;
const EDGE = 8;

/**
 * Puts a fixed layer (a popover, menu or tooltip) against its trigger: on its preferred side
 * unless the other has clearly more room, its start edge lined up with the trigger's start edge
 * in the trigger's own direction, and kept inside the window.
 */
export function primalPlace(trigger: HTMLElement, layer: HTMLElement, side: PrimalSide = 'below', centre = false): void {
  const t = trigger.getBoundingClientRect();
  const width = layer.offsetWidth;
  const height = layer.offsetHeight;
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;

  const roomBelow = vh - t.bottom - GAP - EDGE;
  const roomAbove = t.top - GAP - EDGE;
  const wantsBelow = side === 'below';
  const below = wantsBelow ? roomBelow >= height || roomBelow >= roomAbove : !(roomAbove >= height || roomAbove >= roomBelow);

  const rtl = getComputedStyle(trigger).direction === 'rtl';
  let left = centre ? t.left + t.width / 2 - width / 2 : rtl ? t.right - width : t.left;
  left = Math.min(Math.max(EDGE, left), vw - width - EDGE);
  const top = below ? t.bottom + GAP : t.top - GAP - height;

  layer.style.left = `${Math.round(left)}px`;
  layer.style.top = `${Math.round(Math.max(EDGE, top))}px`;
  layer.toggleAttribute('data-above', !below);
}

let next = 0;
/** A unique id for a layer and the things that point at it. */
export const primalLayerId = (kind: string) => `pr-${kind}-${++next}`;

/** Everything in a layer the keyboard can reach, in order. */
export function primalFocusables(root: HTMLElement): HTMLElement[] {
  return [
    ...root.querySelectorAll<HTMLElement>(
      'a[href], button:not(:disabled), input:not(:disabled):not([type="hidden"]), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"]), summary',
    ),
  ].filter((el) => !el.closest('[hidden], [inert]'));
}
