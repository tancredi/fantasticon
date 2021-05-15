import { removeExtension, splitSegments } from '../path';

describe('URL utilities', () => {
  describe('removeExtension', () => {
    it.each([
      ['foo.bar', 'foo'],
      ['foo.bar.test', 'foo.bar'],
      ['foo.bar.test.foo', 'foo.bar.test'],
      ['foo', 'foo'],
      ['', '']
    ])(
      'correctly removes a filename extension, when found - filename: %s, output: %s',
      (filename, output) => {
        expect(removeExtension(filename)).toBe(output);
      }
    );
  });

  describe('splitSegments', () => {
    it.each([
      ['foo/bar', ['foo', 'bar']],
      ['foo', ['foo']],
      ['', []],
      ['foo/////\\\\bar', ['foo', 'bar']],
      ['foo///// \\\\bar', ['foo', ' ', 'bar']]
    ])(
      'correctly returns an array of segments in a path - input: %s, output: %s',
      (input, output) => {
        expect(splitSegments(input)).toEqual(output);
      }
    );
  });
});
