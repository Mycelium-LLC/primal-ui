import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimalRouteScroll, withPrimalTransitions } from '@mycelium-llc/primal-angular';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Page changes cross-fade on Primal's motion tokens; a new page starts at its top, Back returns.
    provideRouter(routes, withPrimalTransitions()),
    providePrimalRouteScroll(),
  ],
};
