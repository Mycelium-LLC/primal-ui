import { withViewTransitions } from '@angular/router';

/**
 * Page changes as a short cross-fade (the browser's View Transitions), timed by Primal's motion
 * tokens in primal.css, instant under reduced motion and where the browser has no support.
 * Add it to provideRouter: provideRouter(routes, withPrimalTransitions()).
 */
export function withPrimalTransitions() {
  return withViewTransitions({ skipInitialTransition: true });
}
