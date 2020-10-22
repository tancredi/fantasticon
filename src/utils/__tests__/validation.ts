import {
  parseNumeric,
  parseString,
  listMembersParser,
  removeUndefined,
  parseBoolean,
  optional,
  nullable,
  parseDir
} from '../validation';
import { checkPath } from '../fs-async';

const checkPathMock = (checkPath as any) as jest.Mock;

jest.mock('../fs-async', () => ({ checkPath: jest.fn() }));

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

  test('`listMembersParser` throws correct error when given values outside the given list', () => {
    const fn = listMembersParser(['a', 'b', 'c']);

    expect(() => fn(['d'])).toThrowError(
      'd is not valid - accepted values are: a, b, c'
    );
  });

  test('`listMembersParser` returns the previews array plus the new value if accepted', () => {
    const fn = listMembersParser(['a', 'b', 'c']);

    expect(fn(['a', 'b'])).toEqual(['a', 'b']);
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

  test('`parseBoolean` correctly parses boolean-like values', () => {
    for (const [input, output] of [
      ['0', false],
      ['1', true],
      [0, false],
      [1, true],
      ['true', true],
      ['false', false],
      [true, true],
      [false, false]
    ]) {
      expect(parseBoolean(input)).toBe(output);
    }
  });

  test('`parseBoolean` throws correct error when given non boolean like values', () => {
    for (const input of ['a', 2, -1, '2', {}, [], '', undefined, null]) {
      expect(() => parseBoolean(input)).toThrow('must be a boolean value');
    }
  });

  test('`nullable` wraps another parser and skips it if given value is null', () => {
    const parse = nullable(parseString);

    expect(parse(null)).toBeNull();
    expect(() => parse(2)).toThrow('2 is not a string');
    expect(() => parse(undefined)).toThrow('undefined is not a string');
  });

  test('`optional` wraps another parser and skips it if given value is undefined', () => {
    const parse = optional(parseString);

    expect(parse(undefined)).toBeUndefined();
    expect(() => parse(2)).toThrow('2 is not a string');
    expect(() => parse(null)).toThrow('null is not a string');
  });

  test('`parseDir` calls `checkPath` correctly and returns unchanged path if found to be an existing directory', async () => {
    const dirname = '/foo/bar';

    checkPathMock.mockImplementationOnce(() => Promise.resolve(true));

    expect(await parseDir(dirname)).toBe(dirname);
    expect(checkPathMock).toHaveBeenCalledTimes(1);
    expect(checkPathMock).toHaveBeenCalledWith(dirname, 'directory');
  });

  test('`parseDir` throws expected error if given path is found not to be a directory', async () => {
    const dirname = '/foo/bar';

    checkPathMock.mockImplementationOnce(() => Promise.resolve(false));

    await expect(() => parseDir(dirname)).rejects.toThrow(
      '/foo/bar is not a directory'
    );
  });
});
