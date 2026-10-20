import { DOCUMENT, Injectable, effect, inject, signal } from '@angular/core';

export type PrimalTheme = 'system' | 'light' | 'dark';
export type PrimalContrast = 'system' | 'standard' | 'more';
export type PrimalDensity = 'comfortable' | 'dense';
export type PrimalDirection = 'ltr' | 'rtl';

/**
 * The page-wide display modes Primal's tokens respond to. Each one writes an attribute on the
 * document element (data-theme, data-contrast, data-density, dir); 'system' removes it, so the
 * operating system's preference applies. The same attributes on any element force a region.
 */
@Injectable({ providedIn: 'root' })
export class PrimalPreferences {
  private readonly root = inject(DOCUMENT).documentElement;

  readonly theme = signal<PrimalTheme>('system');
  readonly contrast = signal<PrimalContrast>('system');
  readonly density = signal<PrimalDensity>('comfortable');
  readonly direction = signal<PrimalDirection>('ltr');

  constructor() {
    effect(() => this.write('data-theme', this.theme() === 'system' ? null : this.theme()));
    effect(() => this.write('data-contrast', this.contrast() === 'system' ? null : this.contrast()));
    effect(() => this.write('data-density', this.density() === 'comfortable' ? null : this.density()));
    effect(() => this.write('dir', this.direction()));
  }

  private write(name: string, value: string | null): void {
    if (value === null) this.root.removeAttribute(name);
    else this.root.setAttribute(name, value);
  }
}
