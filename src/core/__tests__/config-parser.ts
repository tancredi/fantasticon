import { parseConfig } from '../config-parser';
import { checkPath } from '../../utils/fs-async';
import { DEFAULT_OPTIONS } from '../../constants';

const checkPathMock = checkPath as any as jest.Mock;

jest.mock('../../utils/fs-async', () => ({ checkPath: jest.fn() }));

jest.mock('../../types/misc', () => ({
  FontAssetType: { svg: 'a', eot: 'b' },
  OtherAssetType: { svg: 'c', eot: 'd' }
}));

const mockConfig = {
  inputDir: '/root',
  outputDir: '/root',
  name: 'foo',
  fontTypes: ['a', 'b'],
  assetTypes: ['c', 'd'],
  formatOptions: { svg: { foo: 'bar' } },
  pathOptions: { css: '/dev/null' },
  codepoints: { foo: 'bar' },
  fontHeight: 1,
  descent: 2,
  normalize: true,
  round: 3,
  selector: null,
  tag: 'f',
  prefix: 'baz',
  fontsUrl: '/fonts',
  templates: {
    css: 'css',
    sass: 'sass',
    scss: 'scss',
    html: 'html'
  },
  getIconId: DEFAULT_OPTIONS.getIconId,
  addLigatures: false
};

const testError = async (options: object, key: string, message: string) =>
  expect(() => parseConfig({ ...mockConfig, ...options })).rejects.toThrow(
    `Invalid option ${key}: ${message}`
  );

const testParsed = async (key: string, input: any, output: any) =>
  expect((await parseConfig({ ...mockConfig, [key]: input }))[key]).toEqual(
    output
  );

describe('Config parser', () => {
  beforeEach(() => {
    checkPathMock.mockClear();
    checkPathMock.mockImplementation(() => Promise.resolve(true));
  });

  test('returns correctly parsed input when valid', async () => {
    expect(await parseConfig({ ...mockConfig })).toEqual({ ...mockConfig });
  });

  test('correctly parses acceptable values', async () => {
    await testParsed('descent', undefined, undefined);
    await testParsed('descent', '1', 1);
    await testParsed('normalize', 'true', true);
    await testParsed('normalize', '1', true);
    await testParsed('normalize', 1, true);
  });

  test('throws expected validation errors when given invalid input', async () => {
    await testError({ inputDir: 2 }, 'inputDir', '2 is not a string');
    await testError(
      { inputDir: {} },
      'inputDir',
      '[object Object] is not a string'
    );
    await testError({ name: 3 }, 'name', '3 is not a string');
    await testError(
      { fontTypes: ['x'] },
      'fontTypes',
      'x is not valid - accepted values are: a, b'
    );
    await testError(
      { assetTypes: ['x'] },
      'assetTypes',
      'x is not valid - accepted values are: c, d'
    );
    await testError({ descent: 'a' }, 'descent', 'a is not a valid number');
    await testError(
      { normalize: null },
      'normalize',
      'must be a boolean value'
    );
    await testError({ getIconId: true }, 'getIconId', 'true is not a function');
  });

  test('correctly validates existance of input and output paths', async () => {
    checkPathMock.mockImplementationOnce(() => Promise.resolve(false));

    await testError({ inputDir: 'foo' }, 'inputDir', 'foo is not a directory');

    checkPathMock.mockImplementation(val => Promise.resolve(val !== 'bar'));

    await testError(
      { outputDir: 'bar' },
      'outputDir',
      'bar is not a directory'
    );
  });

  test('throws expected error when passing an unrecognised option', async () => {
    await expect(() =>
      parseConfig({ ...mockConfig, foo: 'bar' })
    ).rejects.toThrow("The option 'foo' is not recognised");
  });
});
