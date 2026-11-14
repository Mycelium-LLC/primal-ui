export * from './tabs';
export * from './pagination';
export * from './menu';
export * from './shell-menu';
export * from './skip-link';

import { PrimalTab, PrimalTabs } from './tabs';
import { PrimalPagination } from './pagination';
import { PrimalMenu, PrimalMenuItem, PrimalMenuTrigger } from './menu';
import { PrimalShellMenu } from './shell-menu';
import { PrimalSkipLink } from './skip-link';

/** Everything that moves you: imports: [PRIMAL_NAVIGATION]. The skip link (a.pr-skip) keeps you on the page. Breadcrumbs and navigation items are CSS (.pr-breadcrumbs, .pr-nav-list). */
export const PRIMAL_NAVIGATION = [PrimalTabs, PrimalTab, PrimalPagination, PrimalMenu, PrimalMenuTrigger, PrimalMenuItem, PrimalShellMenu, PrimalSkipLink] as const;
