export * from './place';
export * from './dialog';
export * from './confirm';
export * from './popover';
export * from './tooltip';

import { PrimalDialog } from './dialog';
import { PrimalPopover, PrimalPopoverTrigger } from './popover';
import { PrimalTooltip } from './tooltip';

/** Everything on top of the page: imports: [PRIMAL_TOP_LAYERS]. Confirmations come from PrimalConfirm; accordions are <details> with .pr-accordion. */
export const PRIMAL_TOP_LAYERS = [PrimalDialog, PrimalPopover, PrimalPopoverTrigger, PrimalTooltip] as const;
