import { DOCUMENT, Directive, ElementRef, inject } from '@angular/core';

/**
 * The skip link, in an Angular app: `<a class="pr-skip" href="#main">Skip to Content</a>` with
 * PRIMAL_NAVIGATION imported. With a <base href>, a bare "#main" link points at the app's root, so
 * the browser would leave the page (and an app in memory would lose its state). This keeps the
 * person where they are: it moves focus to the target, scrolls it into view, and leaves the
 * address alone. The target needs tabindex="-1" if it isn't focusable itself.
 */
@Directive({
  selector: 'a.pr-skip',
  host: { '(click)': 'skip($event)' },
})
export class PrimalSkipLink {
  private readonly document = inject(DOCUMENT);
  private readonly link = inject<ElementRef<HTMLAnchorElement>>(ElementRef).nativeElement;

  protected skip(event: MouseEvent): void {
    const id = decodeURIComponent((this.link.getAttribute('href') ?? '').replace(/^#/, ''));
    const target = id ? this.document.getElementById(id) : null;
    if (!target) return;
    event.preventDefault();
    target.focus();
    target.scrollIntoView({ block: 'start' });
  }
}
