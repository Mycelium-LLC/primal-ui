import { ChangeDetectionStrategy, Component, ElementRef, inject, input } from '@angular/core';
import { PrimalTooltip } from '../top-layers/tooltip';
import { PrimalActionTreatment, PrimalEmphasis } from './treatment';

/**
 * An action shown by its icon alone. It still has a name, read aloud and shown on hover:
 * the person's verb and an object, like any button ("Close Panel").
 *
 *   <button primalIconButton label="Close Panel"><svg …/></button>
 *
 * Quiet by default: an icon button usually sits among others, on a toolbar or in a corner.
 */
@Component({
  selector: 'button[primalIconButton], a[primalIconButton]',
  host: {
    class: 'pr-icon-button',
    '[attr.aria-label]': 'label()',
    // Its name shows on hover as the browser's title, unless a Primal tooltip already says it.
    '[attr.title]': 'hasTooltip ? null : label()',
  },
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimalIconButton extends PrimalActionTreatment {
  protected readonly isLink = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement instanceof HTMLAnchorElement;

  protected readonly hasTooltip = !!inject(PrimalTooltip, { self: true, optional: true });

  readonly label = input.required<string>();
  override readonly emphasis = input<PrimalEmphasis>('quiet');
}
