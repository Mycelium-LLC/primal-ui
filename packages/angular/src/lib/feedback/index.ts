export * from './alert';
export * from './indicators';
export * from './toast';

import { PrimalAlert } from './alert';
import { PrimalSpinner, PrimalProgress, PrimalSkeleton } from './indicators';

/** Every feedback part you place in a template: imports: [PRIMAL_FEEDBACK]. Toasts come from PrimalToaster. */
export const PRIMAL_FEEDBACK = [PrimalAlert, PrimalSpinner, PrimalProgress, PrimalSkeleton] as const;
