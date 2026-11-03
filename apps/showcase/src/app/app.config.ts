import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { PreloadAllModules, provideRouter, withComponentInputBinding, withPreloading } from '@angular/router';
import { providePrimalRouteScroll, withPrimalTransitions } from '@mycelium-llc/primal-angular';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideRouter(routes, withPrimalTransitions(), withPreloading(PreloadAllModules), withComponentInputBinding()), providePrimalRouteScroll({ scroller: () => document.getElementById('main') })],
};
