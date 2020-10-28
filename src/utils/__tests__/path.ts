import { removeExtension } from '../path';

describe('URL utilities', () => {
  test('`removeExtension` works as expected', () => {
    expect(removeExtension('foo.bar')).toBe('foo');
    expect(removeExtension('foo.bar.test')).toBe('foo.bar');
    expect(removeExtension('foo.bar.test.foo')).toBe('foo.bar.test');
    expect(removeExtension('foo')).toBe('foo');
    expect(removeExtension('')).toBe('');
  });
});
