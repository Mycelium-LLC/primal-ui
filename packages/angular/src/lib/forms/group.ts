import { ChangeDetectionStrategy, Component, computed, contentChildren, input } from '@angular/core';
import { PrimalControl } from './control';

/**
 * Several controls that answer one question: a fieldset with its legend. A radio group is one
 * stop in the tab order and moves by arrow keys, as the browser does it; the group shows the one
 * message for all its radios.
 *
 *   <primal-field-group legend="Theme">
 *     <primal-field label="Light"><input primalControl type="radio" name="theme" value="light" required /></primal-field>
 *     …
 *   </primal-field-group>
 *
 * With [cards]="true", each choice is a card: <primal-field-group legend="Plan" [cards]="true">.
 */
@Component({
  selector: 'primal-field-group',
  template: `
    <fieldset class="pr-group" [class.pr-choice-cards]="cards()" [attr.aria-describedby]="describedBy()" (change)="recheck()" (focusout)="recheck()">
      <legend>{{ legend() }}</legend>
      @if (description()) {
        <p class="pr-field-description" [id]="descriptionId">{{ description() }}</p>
      }
      <ng-content />
      <p class="pr-field-message" [id]="messageId" aria-live="polite">
        @if (message(); as m) {<span class="pr-visually-hidden">Error: </span>{{ m }}}
      </p>
    </fieldset>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimalFieldGroup {
  readonly legend = input.required<string>();
  readonly description = input<string>();
  /**
   * Its choices as cards: each a whole target, side by side as the width allows, the chosen one in
   * the primary's quiet fill. For a few options that each need a few words (a plan, a delivery speed).
   */
  readonly cards = input(false);

  private readonly controls = contentChildren(PrimalControl, { descendants: true });

  private static next = 0;
  private readonly key = `pr-group-${++PrimalFieldGroup.next}`;
  protected readonly descriptionId = `${this.key}-description`;
  protected readonly messageId = `${this.key}-message`;

  protected readonly describedBy = computed(() => [this.description() ? this.descriptionId : '', this.messageId].filter(Boolean).join(' '));

  /** A radio's validity depends on its siblings: when one changes, every control re-reads its own. */
  protected recheck(): void {
    for (const c of this.controls()) c.check();
  }

  /** The radios' shared message: the first one that has something to say. */
  protected readonly message = computed(() => {
    const radios = this.controls().filter((c) => (c.element as HTMLInputElement).type === 'radio');
    return radios.map((c) => c.message()).find(Boolean) ?? null;
  });
}
