import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

let next = 0;

/**
 * Work is happening and nobody knows its shape or its length. Only then: a list that is loading
 * shows skeletons of its rows, and measurable work shows its progress.
 *
 *   <primal-spinner label="Checking the address" />
 */
@Component({
  selector: 'primal-spinner',
  host: { class: 'pr-spinner', role: 'status' },
  template: `<span class="pr-visually-hidden">{{ label() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimalSpinner {
  readonly label = input('Loading');
}

/**
 * How far along a known job is, with its words: what is happening, and the percentage. Without a
 * value it is still clearly moving, and clearly not a number; give it one as soon as you know.
 * Never fake it.
 *
 *   <primal-progress label="Uploading 3 photos" [value]="sent()" [max]="total()" />
 */
@Component({
  selector: 'primal-progress',
  host: { class: 'pr-progress' },
  template: `
    <span [id]="id">{{ label() }}</span>
    @if (percent() !== null) {
      <span class="pr-progress-value" aria-hidden="true">{{ percent() }}%</span>
    }
    <progress [attr.aria-labelledby]="id" [attr.value]="value() ?? null" [max]="max()"></progress>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimalProgress {
  readonly label = input.required<string>();
  /** How much is done; leave it out while the length is not known. */
  readonly value = input<number | undefined>(undefined);
  readonly max = input(100);

  protected readonly id = `pr-progress-${++next}`;
  protected readonly percent = computed(() => {
    const v = this.value();
    return v === undefined ? null : Math.round((Math.min(Math.max(v, 0), this.max()) / this.max()) * 100);
  });
}

export type PrimalSkeletonShape = 'line' | 'text' | 'circle' | 'block';

/**
 * The shape of what is coming. Put skeletons where the content will be, in its shape (a row's
 * avatar and two lines), inside a container marked aria-busy="true"; they are hidden from
 * assistive technology, which hears the busy state instead.
 *
 *   <ul aria-busy="true"><li><primal-skeleton shape="circle" /><primal-skeleton shape="text" /></li></ul>
 */
@Component({
  selector: 'primal-skeleton',
  host: { class: 'pr-skeleton', 'aria-hidden': 'true', '[attr.data-shape]': 'shape()' },
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimalSkeleton {
  readonly shape = input<PrimalSkeletonShape>('line');
}
