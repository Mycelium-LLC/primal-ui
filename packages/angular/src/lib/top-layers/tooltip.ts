import { DestroyRef, Directive, ElementRef, afterNextRender, effect, inject, input } from '@angular/core';
import { PrimalSide, primalLayerId, primalPlace } from './place';

/** Pointing waits this long before a tooltip shows, so passing over things doesn't flash them. */
const WAIT = 500;

/**
 * A short phrase about the thing you are pointing at or focused on: what an icon means, a
 * shortcut. It shows on hover (after a moment) and on keyboard focus, hides on leaving and on
 * Escape, and is read as the thing's description. It never holds anything to press; that is a
 * popover.
 *
 *   <button primalIconButton label="Copy Address" primalTooltip="Copies the address, ⌘C">…</button>
 */
@Directive({
  selector: '[primalTooltip]',
  host: { '[attr.aria-describedby]': 'id' },
})
export class PrimalTooltip {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  readonly primalTooltip = input.required<string>();
  readonly tooltipSide = input<PrimalSide>('above');

  protected readonly id = primalLayerId('tooltip');
  private readonly tip = document.createElement('div');
  private timer?: ReturnType<typeof setTimeout>;

  constructor() {
    this.tip.id = this.id;
    this.tip.className = 'pr-tooltip';
    this.tip.setAttribute('role', 'tooltip');
    this.tip.setAttribute('popover', 'manual');
    effect(() => (this.tip.textContent = this.primalTooltip()));

    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      // Next to its thing in the document, so it takes the thing's direction and theme.
      this.host.after(this.tip);
      const later = () => {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.show(), WAIT);
      };
      const now = () => this.host.matches(':focus-visible') && this.show();
      const hide = () => this.hide();
      const escape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && this.tip.matches(':popover-open')) {
          // Escape closes the topmost layer only: this tooltip.
          e.stopPropagation();
          this.hide();
        }
      };
      this.host.addEventListener('pointerenter', later);
      this.host.addEventListener('pointerleave', hide);
      this.host.addEventListener('focus', now);
      this.host.addEventListener('blur', hide);
      this.host.addEventListener('pointerdown', hide);
      this.host.addEventListener('keydown', escape);
      destroy.onDestroy(() => {
        clearTimeout(this.timer);
        this.host.removeEventListener('pointerenter', later);
        this.host.removeEventListener('pointerleave', hide);
        this.host.removeEventListener('focus', now);
        this.host.removeEventListener('blur', hide);
        this.host.removeEventListener('pointerdown', hide);
        this.host.removeEventListener('keydown', escape);
        this.tip.remove();
      });
    });
  }

  private show(): void {
    if (!this.tip.isConnected || this.tip.matches(':popover-open')) return;
    this.tip.showPopover();
    primalPlace(this.host, this.tip, this.tooltipSide(), true);
  }

  private hide(): void {
    clearTimeout(this.timer);
    if (this.tip.matches(':popover-open')) this.tip.hidePopover();
  }
}
