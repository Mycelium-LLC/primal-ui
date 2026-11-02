import { Directive, ElementRef, inject, output, signal } from '@angular/core';

/**
 * A form that validates the Primal way: the browser's bubbles are off (novalidate), errors appear
 * under each field on submit, and focus moves to the first field that needs attention.
 * (validSubmit) fires only when every field is valid.
 */
@Directive({
  selector: 'form[primalForm]',
  host: {
    novalidate: '',
    '(submit)': 'onSubmit($event)',
    '(reset)': 'onReset()',
  },
})
export class PrimalForm {
  private readonly form = inject<ElementRef<HTMLFormElement>>(ElementRef).nativeElement;

  /** True once the person has tried to submit: every field then shows what's wrong. */
  readonly submitted = signal(false);
  readonly validSubmit = output<SubmitEvent>();
  /** Counts resets, so every control in the form starts over as untouched. */
  readonly resets = signal(0);

  protected onReset(): void {
    this.submitted.set(false);
    this.resets.update((n) => n + 1);
  }

  protected onSubmit(event: SubmitEvent): void {
    event.preventDefault();
    this.submitted.set(true);
    if (this.form.checkValidity()) {
      this.validSubmit.emit(event);
      return;
    }
    const first = this.form.querySelector<HTMLElement>(':invalid:not(fieldset, form)');
    first?.focus();
  }
}
