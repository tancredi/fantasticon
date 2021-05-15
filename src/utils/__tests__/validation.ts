import {
  parseNumeric,
  parseString,
  parseFunction,
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
  describe('parseNumeric', () => {
    it.each([
      ['10', 10],
      ['.5', 0.5],
      ['10.0', 10],
      [' 2 ', 2]
    ])(
      'returns correctly parsed number - input: %s, output: %s',
      (input, output) => {
        expect(parseNumeric(input)).toBe(output);
      }
    );

    it.each(['a', {}, undefined, true, false, null])(
      'throws an error when given a non-numeric value - input: %s',
      input => {
        expect(() => parseNumeric(input as any)).toThrow(
          `${input} is not a valid number`
        );
      }
    );
  });

  describe('parseString', () => {
    it.each(['a', 'foobar', '  '])(
      'returns its unchanged input when given a string - input: %s',
      input => {
        expect(parseString(input)).toBe(input);
      }
    );

    it('throws an error when given a non-string value', () => {
      for (const value of [1, true, {}, undefined, null, false]) {
        expect(() => parseString(value as any)).toThrow(
          `${value} is not a string`
        );
      }
    });
  });

  describe('parseFunction', () => {
    it('returns its unchanged input when given a string', () => {
      const fn = () => null;

      expect(parseFunction(fn)).toBe(fn);
    });

    it.each([null, undefined, '', 'foo', 10, {}, new RegExp('foo')])(
      '`parseFunction` throws expected error if given path is found not to be a function - input: %s',
      input => {
        expect(() => parseFunction(input as Function)).toThrow(
          `${input} is not a function`
        );
      }
    );
  });

  describe('listMembersParser', () => {
    it('throws correct error when given values outside the given list', () => {
      const fn = listMembersParser(['a', 'b', 'c']);

      expect(() => fn(['d'])).toThrowError(
        'd is not valid - accepted values are: a, b, c'
      );
    });

    it('returns the previews array plus the new value if accepted', () => {
      const fn = listMembersParser(['a', 'b', 'c']);

      expect(fn(['a', 'b'])).toEqual(['a', 'b']);
    });
  });

  describe('removeUndefined', () => {
    it('removes keys in an Object mapped to `undefined` values', () => {
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
      ).toMatchObject({
        a: 1,
        b: '2',
        d: null,
        e: false,
        f: true,
        g: [],
        h: {}
      });
    });
  });

  describe('parseBoolean', () => {
    it.each([
      ['0', false],
      ['1', true],
      [0, false],
      [1, true],
      ['true', true],
      ['false', false],
      [true, true],
      [false, false]
    ])(
      'correctly parses boolean-like values - input: %s, output: %s',
      (input, output) => {
        expect(parseBoolean(input)).toBe(output);
      }
    );

    it.each(['a', 2, -1, '2', {}, [], '', undefined, null])(
      'throws correct error when given non boolean like values - input: %s',
      input => {
        expect(() => parseBoolean(input)).toThrow('must be a boolean value');
      }
    );
  });

  describe('nullable', () => {
    it('wraps another parser and skips it if given value is null', () => {
      const parse = nullable(parseString);

      expect(parse(null)).toBeNull();
      expect(() => parse(2)).toThrow('2 is not a string');
      expect(() => parse(undefined)).toThrow('undefined is not a string');
    });
  });

  describe('optional', () => {
    it('wraps another parser and skips it if given value is undefined', () => {
      const parse = optional(parseString);

      expect(parse(undefined)).toBeUndefined();
      expect(() => parse(2)).toThrow('2 is not a string');
      expect(() => parse(null)).toThrow('null is not a string');
    });
  });

  describe('parseDir', () => {
    it('calls `checkPath` correctly and returns unchanged path if found to be an existing directory', async () => {
      const dirname = '/foo/bar';

      checkPathMock.mockImplementationOnce(() => Promise.resolve(true));

      expect(await parseDir(dirname)).toBe(dirname);
      expect(checkPathMock).toHaveBeenCalledTimes(1);
      expect(checkPathMock).toHaveBeenCalledWith(dirname, 'directory');
    });

    it('throws expected error if given path is found not to be a directory', async () => {
      const dirname = '/foo/bar';

      checkPathMock.mockImplementationOnce(() => Promise.resolve(false));

      await expect(() => parseDir(dirname)).rejects.toThrow(
        '/foo/bar is not a directory'
      );
    });
  });
});
