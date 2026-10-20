import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * The frame of a page not yet built (decision 10): it says which release builds it
 * and what it will cover, then shows the plain native elements at browser defaults.
 */
@Component({
  selector: 'pr-page-placeholder',
  template: `
    <h1>{{ title() }}</h1>
    <p class="pr-placeholder-note">
      Placeholder. Release {{ release() }} builds this page: {{ covers() }} Below are the plain native
      HTML elements it covers, with only Primal's base styles so far.
    </p>
    <section class="pr-specimen" aria-label="Native specimen">
      <ng-content />
    </section>
  `,
  styleUrl: './page-placeholder.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagePlaceholder {
  readonly title = input.required<string>();
  readonly release = input.required<string>();
  readonly covers = input.required<string>();
}
