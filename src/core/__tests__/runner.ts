import { vi, it, describe, expect, Mock, beforeEach } from 'vitest';
import { generateFonts } from '../runner';
import { writeAssets, loadAssets } from '../../utils/assets';
import { generateAssets } from '../../generators';
import { getGeneratorOptions } from '../../generators/generator-options';
import { parseConfig } from '../config-parser';
import { DEFAULT_OPTIONS } from '../../constants';

const generateAssetsMock = generateAssets as any as Mock;
const parseConfigMock = parseConfig as any as Mock;
const writeAssetsMock = writeAssets as any as Mock;
const loadAssetsMock = loadAssets as any as Mock;
const getGeneratorOptionsMock = getGeneratorOptions as any as Mock;

vi.mock('../../constants', () => ({
  DEFAULT_OPTIONS: { hasDefaults: true, parsed: false }
}));

vi.mock('../../generators', () => ({
  generateAssets: vi.fn(options =>
    Promise.resolve({ mockGenerated: { assets: {}, options } })
  )
}));

vi.mock('../../generators/generator-options', () => ({
  getGeneratorOptions: vi.fn(() => ({ mock: 'generator-options' }))
}));

vi.mock('../../utils/assets', () => ({
  writeAssets: vi.fn(() => Promise.resolve([{ mock: 'writeResult' }])),
  loadAssets: vi.fn(() => Promise.resolve({ mock: 'assets' }))
}));

vi.mock('../config-parser', () => ({
  parseConfig: vi.fn((config = {}) => ({ ...config, parsed: true }))
}));

describe('Runner', () => {
  beforeEach(() => {
    writeAssetsMock.mockClear();
    loadAssetsMock.mockClear();
    generateAssetsMock.mockClear();
    parseConfigMock.mockClear();
    getGeneratorOptionsMock.mockClear();
  });

  it('`generateFonts` resolves with expected results', async () => {
    const optionsIn = { inputDir: 'foo' } as any;
    const optionsOut = { hasDefaults: true, parsed: true, inputDir: 'foo' };

    expect(await generateFonts(optionsIn)).toEqual({
      options: optionsOut,
      writeResults: [],
      assetsIn: { mock: 'assets' },
      assetsOut: {
        mockGenerated: {
          assets: {},
          options: { mock: 'generator-options' }
        }
      }
    });
  });

  it('`generateFonts` resolves with asset write result if `outputDir` was passed', async () => {
    const optionsIn = { inputDir: 'foo', outputDir: 'foo' } as any;
    const optionsOut = {
      hasDefaults: true,
      parsed: true,
      inputDir: 'foo',
      outputDir: 'foo'
    };

    expect(await generateFonts(optionsIn)).toEqual({
      options: optionsOut,
      writeResults: [{ mock: 'writeResult' }],
      assetsIn: { mock: 'assets' },
      assetsOut: {
        mockGenerated: { assets: {}, options: { mock: 'generator-options' } }
      }
    });
  });

  it('`generateFonts` throws error if `outputDir` is not given and `mustWrite` is `true`', async () => {
    const optionsIn = { inputDir: 'foo' } as any;

    await expect(() => generateFonts(optionsIn, true)).rejects.toThrow(
      'You must specify an output directory'
    );
  });

  it('`generateFonts` throws error if `inputDir` is not given', async () => {
    const optionsIn = {} as any;

    await expect(() => generateFonts(optionsIn)).rejects.toThrow(
      'You must specify an input directory'
    );
  });

  it('`generateFonts` calls `parseConfig` correctly', async () => {
    const optionsIn = { inputDir: 'foo', foo: 'bar' } as any;

    await generateFonts(optionsIn);

    expect(parseConfigMock).toHaveBeenCalledTimes(1);
    expect(parseConfigMock).toHaveBeenCalledWith({
      ...DEFAULT_OPTIONS,
      ...optionsIn
    });
  });

  it('`generateFonts` calls `loadAssets` correctly', async () => {
    const inputDir = '/dev/in';
    const optionsIn = { inputDir } as any;

    await generateFonts(optionsIn);

    expect(loadAssetsMock).toHaveBeenCalledTimes(1);
    expect(loadAssetsMock).toHaveBeenCalledWith({
      ...DEFAULT_OPTIONS,
      ...optionsIn,
      parsed: true
    });
  });

  it('`generateFonts` calls `getGeneratorOptions` correctly', async () => {
    const optionsIn = { inputDir: '/dev/in' } as any;

    await generateFonts(optionsIn);

    expect(getGeneratorOptionsMock).toHaveBeenCalledTimes(1);
    expect(getGeneratorOptionsMock).toHaveBeenCalledWith(
      {
        hasDefaults: true,
        inputDir: '/dev/in',
        parsed: true
      },
      { mock: 'assets' }
    );
  });

  it('`generateFonts` calls `generateAssets` correctly', async () => {
    const optionsIn = { inputDir: 'foo', foo: 'bar' } as any;

    await generateFonts(optionsIn);

    expect(generateAssetsMock).toHaveBeenCalledTimes(1);
    expect(generateAssetsMock).toHaveBeenCalledWith({
      mock: 'generator-options'
    });
  });

  it('`generateFonts` calls `writeAssets` correctly', async () => {
    const optionsIn = { outputDir: 'foo/bar', inputDir: 'foo' } as any;

    await generateFonts(optionsIn);

    expect(writeAssetsMock).toHaveBeenCalledTimes(1);
    expect(writeAssetsMock).toHaveBeenCalledWith(
      { mockGenerated: { assets: {}, options: { mock: 'generator-options' } } },
      { hasDefaults: true, inputDir: 'foo', outputDir: 'foo/bar', parsed: true }
    );
  });

  it('`generateFonts` does not call `writeAssets` if `outputDir` is not specified', async () => {
    const optionsIn = { inputDir: 'foo' } as any;

    await generateFonts(optionsIn);

    expect(writeAssetsMock).not.toHaveBeenCalled();
  });
});
