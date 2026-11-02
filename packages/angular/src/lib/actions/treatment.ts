import { Directive, computed, input, booleanAttribute } from '@angular/core';
import { PrimalActionKind } from '../behaviour/model';

/** How much an action matters here. The kind adds the danger treatment on its own. */
export type PrimalEmphasis = 'default' | 'primary' | 'quiet';

/**
 * What every action shares: its kind, which decides how it behaves (PRIMAL_ACTION_KINDS), and its
 * emphasis, which decides how loud it looks. A destructive action always wears the danger edge,
 * whatever its emphasis; its last, irreversible step (final) wears the danger fill.
 */
@Directive({
  host: {
    '[attr.data-kind]': 'kind()',
    '[class.pr-button]': 'isLink',
    '[class.pr-button-primary]': "look() === 'primary'",
    '[class.pr-button-quiet]': "look() === 'quiet'",
    '[class.pr-button-danger]': "look() === 'danger'",
    '[class.pr-button-final]': "look() === 'final'",
  },
})
export abstract class PrimalActionTreatment {
  readonly kind = input<PrimalActionKind>('mutative');
  readonly emphasis = input<PrimalEmphasis>('default');
  /** The last step of an irreversible destructive action, after its gate. */
  readonly final = input(false, { transform: booleanAttribute });

  protected abstract readonly isLink: boolean;

  protected readonly look = computed(() => {
    if (this.kind() === 'destructive' || this.final()) return this.final() ? 'final' : 'danger';
    return this.emphasis();
  });
}
