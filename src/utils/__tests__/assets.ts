import { loadPaths, loadAssets, writeAssets } from '../assets';
import { writeFile } from '../../utils/fs-async';

const writeFileMock = (writeFile as any) as jest.Mock;

jest.mock('path');
jest.mock('glob');
jest.mock('../../utils/fs-async', () => ({
  writeFile: jest.fn(() => Promise.resolve())
}));

describe('Assets utilities', () => {
  beforeEach(() => {
    writeFileMock.mockClear();
  });

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
      '::svg-content::'
    );

    expect(writeFileMock).toHaveBeenCalledWith(
      '/dev/null/base-name.foo',
      '::foo-content::'
    );
  });

  test('`writeAssets` outputs to a different directory if `pathOptions` are specified for an asset type', async () => {
    await writeAssets(
      { svg: '::svg-content::', foo: '::foo-content::' } as any,
      {
        name: 'base-name',
        outputDir: '/dev/null',
        pathOptions: { foo: 'custom-path/to-file.ts' }
      } as any
    );

    expect(writeFileMock).toHaveBeenCalledTimes(2);

    expect(writeFileMock).toHaveBeenCalledWith(
      '/dev/null/base-name.svg',
      '::svg-content::'
    );

    expect(writeFileMock).toHaveBeenCalledWith(
      'custom-path/to-file.ts',
      '::foo-content::'
    );
  });

  test('`writeAssets` returns an object containing information on written assets', async () => {
    expect(
      await writeAssets(
        { svg: '::svg-content::', foo: '::foo-content::' } as any,
        {
          name: 'base-name',
          outputDir: '/dev/null',
          pathOptions: { foo: 'custom-path/to-file.ts' }
        } as any
      )
    ).toEqual([
      { writePath: '/dev/null/base-name.svg', content: '::svg-content::' },
      { writePath: 'custom-path/to-file.ts', content: '::foo-content::' }
    ]);
  });
});
