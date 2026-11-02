import { ChangeDetectionStrategy, Component, HostAttributeToken, computed, inject, input } from '@angular/core';

/**
 * A link that says where it takes you. An address on another site opens in a new tab, safely,
 * and says so (an arrow shown, the words read); a download shows an arrow down and, given
 * [file], what the file is.
 *
 *   <a primalLink href="https://example.com">Example</a>
 *   <a primalLink href="/report.pdf" download file="PDF, 2 MB">Download Report</a>
 */
@Component({
  selector: 'a[primalLink]',
  host: {
    'data-kind': 'navigational',
    '[attr.target]': "isExternal() ? '_blank' : null",
    '[attr.rel]': "isExternal() ? 'noopener noreferrer external' : null",
  },
  template: `<ng-content />@if (isExternal()) {<span class="pr-visually-hidden"> (opens in a new tab)</span>}@if (file()) {&#32;<span class="pr-link-file">({{ file() }})</span>}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimalLink {
  private readonly href = inject(new HostAttributeToken('href'), { optional: true });

  /** Opens elsewhere. By default, true for an address on another site. */
  readonly external = input<boolean | undefined>(undefined);
  /** What a download is: its type and size ("PDF, 2 MB"). */
  readonly file = input<string>();

  protected readonly isExternal = computed(() => {
    const explicit = this.external();
    if (explicit !== undefined) return explicit;
    if (!this.href || !/^https?:\/\//i.test(this.href)) return false;
    return new URL(this.href).origin !== globalThis.location?.origin;
  });
}
