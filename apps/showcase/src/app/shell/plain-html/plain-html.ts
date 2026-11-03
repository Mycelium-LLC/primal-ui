import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** The same thing in plain HTML, folded away under the live example: Primal's CSS works without Angular. */
@Component({
  selector: 'pr-plain-html',
  template: `
    <details class="pr-plain">
      <summary>The same in plain HTML</summary>
      <pre><code>{{ code() }}</code></pre>
    </details>
  `,
  styles: `
    .pr-plain {
      margin-block: var(--pr-gap-group) var(--pr-gap-section);
    }

    summary {
      cursor: pointer;
      color: var(--pr-color-primary-text);
      margin-block-end: var(--pr-gap-component);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlainHtml {
  readonly code = input.required<string>();
}
