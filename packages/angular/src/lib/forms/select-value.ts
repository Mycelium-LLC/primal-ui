/**
 * A <select>'s value, as code sets it. primalControl watches a select from the moment it exists,
 * before any binding runs, so a value bound in a template ([value] with @for options) is caught:
 * it is kept until its option arrives, and primal-select is told to redraw after rendering.
 */
const WANTED = new WeakMap<HTMLSelectElement, string>();

/** The event a watched select sends, after rendering, whenever code set its value. */
export const PRIMAL_SELECT_SET = 'primal-select-set';

export function primalWatchSelect(select: HTMLSelectElement): void {
  for (const prop of ['value', 'selectedIndex'] as const) {
    const native = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, prop)!;
    Object.defineProperty(select, prop, {
      configurable: true,
      get: () => native.get!.call(select),
      set: (v) => {
        native.set!.call(select, v);
        if (prop === 'value') WANTED.set(select, String(v));
        else WANTED.delete(select);
        // Never during rendering: a [value] binding sets it while Angular draws the template.
        queueMicrotask(() => select.dispatchEvent(new Event(PRIMAL_SELECT_SET)));
      },
    });
  }
  // The person's own choice replaces whatever code wanted.
  select.addEventListener('change', () => WANTED.delete(select));
}

/** Applies a value code asked for before its option existed. True when it changed the select. */
export function primalApplyWanted(select: HTMLSelectElement): boolean {
  const wanted = WANTED.get(select);
  if (wanted === undefined || select.value === wanted || ![...select.options].some((o) => o.value === wanted)) return false;
  Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')!.set!.call(select, wanted);
  return true;
}
