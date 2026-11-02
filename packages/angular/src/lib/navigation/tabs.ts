import { ChangeDetectionStrategy, Component, ElementRef, computed, contentChildren, effect, inject, input, model, viewChildren } from '@angular/core';
import { primalLayerId } from '../top-layers/place';

/**
 * One face of the thing the tabs show: its label, and what it shows. A face keeps its state while
 * another is shown (a half-typed note stays), because it is the same thing seen another way.
 */
@Component({
  selector: 'primal-tab',
  host: {
    role: 'tabpanel',
    tabindex: '0',
    '[id]': 'panelId',
    '[attr.aria-labelledby]': 'tabId',
    '[hidden]': '!shown()',
  },
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimalTab {
  readonly label = input.required<string>();
  readonly disabled = input(false);

  readonly panelId = primalLayerId('tabpanel');
  readonly tabId = primalLayerId('tab');
  /** Set by the tabs. */
  readonly shown = model(false);
}

/**
 * Tabs switch between faces of one thing (a report's Summary, Data and History); never between
 * unrelated places, and never as filters. One stop in the tab order: the arrow keys move between
 * tabs and show each at once, Home and End go to the ends, and in right-to-left the arrows follow
 * the reading direction.
 *
 *   <primal-tabs label="Report">
 *     <primal-tab label="Summary">…</primal-tab>
 *     <primal-tab label="Data">…</primal-tab>
 *   </primal-tabs>
 */
@Component({
  selector: 'primal-tabs',
  host: { class: 'pr-tabs' },
  template: `
    <div class="pr-tablist" role="tablist" [attr.aria-label]="label()" (keydown)="key($event)">
      @for (tab of tabs(); track tab.tabId; let i = $index) {
        <button
          #tab
          type="button"
          role="tab"
          [id]="tab.tabId"
          [attr.aria-controls]="tab.panelId"
          [attr.aria-selected]="i === current()"
          [attr.tabindex]="i === current() ? 0 : -1"
          [disabled]="tab.disabled()"
          (click)="selected.set(i)"
        >
          {{ tab.label() }}
        </button>
      }
    </div>
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimalTabs {
  /** What the tabs are faces of, read aloud: "Report". */
  readonly label = input.required<string>();
  /** The face shown, by its place from 0. */
  readonly selected = model(0);

  protected readonly tabs = contentChildren(PrimalTab);
  private readonly buttons = viewChildren<ElementRef<HTMLButtonElement>>('tab');
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  protected readonly current = computed(() => Math.min(Math.max(this.selected(), 0), this.tabs().length - 1));

  constructor() {
    effect(() => {
      const i = this.current();
      this.tabs().forEach((t, n) => t.shown.set(n === i));
    });
  }

  protected key(e: KeyboardEvent): void {
    const tabs = this.tabs();
    const rtl = getComputedStyle(this.host).direction === 'rtl';
    const forward = rtl ? 'ArrowLeft' : 'ArrowRight';
    const back = rtl ? 'ArrowRight' : 'ArrowLeft';
    const moves: Record<string, () => number> = {
      [forward]: () => this.step(this.current(), 1),
      [back]: () => this.step(this.current(), -1),
      Home: () => this.step(-1, 1),
      End: () => this.step(tabs.length, -1),
    };
    const move = moves[e.key];
    if (!move) return;
    e.preventDefault();
    const to = move();
    this.selected.set(to);
    this.buttons()[to]?.nativeElement.focus();
  }

  /** The next tab that can be chosen, wrapping round. */
  private step(from: number, by: 1 | -1): number {
    const tabs = this.tabs();
    for (let n = 1; n <= tabs.length; n++) {
      const i = (((from + by * n) % tabs.length) + tabs.length) % tabs.length;
      if (!tabs[i].disabled()) return i;
    }
    return from;
  }
}
