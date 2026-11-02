import { ChangeDetectionStrategy, Component, computed, contentChild, effect, inject, input } from '@angular/core';
import { PrimalControl } from './control';
import { PrimalFieldGroup } from './group';

/**
 * One question: its label, an optional description, the native control you put inside, and the
 * message that says what's wrong. A checkbox, radio or switch is laid out as a choice: the
 * control, then its label, then its description.
 *
 *   <primal-field label="Email" description="We only send receipts.">
 *     <input primalControl type="email" autocomplete="email" required />
 *   </primal-field>
 */
@Component({
  selector: 'primal-field',
  host: {
    '[class.pr-field]': '!choice()',
    '[class.pr-choice]': 'choice()',
  },
  // One projection slot, always rendered: the control must never sit inside a branch, or Angular
  // drops it when the branch changes. Choices are laid out by .pr-choice's grid instead.
  template: `
    <label [id]="labelId" [attr.for]="control()?.id()">{{ label() }}@if (showOptional()) {&ngsp;<span class="pr-optional">Optional</span>}</label>
    @if (description()) {
      <p class="pr-field-description" [id]="descriptionId">{{ description() }}</p>
    }
    <ng-content />
    @if (!inGroupRadio()) {
      <p class="pr-field-message" [id]="messageId" aria-live="polite">
        @if (control()?.message(); as message) {<span class="pr-visually-hidden">Error: </span>{{ message }}}
      </p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimalField {
  readonly label = input.required<string>();
  readonly description = input<string>();
  /** Show "Optional". By default it follows a typed control: optional unless it's required. Never on a choice. */
  readonly optional = input<boolean | undefined>(undefined);

  protected readonly control = contentChild(PrimalControl);
  private readonly group = inject(PrimalFieldGroup, { optional: true });

  private static next = 0;
  private readonly key = `pr-field-${++PrimalField.next}`;
  protected readonly descriptionId = `${this.key}-description`;
  protected readonly messageId = `${this.key}-message`;
  protected readonly labelId = `${this.key}-label`;

  protected readonly choice = computed(() => !!this.control()?.isChoice);
  /** A radio inside a group: the group asks the question and owns the message. */
  protected readonly inGroupRadio = computed(() => !!this.group && (this.control()?.element as HTMLInputElement)?.type === 'radio');

  protected readonly showOptional = computed(() => {
    const explicit = this.optional();
    if (explicit !== undefined) return explicit;
    // A checkbox, radio or switch is its own yes or no: "optional" says nothing about it.
    if (this.choice()) return false;
    const c = this.control();
    if (!c || c.element.required || c.element.disabled || (c.element as HTMLInputElement).readOnly) return false;
    // Only what can be left empty can be optional: a slider or a colour always holds a value,
    // and a select only can be left empty if it offers an empty option.
    const el = c.element;
    if (el instanceof HTMLInputElement && (el.type === 'range' || el.type === 'color')) return false;
    if (el instanceof HTMLSelectElement && !el.multiple) return [...el.options].some((o) => o.value === '');
    return true;
  });

  constructor() {
    effect(() => {
      const c = this.control();
      if (!c) return;
      c.label.set(this.label());
      c.labelId.set(this.labelId);
      const ids = [this.description() ? this.descriptionId : '', this.inGroupRadio() ? '' : this.messageId].filter(Boolean);
      c.describedByIds.set(ids);
    });
  }
}
