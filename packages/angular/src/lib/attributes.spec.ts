import { optionalBoolean } from './attributes';

describe('optionalBoolean', () => {
  it('reads a bare attribute as yes, and leaves an absent one unset', () => {
    expect(optionalBoolean('')).toBe(true);
    expect(optionalBoolean('false')).toBe(false);
    expect(optionalBoolean(true)).toBe(true);
    expect(optionalBoolean(undefined)).toBeUndefined();
  });
});
