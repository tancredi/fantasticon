import { generateFonts } from '../runner';
import { writeAssets, loadAssets } from '../../utils/assets';
import { generateAssets } from '../../generators';
import { parseConfig } from '../config-parser';
import { DEFAULT_OPTIONS } from '../../constants';

const generateAssetsMock = (generateAssets as any) as jest.Mock;
const parseConfigMock = (parseConfig as any) as jest.Mock;
const writeAssetsMock = (writeAssets as any) as jest.Mock;
const loadAssetsMock = (loadAssets as any) as jest.Mock;

jest.mock('../../constants', () => ({
  DEFAULT_OPTIONS: { hasDefaults: true, parsed: false }
}));

jest.mock('../../generators', () => ({
  generateAssets: jest.fn(options =>
    Promise.resolve({ mockGenerated: { assets: {}, options } })
  )
}));

jest.mock('../../utils/assets', () => ({
  writeAssets: jest.fn(() => Promise.resolve([{ mock: 'writeResult' }])),
  loadAssets: jest.fn(() => Promise.resolve({ mock: 'assets' }))
}));

jest.mock('../config-parser', () => ({
  parseConfig: jest.fn((config = {}) => ({ ...config, parsed: true }))
}));

describe('Runner', () => {
  beforeEach(() => {
    writeAssetsMock.mockClear();
    loadAssetsMock.mockClear();
    generateAssetsMock.mockClear();
    parseConfigMock.mockClear();
  });

  test('`generateFonts` resolves with expected results', async () => {
    const optionsIn = {} as any;
    const optionsOut = { hasDefaults: true, parsed: true };

    expect(await generateFonts(optionsIn)).toEqual({
      options: optionsOut,
      writeResults: [],
      assetsIn: { mock: 'assets' },
      assetsOut: { mockGenerated: { assets: {}, options: { mock: 'assets' } } }
    });
  });

  test('`generateFonts` resolves with asset write result if `outputDir` was passed', async () => {
    const optionsIn = { outputDir: 'foo' } as any;
    const optionsOut = { hasDefaults: true, parsed: true, outputDir: 'foo' };

    expect(await generateFonts(optionsIn)).toEqual({
      options: optionsOut,
      writeResults: [{ mock: 'writeResult' }],
      assetsIn: { mock: 'assets' },
      assetsOut: { mockGenerated: { assets: {}, options: { mock: 'assets' } } }
    });
  });

  test('`generateFonts` throws error if `outputDir` is not given and `mustWrite` is `true`', async () => {
    const optionsIn = {} as any;

    await expect(() => generateFonts(optionsIn, true)).rejects.toThrow(
      'You must specify an output path'
    );
  });

  test('`generateFonts` calls `parseConfig` correctly', async () => {
    const optionsIn = { foo: 'bar' } as any;

    await generateFonts(optionsIn);

    expect(parseConfigMock).toHaveBeenCalledTimes(1);
    expect(parseConfigMock).toHaveBeenCalledWith({
      ...DEFAULT_OPTIONS,
      ...optionsIn
    });
  });

  test('`generateFonts` calls `loadAssets` correctly', async () => {
    const inputDir = '/dev/in';
    const optionsIn = { inputDir } as any;

    await generateFonts(optionsIn);

    expect(loadAssetsMock).toHaveBeenCalledTimes(1);
    expect(loadAssetsMock).toHaveBeenCalledWith(inputDir);
  });

  test('`generateFonts` calls `generateAssets` correctly', async () => {
    const optionsIn = { foo: 'bar' } as any;

    await generateFonts(optionsIn);

    expect(generateAssetsMock).toHaveBeenCalledTimes(1);
    expect(generateAssetsMock).toHaveBeenCalledWith(
      { mock: 'assets' },
      { foo: 'bar', hasDefaults: true, parsed: true }
    );
  });

  test('`generateFonts` calls `writeAssets` correctly', async () => {
    const optionsIn = { outputDir: 'foo/bar' } as any;

    await generateFonts(optionsIn);

    expect(writeAssetsMock).toHaveBeenCalledTimes(1);
    expect(writeAssetsMock).toHaveBeenCalledWith(
      { mockGenerated: { assets: {}, options: { mock: 'assets' } } },
      { hasDefaults: true, outputDir: 'foo/bar', parsed: true }
    );
  });

  test('`generateFonts` does not call `writeAssets` if `outputDir` is not specified', async () => {
    const optionsIn = {} as any;

    await generateFonts(optionsIn);

    expect(writeAssetsMock).not.toHaveBeenCalled();
  });
});
