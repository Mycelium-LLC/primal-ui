export * from './treatment';
export * from './button';
export * from './icon-button';
export * from './link';
export * from './button-group';

import { PrimalButton } from './button';
import { PrimalIconButton } from './icon-button';
import { PrimalLink } from './link';
import { PrimalButtonGroup } from './button-group';

/** Every action, to import in one go: imports: [PRIMAL_ACTIONS]. */
export const PRIMAL_ACTIONS = [PrimalButton, PrimalIconButton, PrimalLink, PrimalButtonGroup] as const;
