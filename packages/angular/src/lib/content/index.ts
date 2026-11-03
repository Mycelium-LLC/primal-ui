export * from './content';
export * from './toolbar';

import { PrimalAvatar, PrimalCodeBlock, PrimalEmpty } from './content';
import { PrimalToolbar } from './toolbar';

/**
 * Content and information that need script: imports: [PRIMAL_CONTENT]. Cards, list items,
 * details, badges, status, layout and the search field are CSS (.pr-cards, .pr-list-items,
 * .pr-details, .pr-badge, .pr-status, .pr-stack, .pr-inline, .pr-grid, .pr-container, .pr-scroll,
 * .pr-search-field).
 */
export const PRIMAL_CONTENT = [PrimalCodeBlock, PrimalAvatar, PrimalEmpty, PrimalToolbar] as const;
