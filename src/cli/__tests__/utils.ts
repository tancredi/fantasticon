import {
  parseNumeric,
  parseString,
  validatePositionals,
  removeUndefined
} from '../utils';

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
        `${value} is not a valid number`
      );
    }
  });

  test('`parseString` returns its unchanged input when given a string', () => {
    for (const value of ['a', 'foobar', '  ']) {
      expect(parseString(value)).toBe(value);
    }
  });

  test('`parseString` throws an error when given a non-string value', () => {
    for (const value of [1, true, {}, undefined, null, false]) {
      expect(() => parseString(value as any)).toThrow(
        `${value} is not a string`
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

    for (const args of [
      ['1', '2'],
      ['1', '2', '3']
    ]) {
      expect(() => validatePositionals(args)).toThrow(
        'Only specify one input directory as a positional argument'
      );
    }
  });

  test('`removeUndefined` removes keys in an Object mapped to `undefined` values', () => {
    expect(
      removeUndefined({
        a: 1,
        b: '2',
        c: undefined,
        d: null,
        e: false,
        f: true,
        g: [],
        h: {},
        i: undefined
      })
    ).toMatchObject({ a: 1, b: '2', d: null, e: false, f: true, g: [], h: {} });
  });
});
