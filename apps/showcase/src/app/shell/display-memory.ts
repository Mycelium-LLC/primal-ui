import { Injectable, effect, inject } from '@angular/core';
import { PrimalPreferences } from 'primal-angular';

const KEY = 'primal-showcase-display';

/**
 * Remembers the showcase's display options across reloads. A per-viewer convenience:
 * if storage is unavailable, the defaults apply and the options still work for the visit.
 */
@Injectable({ providedIn: 'root' })
export class DisplayMemory {
  private readonly prefs = inject(PrimalPreferences);

  constructor() {
    this.restore();
    effect(() => {
      const saved = {
        theme: this.prefs.theme(),
        direction: this.prefs.direction(),
      };
      try {
        localStorage.setItem(KEY, JSON.stringify(saved));
      } catch {
        // No storage: nothing to remember.
      }
    });
  }

  private restore(): void {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null');
      if (!saved) return;
      if (['system', 'light', 'dark'].includes(saved.theme)) this.prefs.theme.set(saved.theme);
      if (['ltr', 'rtl'].includes(saved.direction)) this.prefs.direction.set(saved.direction);
    } catch {
      // Unreadable or no storage: keep the defaults.
    }
  }
}
