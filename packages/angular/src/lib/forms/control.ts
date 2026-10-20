import { Directive, ElementRef, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { PRIMAL_MESSAGES, PrimalNativeControl } from './messages';
import { PrimalForm } from './form';

let next = 0;

/**
 * Marks the native control inside a primal-field. The control stays native (autofill, pickers,
 * the phone's keyboard); this directive gives it an id, ties it to its label, description and
 * message, and follows its validity.
 */
@Directive({
  selector: 'input[primalControl], select[primalControl], textarea[primalControl]',
  host: {
    '[id]': 'id()',
    '[attr.aria-describedby]': 'describedBy()',
    '[attr.aria-invalid]': "showError() ? 'true' : null",
    '(blur)': 'touched.set(true); check()',
    '(input)': 'check()',
    '(change)': 'touched.set(true); check()',
    '(invalid)': 'check()',
  },
})
export class PrimalControl {
  readonly element = inject<ElementRef<PrimalNativeControl>>(ElementRef).nativeElement;
  private readonly form = inject(PrimalForm, { optional: true });
  private readonly messages = inject(PRIMAL_MESSAGES);

  /** The control's id; generated unless the element has one. */
  readonly id = signal(this.element.id || `pr-control-${++next}`);
  /** Ids of the description and message that describe this control, set by its field. */
  readonly describedByIds = signal<string[]>([]);
  readonly describedBy = computed(() => this.describedByIds().join(' ') || null);
  /** The field's label, used to word the message. */
  readonly label = signal('');
  /** An error from outside (your forms library, the server). It wins over the browser's own. */
  readonly error = input<string | null | undefined>(undefined, { alias: 'primalControl' });

  readonly touched = signal(false);
  private readonly validity = signal(0);

  constructor() {
    // A reset form starts over: no field counts as answered until the person answers it again.
    effect(() => {
      if (!this.form?.resets()) return;
      untracked(() => {
        this.touched.set(false);
        this.check();
      });
    });
  }

  /** Re-read the control's validity (after a value or attribute changes). */
  check(): void {
    this.validity.update((n) => n + 1);
  }

  /** The message to show now, or null: after the person leaves the field, or after they submit. */
  readonly message = computed(() => {
    this.validity();
    const outside = this.error();
    if (outside) return outside;
    if (!this.touched() && !this.form?.submitted()) return null;
    return this.messages(this.element, this.label());
  });

  readonly showError = computed(() => !!this.message());

  get isChoice(): boolean {
    const t = (this.element as HTMLInputElement).type;
    return t === 'checkbox' || t === 'radio';
  }
}
