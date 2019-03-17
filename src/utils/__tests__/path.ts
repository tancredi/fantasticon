import { slashJoin, removeExtension } from '../path';

describe('URL utilities', () => {
  test('`slashJoin` joins URL segments avoiding redundant slashes', () => {
    expect(slashJoin('foo')).toBe('foo');
    expect(slashJoin('./foo', 'bar')).toBe('./foo/bar');
    expect(slashJoin('foo', 'bar')).toBe('foo/bar');
    expect(slashJoin('/foo/', '/bar/', 'din', '/don/', '/dan', 'dun/')).toBe(
      '/foo/bar/din/don/dan/dun/'
    );
  });

  test('`removeExtension` works as expected', () => {
    expect(removeExtension('foo.bar')).toBe('foo');
    expect(removeExtension('foo.bar.test')).toBe('foo.bar');
    expect(removeExtension('foo.bar.test.foo')).toBe('foo.bar.test');
    expect(removeExtension('foo')).toBe('foo');
    expect(removeExtension('')).toBe('');
  });
});
