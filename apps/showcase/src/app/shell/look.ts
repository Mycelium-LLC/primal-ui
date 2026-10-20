import { DOCUMENT, Injectable, effect, inject, signal } from '@angular/core';
import { PrimalPreferences } from 'primal-angular';

export type Look = 'primal' | 'demo';

const KEY = 'primal-showcase-display';

/**
 * The showcase's look (Primal or the demo theme), and memory of the display options across
 * reloads. Memory is a per-viewer convenience: if storage is unavailable, defaults apply.
 */
@Injectable({ providedIn: 'root' })
export class ShowcaseLook {
  private readonly root = inject(DOCUMENT).documentElement;
  private readonly prefs = inject(PrimalPreferences);

  readonly look = signal<Look>('primal');

  constructor() {
    this.restore();
    effect(() => {
      if (this.look() === 'demo') this.root.setAttribute('data-look', 'demo');
      else this.root.removeAttribute('data-look');
    });
    effect(() => {
      const saved = {
        theme: this.prefs.theme(),
        contrast: this.prefs.contrast(),
        density: this.prefs.density(),
        direction: this.prefs.direction(),
        look: this.look(),
      };
      try {
        localStorage.setItem(KEY, JSON.stringify(saved));
      } catch {
        // No storage: the options still work for this visit.
      }
    });
  }

  private restore(): void {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null');
      if (!saved) return;
      if (['system', 'light', 'dark'].includes(saved.theme)) this.prefs.theme.set(saved.theme);
      if (['system', 'standard', 'more'].includes(saved.contrast)) this.prefs.contrast.set(saved.contrast);
      if (['comfortable', 'dense'].includes(saved.density)) this.prefs.density.set(saved.density);
      if (['ltr', 'rtl'].includes(saved.direction)) this.prefs.direction.set(saved.direction);
      if (['primal', 'demo'].includes(saved.look)) this.look.set(saved.look);
    } catch {
      // Unreadable or no storage: keep the defaults.
    }
  }
}
