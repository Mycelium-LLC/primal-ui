import { DOCUMENT, Injectable, computed, effect, inject, signal } from '@angular/core';

export type PrimalTheme = 'system' | 'light' | 'dark';
export type PrimalDirection = 'ltr' | 'rtl';

/**
 * The page-wide settings Primal's tokens respond to: the colour scheme (data-theme on the
 * document element; 'system' removes it, so the operating system's preference applies) and the
 * text direction (dir). The same attributes on any element force a region.
 */
@Injectable({ providedIn: 'root' })
export class PrimalPreferences {
  private readonly root = inject(DOCUMENT).documentElement;

  readonly theme = signal<PrimalTheme>('system');
  readonly direction = signal<PrimalDirection>('ltr');
  /** Moving to a new page scrolls to its top (with providePrimalRouteScroll). On by default. */
  readonly scrollToTop = signal(true);

  private readonly systemDark = signal(false);
  /** The theme that applies now: 'system' resolved to light or dark by the operating system, kept up to date. */
  readonly resolvedTheme = computed<'light' | 'dark'>(() => (this.theme() === 'system' ? (this.systemDark() ? 'dark' : 'light') : this.theme() === 'dark' ? 'dark' : 'light'));

  constructor() {
    const query = this.root.ownerDocument.defaultView?.matchMedia?.('(prefers-color-scheme: dark)');
    if (query) {
      this.systemDark.set(query.matches);
      query.addEventListener('change', (e) => this.systemDark.set(e.matches));
    }
    effect(() => this.write('data-theme', this.theme() === 'system' ? null : this.theme()));
    effect(() => this.write('dir', this.direction()));
  }

  private write(name: string, value: string | null): void {
    if (value === null) this.root.removeAttribute(name);
    else this.root.setAttribute(name, value);
  }
}
