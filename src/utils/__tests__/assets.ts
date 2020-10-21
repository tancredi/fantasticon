import { loadPaths, loadAssets, writeAssets } from '../assets';
import { writeFile } from 'fs';

const writeFileMock = (writeFile as unknown) as jest.Mock<typeof writeFile>;

jest.mock('path');
jest.mock('glob');
jest.mock('fs', () => ({ writeFile: jest.fn() }));

describe('Assets utilities', () => {
  test('`loadPaths` returns a Promise that resolves with an Array of `strings`', async () => {
    const result = loadPaths('./valid');

    expect(result).toBeInstanceOf(Promise);

    const paths = await result;

    expect(paths).toBeInstanceOf(Array);
    expect(paths.length).toBeTruthy();

    paths.forEach(path => expect(typeof path).toBe('string'));
  });

  test('`loadPaths` resolves an Array of the correct filepaths within the given directory', async () => {
    expect(await loadPaths('./valid')).toEqual([
      '/root/valid/foo.svg',
      '/root/valid/bar.svg',
      '/root/valid/sub/nested.svg',
      '/root/valid/sub/sub/nested.svg'
    ]);
  });

  test('`loadPaths` throws when given an invalid glob', async () => {
    await expect(loadPaths('./invalid')).rejects.toEqual(
      new Error('Invalid glob: ./invalid/**/*.svg')
    );
  });

  test('`loadPaths` throws when path contains no SVG assets', async () => {
    await expect(loadPaths('./empty')).rejects.toEqual(
      new Error('No SVGs found in ./empty')
    );
  });

  test('`loadAssets` resolves a key - value map of assets with expected properties', async () => {
    expect(await loadAssets('./valid')).toEqual({
      foo: {
        relativePath: 'foo.svg',
        absolutePath: '/root/valid/foo.svg',
        id: 'foo'
      },
      bar: {
        relativePath: 'bar.svg',
        absolutePath: '/root/valid/bar.svg',
        id: 'bar'
      },
      'sub-nested': {
        relativePath: 'sub/nested.svg',
        absolutePath: '/root/valid/sub/nested.svg',
        id: 'sub-nested'
      },
      'sub-sub-nested': {
        relativePath: 'sub/sub/nested.svg',
        absolutePath: '/root/valid/sub/sub/nested.svg',
        id: 'sub-sub-nested'
      }
    });
  });

  test('`writeAssets` calls writeFile for each given asset with correctly formed filepath and content', async () => {
    writeFileMock.mockImplementation((_, __, cb) => cb(null));

    await writeAssets(
      { svg: '::svg-content::', foo: '::foo-content::' } as any,
      {
        name: 'base-name',
        outputDir: '/dev/null'
      } as any
    );

    expect(writeFileMock).toHaveBeenCalledTimes(2);

    expect(writeFileMock).toHaveBeenCalledWith(
      '/dev/null/base-name.svg',
      '::svg-content::',
      expect.any(Function)
    );

    expect(writeFileMock).toHaveBeenCalledWith(
      '/dev/null/base-name.foo',
      '::foo-content::',
      expect.any(Function)
    );
  });
});
