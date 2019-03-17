import { loadPaths, loadAssets } from '../assets';

jest.mock('path');
jest.mock('glob');

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
});
