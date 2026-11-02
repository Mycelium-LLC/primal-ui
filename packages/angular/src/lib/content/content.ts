import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { PrimalButton } from '../actions/button';

/**
 * A block of code to read and copy: its language above it, and Copy Code, which says "Copied"
 * where it is. The code scrolls within itself, never the page.
 *
 *   <primal-code-block language="HTML" [code]="snippet" />
 */
@Component({
  selector: 'primal-code-block',
  imports: [PrimalButton],
  host: { class: 'pr-code-block' },
  template: `
    <div class="pr-code-block-bar">
      <span>{{ language() }}</span>
      <button primalButton type="button" emphasis="quiet" kind="constructive" [run]="copy">{{ copyLabel() }}</button>
    </div>
    <pre tabindex="0" [attr.aria-label]="language() + ' code'"><code>{{ code() }}</code></pre>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimalCodeBlock {
  readonly code = input.required<string>();
  readonly language = input('Code');
  readonly copyLabel = input('Copy Code');

  protected readonly copy = async () => {
    await navigator.clipboard.writeText(this.code());
    return 'Copied';
  };
}

/**
 * A person or a single thing: their picture, or their initials when there is none or it fails
 * to load. The name is what is read; the initials are only seen.
 *
 *   <primal-avatar name="Ada Shapiro" src="/people/ada.jpg" />
 */
@Component({
  selector: 'primal-avatar',
  host: {
    class: 'pr-avatar',
    role: 'img',
    '[attr.aria-label]': 'name()',
    '[attr.data-size]': 'size()',
  },
  template: `
    @if (src() && !failed()) {
      <img [src]="src()" alt="" (error)="failed.set(true)" />
    } @else {
      <span aria-hidden="true">{{ initials() }}</span>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimalAvatar {
  readonly name = input.required<string>();
  readonly src = input<string>();
  readonly size = input<'small' | 'medium' | 'large'>('medium');

  protected readonly failed = signal(false);
  /** The first letters of the first and last words: "Ada Shapiro" is AS, "Primal" is P. */
  protected readonly initials = computed(() => {
    const words = this.name().trim().split(/\s+/).filter(Boolean);
    const first = [...(words[0] ?? '')][0] ?? '';
    const last = words.length > 1 ? ([...words[words.length - 1]][0] ?? '') : '';
    return (first + last).toLocaleUpperCase();
  });
}

/**
 * Where content would be, when there is none: why it is empty, and the next step. Put the next
 * step's button inside it; it sits under the words.
 *
 *   <primal-empty title="No reports yet" reason="Reports appear here once the first month closes.">
 *     <button primalButton emphasis="primary">Create Report</button>
 *   </primal-empty>
 */
@Component({
  selector: 'primal-empty',
  host: { class: 'pr-empty', role: 'status' },
  template: `
    <p class="pr-empty-title">{{ title() }}</p>
    <p>{{ reason() }}</p>
    <div class="pr-empty-actions"><ng-content /></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimalEmpty {
  readonly title = input.required<string>();
  /** Why it is empty, and what makes it fill. */
  readonly reason = input.required<string>();
}
