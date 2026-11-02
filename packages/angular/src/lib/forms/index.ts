export * from './messages';
export * from './form';
export * from './control';
export * from './field';
export * from './group';
export * from './list';
export * from './select';
export * from './autocomplete';

import { PrimalControl } from './control';
import { PrimalField } from './field';
import { PrimalFieldGroup } from './group';
import { PrimalForm } from './form';
import { PrimalSelect } from './select';
import { PrimalAutocomplete } from './autocomplete';

/** Everything a form needs, to import in one go: imports: [PRIMAL_FORMS]. */
export const PRIMAL_FORMS = [PrimalForm, PrimalField, PrimalFieldGroup, PrimalControl, PrimalSelect, PrimalAutocomplete] as const;
