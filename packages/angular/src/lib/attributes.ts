import { booleanAttribute } from '@angular/core';

/**
 * A yes or no that can also be left unset, so the part decides: written as a bare attribute
 * (<primal-field optional>) it is yes, bound it is the value, absent it is undefined.
 */
export const optionalBoolean = (value: unknown): boolean | undefined => (value === undefined || value === null ? undefined : booleanAttribute(value));
