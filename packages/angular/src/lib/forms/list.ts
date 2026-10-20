import { DestroyRef, signal } from '@angular/core';

/** One option in a Primal list: what it stores, what it says, and whether it can be chosen now. */
export interface PrimalOption {
  value: string;
  label: string;
  disabled?: boolean;
  /** The heading of the group it belongs to, if any. */
  group?: string;
}

/** An option as a list shows it: its place, its id, and the group heading it opens, if any. */
export interface PrimalListItem extends PrimalOption {
  index: number;
  id: string;
  heading?: string;
}

let next = 0;
export const listKey = () => `pr-list-${++next}`;

/** Lays options out for a list: ids, and a heading before the first option of each group. */
export function toItems(options: PrimalOption[], key: string): PrimalListItem[] {
  let group: string | undefined;
  return options.map((o, index) => {
    const heading = o.group && o.group !== group ? o.group : undefined;
    group = o.group;
    return { ...o, index, id: `${key}-option-${index}`, heading };
  });
}

/** The next option that can be chosen, from `from` in `step` direction; stays put at either end. */
export function step(items: PrimalListItem[], from: number, by: number): number {
  let i = from;
  for (let n = 0; n < items.length; n++) {
    const candidate = i + by;
    if (candidate < 0 || candidate >= items.length) return from;
    i = candidate;
    if (!items[i].disabled) return i;
    if (Math.abs(by) > 1) by = Math.sign(by);
  }
  return from;
}

export const firstEnabled = (items: PrimalListItem[]) => items.findIndex((i) => !i.disabled);
export const lastEnabled = (items: PrimalListItem[]) => items.map((i) => !i.disabled).lastIndexOf(true);

/** Text compared the way a person reads it: case and accents don't matter. */
export const fold = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLocaleLowerCase();

/**
 * The list's popup: shown in the top layer (so no container clips it), placed under its field,
 * or over it when there's more room above, as wide as the field. Closes when the person points
 * anywhere else, and follows the field when the page scrolls.
 */
export class PrimalListPopup {
  readonly open = signal(false);
  private cleanup: (() => void) | null = null;

  constructor(
    private readonly anchor: () => HTMLElement,
    private readonly popup: () => HTMLElement,
    private readonly onOutside: () => void,
    destroyRef: DestroyRef,
  ) {
    destroyRef.onDestroy(() => this.hide());
  }

  show(): void {
    if (this.open()) return;
    const popup = this.popup();
    popup.showPopover?.();
    this.open.set(true);
    this.place();
    const place = () => this.place();
    const outside = (e: PointerEvent) => {
      const path = e.composedPath();
      if (!path.includes(popup) && !path.includes(this.anchor())) this.onOutside();
    };
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    document.addEventListener('pointerdown', outside, true);
    this.cleanup = () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
      document.removeEventListener('pointerdown', outside, true);
    };
  }

  hide(): void {
    if (!this.open()) return;
    this.cleanup?.();
    this.cleanup = null;
    const popup = this.popup();
    if (popup.matches(':popover-open')) popup.hidePopover?.();
    this.open.set(false);
  }

  /** Puts the popup against its field, below it unless there is clearly more room above. */
  place(): void {
    const popup = this.popup();
    const field = this.anchor().getBoundingClientRect();
    // The gap between field and list is the list's own margin (CSS), so only the room is measured here.
    const below = window.innerHeight - field.bottom;
    const above = field.top;
    const up = below < Math.min(popup.scrollHeight, 240) && above > below;
    popup.style.left = `${field.left}px`;
    popup.style.minWidth = `${field.width}px`;
    popup.style.maxHeight = `${Math.max(120, (up ? above : below) - 16)}px`;
    popup.style.top = up ? 'auto' : `${field.bottom}px`;
    popup.style.bottom = up ? `${window.innerHeight - field.top}px` : 'auto';
    popup.toggleAttribute('data-above', up);
  }

  /** Keeps the active option in view while the person moves through the list. */
  reveal(id: string | null): void {
    if (!id) return;
    queueMicrotask(() => document.getElementById(id)?.scrollIntoView({ block: 'nearest' }));
  }
}
