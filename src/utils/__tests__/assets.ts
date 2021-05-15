import { loadPaths, loadAssets, writeAssets } from '../assets';
import { GetIconIdFn } from '../../types/misc';
import { DEFAULT_OPTIONS } from '../../constants';
import { writeFile } from '../fs-async';

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

  describe('loadPaths', () => {
    it('returns a Promise that resolves with an Array of `strings`', async () => {
      const result = loadPaths('./valid');

      expect(result).toBeInstanceOf(Promise);

      const paths = await result;

      expect(paths).toBeInstanceOf(Array);
      expect(paths.length).toBeTruthy();

      paths.forEach(path => expect(typeof path).toBe('string'));
    });

    it('resolves an Array of the correct filepaths within the given directory', async () => {
      expect(await loadPaths('./valid')).toEqual([
        '/project/valid/foo.svg',
        '/project/valid/bar.svg',
        '/project/valid/sub/nested.svg',
        '/project/valid/sub/sub/nested.svg'
      ]);
    });

    it('throws when given an invalid glob', async () => {
      await expect(loadPaths('./invalid')).rejects.toEqual(
        new Error('Invalid glob: ./invalid/**/*.svg')
      );
    });

    it('throws when path contains no SVG assets', async () => {
      await expect(loadPaths('./empty')).rejects.toEqual(
        new Error('No SVGs found in ./empty')
      );
    });
  });

  describe('loadAssets', () => {
    it('resolves a key - value map of assets with expected properties', async () => {
      expect(
        await loadAssets({
          ...DEFAULT_OPTIONS,
          inputDir: './valid',
          outputDir: './output'
        })
      ).toEqual({
        foo: {
          relativePath: 'foo.svg',
          absolutePath: '/root/project/valid/foo.svg',
          id: 'foo'
        },
        bar: {
          relativePath: 'bar.svg',
          absolutePath: '/root/project/valid/bar.svg',
          id: 'bar'
        },
        'sub-nested': {
          relativePath: 'sub/nested.svg',
          absolutePath: '/root/project/valid/sub/nested.svg',
          id: 'sub-nested'
        },
        'sub-sub-nested': {
          relativePath: 'sub/sub/nested.svg',
          absolutePath: '/root/project/valid/sub/sub/nested.svg',
          id: 'sub-sub-nested'
        }
      });
    });

    it('generates icon IDs correctly when called with a custom `getIconId` function', async () => {
      const getIconId: GetIconIdFn = jest.fn(({ relativeFilePath, index }) => {
        return `${index}_${relativeFilePath
          .replace('.svg', '')
          .split('/')
          .join('_')}`;
      });

      expect(
        await loadAssets({
          ...DEFAULT_OPTIONS,
          inputDir: './valid',
          outputDir: './output',
          getIconId
        })
      ).toEqual({
        '0_foo': {
          relativePath: 'foo.svg',
          absolutePath: '/root/project/valid/foo.svg',
          id: '0_foo'
        },
        '1_bar': {
          relativePath: 'bar.svg',
          absolutePath: '/root/project/valid/bar.svg',
          id: '1_bar'
        },
        '2_sub_nested': {
          relativePath: 'sub/nested.svg',
          absolutePath: '/root/project/valid/sub/nested.svg',
          id: '2_sub_nested'
        },
        '3_sub_sub_nested': {
          relativePath: 'sub/sub/nested.svg',
          absolutePath: '/root/project/valid/sub/sub/nested.svg',
          id: '3_sub_sub_nested'
        }
      });

      expect(getIconId).toHaveBeenCalledTimes(4);

      expect(getIconId).toHaveBeenNthCalledWith(1, {
        basename: 'foo',
        relativeDirPath: '',
        absoluteFilePath: '/root/project/valid/foo.svg',
        relativeFilePath: 'foo.svg',
        index: 0
      });

      expect(getIconId).toHaveBeenNthCalledWith(4, {
        basename: 'nested',
        relativeDirPath: 'sub/sub',
        absoluteFilePath: '/root/project/valid/sub/sub/nested.svg',
        relativeFilePath: 'sub/sub/nested.svg',
        index: 3
      });
    });

    it('rejects correctly if `getIconId` resolves the same `key` while processing different assets', async () => {
      const getIconId: GetIconIdFn = () => 'xxx';

      await expect(() =>
        loadAssets({
          ...DEFAULT_OPTIONS,
          inputDir: './valid',
          outputDir: './output',
          getIconId: getIconId
        })
      ).rejects.toEqual(
        new Error(
          "Conflicting result from 'getIconId': 'xxx' - conflicting input files:\n  - foo.svg\n  - bar.svg"
        )
      );
    });
  });

  describe('writeAssets', () => {
    it('calls `fs.writeFile` for each given asset with correctly formed filepath and content', async () => {
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

    it('outputs to a different directory if `pathOptions` are specified for an asset type', async () => {
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

    it('returns an object containing information on written assets', async () => {
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
});
