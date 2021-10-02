import { pluralize } from '../string';

describe('String utilities', () => {
  describe('pluralize', () => {
    it.each([
      ['foo', 0, 'foos'],
      ['foo', 1, 'foo'],
      ['foo', 2, 'foos'],
      ['foo', 10, 'foos'],
      ['foo', 11, 'foos']
    ])(
      'correctly adds an `s` to a word if given number is other than `1` - word: %s, amount: %s, output: %s',
      (word, amount, output) => {
        expect(pluralize(word, amount)).toBe(output);
      }
    );
  });
});
