import { ViewportScroller } from '@angular/common';
import {
  EnvironmentProviders,
  Injectable,
  inject,
  makeEnvironmentProviders,
  provideEnvironmentInitializer,
} from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { PrimalPreferences } from './preferences';

/**
 * Moving to a new page starts at its top, as it would on a website without a router. Back and
 * forward are left to the browser, so the person returns where they were; a link to an anchor
 * goes to that anchor. Turned off with PrimalPreferences.scrollToTop.
 */
@Injectable({ providedIn: 'root' })
export class PrimalRouteScroll {
  private readonly prefs = inject(PrimalPreferences);
  private readonly scroller = inject(ViewportScroller);
  private trigger: NavigationStart['navigationTrigger'];

  constructor() {
    inject(Router).events.subscribe((event) => {
      if (event instanceof NavigationStart) this.trigger = event.navigationTrigger;
      if (!(event instanceof NavigationEnd) || !this.prefs.scrollToTop() || this.trigger === 'popstate') return;
      const anchor = new URL(event.urlAfterRedirects, 'http://primal').hash.slice(1);
      if (anchor) this.scroller.scrollToAnchor(decodeURIComponent(anchor));
      else this.scroller.scrollToPosition([0, 0]);
    });
  }
}

/** Turns on route-change scrolling. Add it to the application's providers, next to provideRouter. */
export function providePrimalRouteScroll(): EnvironmentProviders {
  return makeEnvironmentProviders([provideEnvironmentInitializer(() => inject(PrimalRouteScroll))]);
}
