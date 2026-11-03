import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { providePrimalRouteScroll, withPrimalTransitions } from '@mycelium-llc/primal-angular';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Page changes cross-fade on Primal's motion tokens; route params and query params arrive as inputs.
    provideRouter(routes, withPrimalTransitions(), withComponentInputBinding()),
    providePrimalRouteScroll(),
  ],
};
