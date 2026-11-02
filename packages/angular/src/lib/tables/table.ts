import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input, booleanAttribute } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { PrimalAnnouncer } from '../behaviour/announcer';

export type PrimalSortDirection = 'ascending' | 'descending';

export interface PrimalSort {
  /** The column's index, from 0, and its header's words. */
  readonly column: number;
  readonly label: string;
  /** null: back to the order the rows came in. */
  readonly direction: PrimalSortDirection | null;
}

const NEXT: Record<string, PrimalSortDirection | null> = { none: 'ascending', ascending: 'descending', descending: null };

/**
 * Every table can be sorted by its columns, on by default (Niko, 2026-11-02). Each column header
 * becomes a button: press it to sort ascending, again for descending, a third time for the order
 * the rows came in. The header says how it is sorted (aria-sort), and the change is announced.
 *
 *   <table>…</table>                         sortable: every column
 *   <table [sortable]="false">…</table>      not sortable
 *   <th scope="col" data-sort="false">       this column is not
 *
 * Numbers sort as numbers (a data-numeric column, or cells that are all numbers), dates by their
 * <time datetime>, anything else by its words in the page's language. A cell's data-sort-value
 * wins over its text. With (sorted) bound, Primal leaves the rows alone and tells you instead:
 * sort your data, and the rows follow it.
 */
@Directive({
  selector: 'table',
  host: { '[class.pr-sortable]': 'sortable()' },
})
export class PrimalTable {
  private readonly table = inject<ElementRef<HTMLTableElement>>(ElementRef).nativeElement;
  private readonly announcer = inject(PrimalAnnouncer);

  readonly sortable = input(true, { transform: booleanAttribute });

  private readonly sorts = new Subject<PrimalSort>();
  /** Bind it to sort the data yourself; Primal then leaves the rows where they are. */
  readonly sorted = outputFromObservable(this.sorts);

  private readonly original = new WeakMap<HTMLTableRowElement, number>();
  private seen = 0;
  private headers: HTMLTableCellElement[] = [];
  /** The sort in force, so rows added, restored or changed later take their place in it. */
  private active: { column: number; direction: PrimalSortDirection; numeric: boolean } | null = null;
  private moving = false;

  constructor() {
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      if (!this.sortable()) return;
      this.attach();
      // The header must never say "ascending" over rows that aren't: when rows change under a
      // sort, they are put in order again (unless you sort the data yourself, through (sorted)).
      const watch = new MutationObserver(() => {
        if (this.moving) {
          this.moving = false;
          return;
        }
        if (this.active && !this.sorts.observed) this.reorderAll();
      });
      watch.observe(this.table, { subtree: true, childList: true, characterData: true });
      destroy.onDestroy(() => watch.disconnect());
    });
    destroy.onDestroy(() => this.sorts.complete());
  }

  private attach(): void {
    const row = this.table.tHead?.rows[this.table.tHead.rows.length - 1];
    if (!row) return;
    this.headers = [...row.cells].filter((c): c is HTMLTableCellElement => c.tagName === 'TH');
    this.headers.forEach((th, column) => {
      if (th.dataset['sort'] === 'false' || th.colSpan > 1 || th.querySelector('.pr-sort')) return;
      const button = this.table.ownerDocument.createElement('button');
      button.type = 'button';
      button.className = 'pr-sort';
      button.append(...th.childNodes);
      th.append(button);
      button.addEventListener('click', () => this.sort(th, column));
    });
  }

  private sort(th: HTMLTableCellElement, column: number): void {
    const direction = NEXT[th.getAttribute('aria-sort') ?? 'none'];
    for (const other of this.headers) other.removeAttribute('aria-sort');
    if (direction) th.setAttribute('aria-sort', direction);

    const label = th.textContent?.trim() ?? '';
    this.announcer.announce(direction ? `Sorted by ${label}, ${direction}.` : `Back to the original order.`);

    this.active = direction ? { column, direction, numeric: th.hasAttribute('data-numeric') } : null;
    if (this.sorts.observed) {
      this.sorts.next({ column, label, direction });
      return;
    }
    if (direction) this.reorderAll();
    else for (const body of this.table.tBodies) this.reorder(body, column, null, false);
  }

  private reorderAll(): void {
    const a = this.active;
    if (!a) return;
    for (const body of this.table.tBodies) this.reorder(body, a.column, a.direction, a.numeric);
  }

  private reorder(body: HTMLTableSectionElement, column: number, direction: PrimalSortDirection | null, numeric: boolean): void {
    const rows = [...body.rows];
    // A row's original place is when it was first seen; a row added later comes after the rest.
    for (const r of rows) if (!this.original.has(r)) this.original.set(r, this.seen++);
    if (!direction) {
      rows.sort((a, b) => this.original.get(a)! - this.original.get(b)!);
    } else {
      const values = rows.map((r) => value(r.cells[column]));
      const asNumbers = numeric || values.every((v) => v === '' || !Number.isNaN(Number(v)));
      const lang = this.table.ownerDocument.documentElement.lang || undefined;
      const compare = asNumbers
        ? (a: string, b: string) => (a === '' ? 1 : b === '' ? -1 : Number(a) - Number(b))
        : new Intl.Collator(lang, { numeric: true, sensitivity: 'base' }).compare;
      const order = rows.map((r, i) => ({ r, v: values[i] }));
      order.sort((a, b) => compare(a.v, b.v) * (direction === 'ascending' ? 1 : -1) || this.original.get(a.r)! - this.original.get(b.r)!);
      rows.splice(0, rows.length, ...order.map((o) => o.r));
    }
    // Only move what is out of place, and tell the watcher these moves are ours.
    if (rows.every((r, i) => body.rows[i] === r)) return;
    this.moving = true;
    body.append(...rows);
  }
}

/** What a cell sorts by: its data-sort-value, its <time datetime>, or its words (numbers without their grouping). */
function value(cell: HTMLTableCellElement | undefined): string {
  if (!cell) return '';
  const explicit = cell.dataset['sortValue'];
  if (explicit !== undefined) return explicit;
  const time = cell.querySelector('time[datetime]');
  if (time) return time.getAttribute('datetime')!;
  const text = cell.textContent?.trim() ?? '';
  const number = text.replace(/[,\s%]/g, '');
  return number !== '' && !Number.isNaN(Number(number)) ? number : text;
}
