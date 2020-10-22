import { parseConfig } from '../config-parser';

jest.mock('../../types/misc', () => ({
  FontAssetType: { svg: 'a', eot: 'b' },
  OtherAssetType: { svg: 'c', eot: 'd' }
}));

const mockConfig = {
  inputDir: '/dev/foo',
  outputDir: '/dev/bar',
  name: 'foo',
  fontTypes: ['a', 'b'],
  assetTypes: ['c', 'd'],
  formatOptions: { svg: { foo: 'bar' } },
  codepoints: { foo: 'bar' },
  fontHeight: 1,
  descent: 2,
  normalize: true,
  round: 3,
  selector: null,
  tag: 'f',
  prefix: 'baz'
};

const testError = (options: object, key: string, message: string) =>
  expect(() => parseConfig({ ...mockConfig, ...options })).toThrow(
    `Invalid option ${key}: ${message}`
  );

const testParsed = (key: string, input: any, output: any) =>
  expect(parseConfig({ ...mockConfig, [key]: input })[key]).toEqual(output);

describe('Config parser', () => {
  test('returns correctly parsed input when valid', () => {
    expect(parseConfig({ ...mockConfig })).toEqual({ ...mockConfig });
  });

  test('correctly parses acceptable values', () => {
    testParsed('descent', undefined, undefined);
    testParsed('descent', '1', 1);
    testParsed('normalize', 'true', true);
    testParsed('normalize', '1', true);
    testParsed('normalize', 1, true);
  });

  test('throws expected validation errors when given invalid input', () => {
    testError({ inputDir: 2 }, 'inputDir', '2 is not a string');
    testError({ inputDir: {} }, 'inputDir', '[object Object] is not a string');
    testError({ inputDir: undefined }, 'inputDir', 'undefined is not a string');
    testError({ name: 3 }, 'name', '3 is not a string');
    testError(
      { fontTypes: ['x'] },
      'fontTypes',
      'x is not valid - accepted values are: a, b'
    );
    testError(
      { assetTypes: ['x'] },
      'assetTypes',
      'x is not valid - accepted values are: c, d'
    );
    testError({ descent: 'a' }, 'descent', 'a is not a valid number');
    testError({ normalize: null }, 'normalize', 'must be a boolean value');
  });

  test('throws expected error when passing an unrecognised option', () => {
    expect(() => parseConfig({ ...mockConfig, foo: 'bar' })).toThrow(
      "The option 'foo' is not recognised"
    );
  });
});
