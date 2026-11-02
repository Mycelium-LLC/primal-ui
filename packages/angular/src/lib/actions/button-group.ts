import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * A few buttons that act on one thing, joined into one control, with one name for the group
 * ("Text alignment"). Give its buttons aria-pressed to make them a set of toggles.
 *
 *   <primal-button-group label="Text alignment">
 *     <button type="button" [attr.aria-pressed]="align() === 'start'" (click)="align.set('start')">Start</button>
 *     …
 *   </primal-button-group>
 *
 * For a row of separate actions (Cancel, Save, and a Delete apart), use the .pr-actions layout.
 */
@Component({
  selector: 'primal-button-group',
  host: {
    class: 'pr-button-group',
    role: 'group',
    '[attr.aria-label]': 'label()',
  },
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimalButtonGroup {
  readonly label = input.required<string>();
}
