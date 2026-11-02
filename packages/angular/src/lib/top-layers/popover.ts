import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Directive,
  ElementRef,
  afterNextRender,
  contentChild,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { PrimalSide, primalFocusables, primalLayerId, primalPlace } from './place';

/** The button that opens a popover. */
@Directive({ selector: '[primalPopoverTrigger]' })
export class PrimalPopoverTrigger {
  readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
}

/**
 * Something beside the page, opened by a button: a few details, a small form, a choice. The page
 * stays the person's own (it scrolls and reads, and pressing outside closes the popover), and
 * closing returns focus to the button. If the popover holds something to press or type, focus
 * moves into it when it opens.
 *
 * Keys: Enter or Space on the button opens and closes it; Escape closes it.
 *
 *   <primal-popover label="Share report">
 *     <button primalPopoverTrigger primalButton>Share Report</button>
 *     …
 *   </primal-popover>
 */
@Component({
  selector: 'primal-popover',
  styles: `
    :host {
      display: inline-block;
    }
  `,
  template: `
    <ng-content select="[primalPopoverTrigger]" />
    <div #layer class="pr-layer" popover="auto" role="dialog" [id]="id" [attr.aria-label]="label()" (toggle)="toggled($event)">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimalPopover {
  /** What it holds, read aloud when it opens: "Share report". */
  readonly label = input.required<string>();
  readonly side = input<PrimalSide>('below');

  private readonly trigger = contentChild.required(PrimalPopoverTrigger);
  private readonly layer = viewChild.required<ElementRef<HTMLElement>>('layer');
  protected readonly id = primalLayerId('popover');
  private readonly open = signal(false);
  private closedAt = 0;

  constructor() {
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      const button = this.trigger().element;
      button.setAttribute('aria-haspopup', 'dialog');
      button.setAttribute('aria-controls', this.id);
      button.setAttribute('aria-expanded', 'false');
      const click = () => {
        // A press on the button while open closes it first (light dismiss); it must not reopen it.
        if (Date.now() - this.closedAt < 300) return;
        if (this.open()) this.hide();
        else this.show();
      };
      const place = () => this.open() && primalPlace(button, this.layer().nativeElement, this.side());
      button.addEventListener('click', click);
      window.addEventListener('resize', place);
      window.addEventListener('scroll', place, true);
      destroy.onDestroy(() => {
        button.removeEventListener('click', click);
        window.removeEventListener('resize', place);
        window.removeEventListener('scroll', place, true);
      });
    });
  }

  show(): void {
    const layer = this.layer().nativeElement;
    if (!layer.matches(':popover-open')) layer.showPopover();
    primalPlace(this.trigger().element, layer, this.side());
    primalFocusables(layer)[0]?.focus();
  }

  hide(): void {
    const layer = this.layer().nativeElement;
    if (layer.matches(':popover-open')) layer.hidePopover();
  }

  protected toggled(e: Event): void {
    const open = (e as ToggleEvent).newState === 'open';
    this.open.set(open);
    if (!open) this.closedAt = Date.now();
    this.trigger().element.setAttribute('aria-expanded', String(open));
    if (!open && this.layer().nativeElement.contains(document.activeElement)) this.trigger().element.focus();
  }
}
