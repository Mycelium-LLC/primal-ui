export * from './tabs';
export * from './pagination';
export * from './menu';

import { PrimalTab, PrimalTabs } from './tabs';
import { PrimalPagination } from './pagination';
import { PrimalMenu, PrimalMenuItem, PrimalMenuTrigger } from './menu';

/** Everything that moves you: imports: [PRIMAL_NAVIGATION]. Breadcrumbs and navigation items are CSS (.pr-breadcrumbs, .pr-nav-list). */
export const PRIMAL_NAVIGATION = [PrimalTabs, PrimalTab, PrimalPagination, PrimalMenu, PrimalMenuTrigger, PrimalMenuItem] as const;
