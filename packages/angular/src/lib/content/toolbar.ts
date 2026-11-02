import { ChangeDetectionStrategy, Component, ElementRef, afterNextRender, inject, input } from '@angular/core';

/**
 * A row of controls for one thing (a document, a table): one stop in the tab order, and the
 * arrow keys move between its controls, following the reading direction; Home and End go to the
 * ends. A .pr-divider between controls separates groups of them.
 *
 *   <primal-toolbar label="Text formatting">
 *     <button primalIconButton label="Bold">…</button>
 *     <hr class="pr-divider" />
 *     …
 *   </primal-toolbar>
 */
@Component({
  selector: 'primal-toolbar',
  host: {
    class: 'pr-toolbar',
    role: 'toolbar',
    '[attr.aria-label]': 'label()',
    '(keydown)': 'key($event)',
    '(focusin)': 'remember($event)',
  },
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimalToolbar {
  readonly label = input.required<string>();
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  constructor() {
    afterNextRender(() => this.rove(this.controls()[0]));
  }

  private controls(): HTMLElement[] {
    return [...this.host.querySelectorAll<HTMLElement>('button, a[href], input, select')].filter(
      (el) => !(el as HTMLButtonElement).disabled,
    );
  }

  /** Only one control is in the tab order: the last one used. */
  private rove(to: HTMLElement | undefined): void {
    if (!to) return;
    for (const c of this.controls()) c.tabIndex = c === to ? 0 : -1;
  }

  protected remember(e: FocusEvent): void {
    const c = (e.target as HTMLElement).closest<HTMLElement>('button, a[href], input, select');
    if (c && this.host.contains(c)) this.rove(c);
  }

  protected key(e: KeyboardEvent): void {
    // Text fields keep their arrow keys.
    if ((e.target as HTMLElement).matches('input:not([type="checkbox"], [type="radio"]), select')) return;
    const controls = this.controls();
    const at = controls.indexOf(document.activeElement as HTMLElement);
    const rtl = getComputedStyle(this.host).direction === 'rtl';
    const next: Record<string, number> = {
      [rtl ? 'ArrowLeft' : 'ArrowRight']: at + 1,
      [rtl ? 'ArrowRight' : 'ArrowLeft']: at - 1,
      Home: 0,
      End: controls.length - 1,
    };
    if (!(e.key in next)) return;
    e.preventDefault();
    const to = controls[(next[e.key] + controls.length) % controls.length];
    this.rove(to);
    to?.focus();
  }
}
