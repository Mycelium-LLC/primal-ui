export * from './table';

import { PrimalTable } from './table';

/** Sortable tables: imports: [PRIMAL_TABLES], and every table in the component sorts by its columns. */
export const PRIMAL_TABLES = [PrimalTable] as const;
