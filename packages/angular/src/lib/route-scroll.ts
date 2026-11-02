import { ViewportScroller } from '@angular/common';
import {
  EnvironmentProviders,
  Injectable,
  InjectionToken,
  inject,
  makeEnvironmentProviders,
  provideEnvironmentInitializer,
} from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { PrimalPreferences } from './preferences';

export interface PrimalRouteScrollOptions {
  /**
   * The box the pages scroll in, when it isn't the window: an app shell whose main area scrolls
   * on its own. Read on each navigation, so it may appear after start-up.
   */
  readonly scroller?: () => HTMLElement | null;
}

const OPTIONS = new InjectionToken<PrimalRouteScrollOptions>('PRIMAL_ROUTE_SCROLL_OPTIONS', { factory: () => ({}) });

/**
 * Moving to a new page starts at its top, as it would on a website without a router. Back and
 * forward return to where the person was; a link to an anchor goes to that anchor. Turned off
 * with PrimalPreferences.scrollToTop. Works on the window, or on a scrolling box (options.scroller).
 */
@Injectable({ providedIn: 'root' })
export class PrimalRouteScroll {
  private readonly prefs = inject(PrimalPreferences);
  private readonly viewport = inject(ViewportScroller);
  private readonly options = inject(OPTIONS);
  private trigger: NavigationStart['navigationTrigger'];
  private restoring: number | null = null;
  /** Where each visit was left, by its navigation id, so Back can return there. */
  private readonly left = new Map<number, number>();
  private current = 0;

  constructor() {
    inject(Router).events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const box = this.options.scroller?.();
        this.left.set(this.current, box ? box.scrollTop : window.scrollY);
        this.trigger = event.navigationTrigger;
        this.restoring = event.navigationTrigger === 'popstate' && event.restoredState ? event.restoredState.navigationId : null;
      }
      if (!(event instanceof NavigationEnd)) return;
      this.current = event.id;
      const box = this.options.scroller?.();
      // Back and forward: the browser restores the window; a scrolling box is restored here.
      if (this.trigger === 'popstate') {
        if (box && this.restoring !== null) {
          const top = this.left.get(this.restoring) ?? 0;
          // After the page has rendered; a timer, not a frame, so a background tab gets it too.
          setTimeout(() => box.scrollTo({ top }));
        }
        return;
      }
      if (!this.prefs.scrollToTop()) return;
      const anchor = decodeURIComponent(new URL(event.urlAfterRedirects, 'http://primal').hash.slice(1));
      if (box) {
        setTimeout(() => {
          const target = anchor ? document.getElementById(anchor) : null;
          if (target) target.scrollIntoView();
          else box.scrollTo({ top: 0 });
        });
      } else if (anchor) this.viewport.scrollToAnchor(anchor);
      else this.viewport.scrollToPosition([0, 0]);
    });
  }
}

/**
 * Turns on route-change scrolling. Add it to the application's providers, next to provideRouter.
 * Give it the scrolling box when the pages don't scroll the window:
 *   providePrimalRouteScroll({ scroller: () => document.getElementById('main') })
 */
export function providePrimalRouteScroll(options: PrimalRouteScrollOptions = {}): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: OPTIONS, useValue: options }, provideEnvironmentInitializer(() => inject(PrimalRouteScroll))]);
}
