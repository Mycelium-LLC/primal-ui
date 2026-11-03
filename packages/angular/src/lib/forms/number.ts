import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, computed, contentChild, inject, input, signal } from '@angular/core';
import { PrimalControl } from './control';

/** How long a held button waits before it repeats, then how often it repeats. */
const HOLD = 400;
const REPEAT = 80;

/**
 * A number you set by typing or by stepping: − and + either side of the native input, each
 * stepping by its step and stopping at min and max, faster while held. The unit sits beside the
 * value, the digits line up, and the input stays native (typing, the arrow keys, the phone's
 * number pad).
 *
 *   <primal-field label="Seats" description="Between 1 and 50.">
 *     <primal-number unit="seats">
 *       <input primalControl type="number" min="1" max="50" step="1" value="5" />
 *     </primal-number>
 *   </primal-field>
 */
@Component({
  selector: 'primal-number',
  host: { class: 'pr-number', '[class.pr-number-disabled]': 'disabled()' },
  template: `
    <button type="button" class="pr-number-step" tabindex="-1" [attr.aria-label]="'Decrease ' + label()" [disabled]="disabled() || atMin()"
      (pointerdown)="hold($event, -1)" (click)="$event.detail === 0 && stepBy(-1)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 12h12" /></svg>
    </button>
    <span class="pr-number-value">
      <ng-content />
      @if (unit()) {
        <span class="pr-number-unit" aria-hidden="true">{{ unit() }}</span>
      }
    </span>
    <button type="button" class="pr-number-step" tabindex="-1" [attr.aria-label]="'Increase ' + label()" [disabled]="disabled() || atMax()"
      (pointerdown)="hold($event, 1)" (click)="$event.detail === 0 && stepBy(1)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 6v12M6 12h12" /></svg>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimalNumber {
  /** What the number counts, shown after it ("seats", "kg", "%"). Put it in the label too, for screen readers. */
  readonly unit = input<string>();

  private readonly control = contentChild.required(PrimalControl);
  private readonly el = computed(() => this.control().element as HTMLInputElement);
  protected readonly label = computed(() => this.control().label() || 'value');

  /** The value, read from the input whenever it changes. */
  private readonly value = signal<number | null>(null);
  protected readonly disabled = signal(false);
  protected readonly atMin = computed(() => {
    const v = this.value();
    const min = this.el().min;
    return v !== null && min !== '' && v <= Number(min);
  });
  protected readonly atMax = computed(() => {
    const v = this.value();
    const max = this.el().max;
    return v !== null && max !== '' && v >= Number(max);
  });

  private timer?: ReturnType<typeof setTimeout>;

  constructor() {
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      const el = this.el();
      const read = () => {
        this.value.set(el.value === '' ? null : el.valueAsNumber);
        this.disabled.set(el.disabled || el.readOnly);
      };
      read();
      el.addEventListener('input', read);
      el.addEventListener('change', read);
      // disabled and readonly can change from outside.
      const watch = new MutationObserver(read);
      watch.observe(el, { attributes: true, attributeFilter: ['disabled', 'readonly', 'min', 'max'] });
      destroy.onDestroy(() => {
        el.removeEventListener('input', read);
        el.removeEventListener('change', read);
        watch.disconnect();
        this.stop();
      });
    });
  }

  protected stepBy(direction: 1 | -1): void {
    const el = this.el();
    if (el.disabled || el.readOnly) return;
    // An empty field starts from its min, or 0.
    if (el.value === '') el.value = el.min || '0';
    else if (direction > 0) el.stepUp();
    else el.stepDown();
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  /** A press steps once; held, it repeats until released. Focus stays in the input. */
  protected hold(event: PointerEvent, direction: 1 | -1): void {
    if (event.button !== 0) return;
    event.preventDefault();
    this.el().focus();
    this.stepBy(direction);
    const release = () => {
      this.stop();
      removeEventListener('pointerup', release);
      removeEventListener('pointercancel', release);
    };
    addEventListener('pointerup', release);
    addEventListener('pointercancel', release);
    const repeat = () => {
      this.stepBy(direction);
      this.timer = setTimeout(repeat, REPEAT);
    };
    this.timer = setTimeout(repeat, HOLD);
  }

  private stop(): void {
    clearTimeout(this.timer);
  }
}
