import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';

/**
 * Moves through one list, page by page. The first and last pages and the ones around yours are
 * always there; the rest fold into a gap. Keep the page in the address (?page=3) so a page can be
 * shared and Back returns to it.
 *
 *   <primal-pagination [pages]="12" [(page)]="page" />
 */
@Component({
  selector: 'primal-pagination',
  host: { class: 'pr-pagination' },
  template: `
    <nav [attr.aria-label]="label()">
      <ul>
        <li>
          <button type="button" [disabled]="page() <= 1" (click)="page.set(page() - 1)">{{ previous() }}</button>
        </li>
        @for (p of shown(); track $index) {
          <li>
            @if (p === null) {
              <span class="pr-pagination-gap" aria-hidden="true">…</span>
            } @else {
              <button type="button" [attr.aria-current]="p === page() ? 'page' : null" [attr.aria-label]="'Page ' + p" (click)="page.set(p)">{{ p }}</button>
            }
          </li>
        }
        <li>
          <button type="button" [disabled]="page() >= pages()" (click)="page.set(page() + 1)">{{ next() }}</button>
        </li>
      </ul>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimalPagination {
  readonly pages = input.required<number>();
  /** The page shown, from 1. */
  readonly page = model(1);
  /** What the list is, read aloud: "Invoices, pages". */
  readonly label = input('Pages');
  readonly previous = input('Previous Page');
  readonly next = input('Next Page');

  /** 1 … 4 5 6 … 12: null is a gap. */
  protected readonly shown = computed<(number | null)[]>(() => {
    const total = this.pages();
    const at = this.page();
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const near = new Set([1, total, at - 1, at, at + 1].filter((p) => p >= 1 && p <= total));
    // Near an end, show enough pages that the row keeps its length.
    if (at <= 3) [2, 3, 4].forEach((p) => near.add(p));
    if (at >= total - 2) [total - 3, total - 2, total - 1].forEach((p) => near.add(p));
    const sorted = [...near].sort((a, b) => a - b);
    const out: (number | null)[] = [];
    sorted.forEach((p, i) => {
      if (i && p - sorted[i - 1] === 2) out.push(p - 1);
      else if (i && p - sorted[i - 1] > 2) out.push(null);
      out.push(p);
    });
    return out;
  });
}
