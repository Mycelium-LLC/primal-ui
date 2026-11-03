export interface PrimalFocusAfterRemoveOptions {
  /** What one item is, inside the list. Its rows: 'li'. */
  readonly item?: string;
  /** Where focus goes when the list is left empty: its heading, or its way back. */
  readonly fallback?: () => HTMLElement | null;
}

/**
 * When an item is removed with its own button, focus would fall to the top of the page. Call this
 * just before removing it: once the list has drawn again, focus goes to the same control in the
 * item that took its place (the next one, or the last), or to the fallback when none is left or
 * the list itself has gone.
 *
 *   protected remove(report: Report, list: HTMLElement): void {
 *     primalFocusAfterRemove(list, { fallback: () => document.getElementById('reports-title') });
 *     this.reports.update((all) => all.filter((r) => r !== report));
 *   }
 */
export function primalFocusAfterRemove(list: HTMLElement, options: PrimalFocusAfterRemoveOptions = {}): void {
  const selector = options.item ?? 'li';
  const document = list.ownerDocument;
  const active = document.activeElement;
  const items = [...list.querySelectorAll<HTMLElement>(selector)];
  const at = items.findIndex((i) => i.contains(active));
  if (at < 0) return;
  // Which of the item's controls had focus (its Delete, say), so the next item's same one gets it.
  const control = [...items[at].querySelectorAll<HTMLElement>(FOCUSABLE)].findIndex((c) => c === active);
  // A timer, not a frame: the list draws first, in a background tab too.
  setTimeout(() => {
    // A list shown only while it has items (an @if with an empty state) leaves the page with its last one.
    const left = list.isConnected ? [...list.querySelectorAll<HTMLElement>(selector)] : [];
    const next = left[Math.min(at, left.length - 1)];
    const target = next ? (next.querySelectorAll<HTMLElement>(FOCUSABLE)[Math.max(control, 0)] ?? next) : options.fallback?.();
    if (!target) return;
    if (!target.matches(FOCUSABLE) && !target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus();
  });
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
