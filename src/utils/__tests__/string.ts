import { pluralize } from '../string';

describe('String utilities', () => {
  test('`pluralize` correctly adds an `s` to a word if given number is other than `1`', () => {
    expect(pluralize('foo', 0)).toBe('foos');
    expect(pluralize('foo', 1)).toBe('foo');
    expect(pluralize('foo', 2)).toBe('foos');
    expect(pluralize('foo', 10)).toBe('foos');
    expect(pluralize('foo', 11)).toBe('foos');
  });
});
