import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, input, signal } from '@angular/core';
import { PrimalButton } from '../actions/button';
import { PrimalEmpty } from '../content/content';
import { PrimalAlert } from '../feedback/alert';
import { PrimalSkeleton } from '../feedback/indicators';

export interface PrimalSearchResult {
  readonly title: string;
  readonly href?: string;
  /** A line about it, where the match is marked too. */
  readonly snippet?: string;
  /** Where it lives ("Forms › Text fields"): the first thing to give way. */
  readonly meta?: string;
}

/** Typing waits this long before it searches, so every keystroke doesn't. */
const SETTLE = 250;

/**
 * A cell: search with its results and feedback, end to end. Its payload is the results. While it
 * waits it shows the shape of the results (skeletons), then how many there are and each one with
 * the match marked; with none it says so and offers a way out; if search fails it says so in
 * place, with Try Again.
 *
 *   <primal-search label="Search the docs" [search]="searchDocs" [blank]="popular" />
 *
 * `search(query)` returns the results; throw if it can't.
 */
@Component({
  selector: 'primal-search',
  imports: [NgTemplateOutlet, PrimalButton, PrimalEmpty, PrimalAlert, PrimalSkeleton],
  host: { class: 'pr-search' },
  template: `
    <search>
      <form (submit)="$event.preventDefault(); run(box.value)">
        <label class="pr-visually-hidden" [for]="id">{{ label() }}</label>
        <span class="pr-search-field">
          <input #box type="search" [id]="id" [attr.placeholder]="label()" autocomplete="off" (input)="typed(box.value)" (keydown.escape)="clear(box)" />
        </span>
      </form>
    </search>

    <div class="pr-search-results" [attr.aria-busy]="state() === 'searching' ? 'true' : null">
      @switch (state()) {
        @case ('searching') {
          @if (!results().length) {
            <ul class="pr-list-items" aria-hidden="true">
              @for (i of [1, 2, 3]; track i) {
                <li><span class="pr-item-body"><primal-skeleton shape="text" style="inline-size: 45%" /><primal-skeleton shape="text" style="inline-size: 80%" /></span></li>
              }
            </ul>
          } @else {
            <ng-container [ngTemplateOutlet]="list" />
          }
        }
        @case ('results') {
          <ng-container [ngTemplateOutlet]="list" />
        }
        @case ('none') {
          <primal-empty [title]="'Nothing matches “' + query() + '”'" reason="Check the spelling, or try a shorter word.">
            <button primalButton type="button" (click)="clear(box)">Clear Search</button>
          </primal-empty>
        }
        @case ('failed') {
          <primal-alert tone="danger" title="Search isn’t answering" [live]="true">
            <p>Your words are kept. Try again in a moment.</p>
            <div class="pr-alert-actions"><button primalButton type="button" (click)="run(query())">Try Again</button></div>
          </primal-alert>
        }
        @default {
          @if (blank()?.length) {
            <p class="pr-search-count">{{ blankTitle() }}</p>
            <ul class="pr-list-items">
              @for (r of blank(); track r.title) {
                <li><span class="pr-item-body"><span class="pr-item-title"><a [href]="r.href ?? null">{{ r.title }}</a></span></span></li>
              }
            </ul>
          }
        }
      }
    </div>
    <p class="pr-visually-hidden" aria-live="polite">{{ said() }}</p>

    <ng-template #list>
      <p class="pr-search-count">{{ countText() }}</p>
      <ul class="pr-list-items">
        @for (r of marked(); track r.title) {
          <li>
            <span class="pr-item-body">
              <span class="pr-item-title"><a [href]="r.result.href ?? null">@for (p of r.title; track $index) {@if (p.match) {<mark class="pr-match">{{ p.text }}</mark>} @else {{{ p.text }}}}</a></span>
              @if (r.result.snippet) {
                <span class="pr-item-line">@for (p of r.snippet; track $index) {@if (p.match) {<mark class="pr-match">{{ p.text }}</mark>} @else {{{ p.text }}}}</span>
              }
            </span>
            @if (r.result.meta) {
              <span class="pr-item-end">{{ r.result.meta }}</span>
            }
          </li>
        }
      </ul>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimalSearch {
  readonly label = input.required<string>();
  readonly search = input.required<(query: string) => Promise<PrimalSearchResult[]>>();
  /** What shows before anything is typed: popular or recent. */
  readonly blank = input<PrimalSearchResult[]>();
  readonly blankTitle = input('Popular');

  private static next = 0;
  protected readonly id = `pr-search-${++PrimalSearch.next}`;

  protected readonly query = signal('');
  protected readonly results = signal<PrimalSearchResult[]>([]);
  protected readonly state = signal<'idle' | 'searching' | 'results' | 'none' | 'failed'>('idle');
  private timer?: ReturnType<typeof setTimeout>;
  private asked = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  protected readonly countText = computed(() => {
    const n = this.results().length;
    return `${n} ${n === 1 ? 'result' : 'results'} for “${this.query()}”`;
  });

  protected readonly said = computed(() => {
    switch (this.state()) {
      case 'results':
        return this.countText();
      case 'none':
        return `Nothing matches “${this.query()}”.`;
      case 'failed':
        return 'Search isn’t answering.';
      default:
        return '';
    }
  });

  /** Each result's title and snippet split around the words typed, so the match can be marked. */
  protected readonly marked = computed(() => {
    const q = this.query().trim().toLocaleLowerCase();
    const split = (text = '') => {
      if (!q) return [{ text, match: false }];
      const out: { text: string; match: boolean }[] = [];
      let from = 0;
      const lower = text.toLocaleLowerCase();
      for (let at = lower.indexOf(q); at >= 0; at = lower.indexOf(q, at + q.length)) {
        if (at > from) out.push({ text: text.slice(from, at), match: false });
        out.push({ text: text.slice(at, at + q.length), match: true });
        from = at + q.length;
      }
      if (from < text.length) out.push({ text: text.slice(from), match: false });
      return out;
    };
    return this.results().map((result) => ({ result, title: split(result.title), snippet: split(result.snippet) }));
  });

  protected typed(value: string): void {
    clearTimeout(this.timer);
    if (!value.trim()) {
      this.reset();
      return;
    }
    this.timer = setTimeout(() => this.run(value), SETTLE);
  }

  protected async run(value: string): Promise<void> {
    const q = value.trim();
    if (!q) return this.reset();
    clearTimeout(this.timer);
    const ask = ++this.asked;
    this.query.set(q);
    this.state.set('searching');
    try {
      const found = await this.search()(q);
      // An older search that answers late never replaces a newer one.
      if (ask !== this.asked) return;
      this.results.set(found);
      this.state.set(found.length ? 'results' : 'none');
    } catch {
      if (ask === this.asked) this.state.set('failed');
    }
  }

  protected clear(box: HTMLInputElement): void {
    box.value = '';
    this.reset();
    box.focus();
  }

  private reset(): void {
    this.asked++;
    this.query.set('');
    this.results.set([]);
    this.state.set('idle');
  }
}
