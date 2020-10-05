import { parseNumeric, validatePositionals } from '../utils';

describe('Cli utilities', () => {
  test('`parseNumeric` returns correctly parsed number', () => {
    for (const [input, output] of [
      ['10', 10],
      ['.5', 0.5],
      ['10.0', 10],
      [' 2 ', 2]
    ]) {
      expect(parseNumeric(input as any)).toBe(output as any);
    }
  });

  test('`parseNumeric` throws an error when given a non-numeric value', () => {
    for (const value of ['a', {}, undefined]) {
      expect(() => parseNumeric(value as any)).toThrow(
        'Must be a valid number'
      );
    }
  });

  test('`validatePositionals` returns falsy when a valid arguments array is given', () => {
    for (const args of [['some-path'], ['./some-path']]) {
      expect(validatePositionals(args)).toBeFalsy();
    }
  });

  test('`validatePositionals` throws when an given array as other than a single value', () => {
    expect(() => validatePositionals([])).toThrow(
      'Please specify an input directory'
    );

    for (const args of [['1', '2'], ['1', '2', '3']]) {
      expect(() => validatePositionals(args)).toThrow(
        'Only specify one input directory as a positional argument'
      );
    }
  });
});
