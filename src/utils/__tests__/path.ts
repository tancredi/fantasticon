import { removeExtension, splitSegments } from '../path';

describe('URL utilities', () => {
  test.each([
    ['foo.bar', 'foo'],
    ['foo.bar.test', 'foo.bar'],
    ['foo.bar.test.foo', 'foo.bar.test'],
    ['foo', 'foo'],
    ['', '']
  ])(
    '`removeExtension` works as expected - input: %s, output: %s',
    (input, output) => {
      expect(removeExtension(input)).toBe(output);
    }
  );

  test.each([
    ['foo/bar', ['foo', 'bar']],
    ['foo', ['foo']],
    ['', []],
    ['foo/////\\\\bar', ['foo', 'bar']],
    ['foo///// \\\\bar', ['foo', ' ', 'bar']]
  ])(
    '`splitSegments` works as expected - input: %s, output: %s',
    (input, output) => {
      expect(splitSegments(input)).toEqual(output);
    }
  );
});
