import { DOCUMENT, Injectable, inject } from '@angular/core';

/**
 * Says something to assistive technology without showing it: a button's outcome ("Saved"),
 * which is shown in place but must also be heard. One polite live region for the page.
 */
@Injectable({ providedIn: 'root' })
export class PrimalAnnouncer {
  private readonly document = inject(DOCUMENT);
  private region?: HTMLElement;

  announce(message: string): void {
    const region = (this.region ??= this.create());
    // Clear first, so the same words said twice are heard twice.
    region.textContent = '';
    setTimeout(() => (region.textContent = message), 50);
  }

  private create(): HTMLElement {
    const region = this.document.createElement('div');
    region.className = 'pr-visually-hidden';
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    this.document.body.append(region);
    return region;
  }
}
