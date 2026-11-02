import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type PrimalTone = 'info' | 'success' | 'warning' | 'danger';

/**
 * Place: alert (or banner). Something about this place is true and stays true until it changes:
 * a plan about to end, a report out of date. It sits in the flow, above what it is about, and
 * says its tone with a mark and words as well as colour. It has no close button: a fact is
 * changed, not dismissed.
 *
 *   <primal-alert tone="warning" title="Your plan ends in 3 days">
 *     <p>Renew it to keep your reports.</p>
 *     <div class="pr-alert-actions"><button primalButton>Renew Plan</button></div>
 *   </primal-alert>
 *
 * Set [live] when it appears after the page has loaded, so it is heard.
 */
@Component({
  selector: 'primal-alert',
  host: {
    class: 'pr-alert',
    '[class.pr-banner]': 'banner()',
    '[attr.data-tone]': 'tone()',
    '[attr.data-place]': "banner() ? 'banner' : 'alert'",
    '[attr.role]': 'role()',
  },
  template: `
    @if (title()) {
      <p class="pr-alert-title">{{ title() }}</p>
    }
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimalAlert {
  readonly tone = input<PrimalTone>('info');
  readonly title = input<string>();
  /** About the whole product (offline, maintenance): edge to edge, above everything. */
  readonly banner = input(false);
  /** Announce it: it appeared after the page loaded. Danger is urgent; the rest is polite. */
  readonly live = input(false);

  protected readonly role = computed(() => (!this.live() ? null : this.tone() === 'danger' ? 'alert' : 'status'));
}
