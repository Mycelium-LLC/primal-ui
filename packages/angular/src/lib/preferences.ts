import { DOCUMENT, Injectable, effect, inject, signal } from '@angular/core';

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

  constructor() {
    effect(() => this.write('data-theme', this.theme() === 'system' ? null : this.theme()));
    effect(() => this.write('dir', this.direction()));
  }

  private write(name: string, value: string | null): void {
    if (value === null) this.root.removeAttribute(name);
    else this.root.setAttribute(name, value);
  }
}
