import { prefillOptions, getGeneratorOptions } from '../generator-options';
import { AssetsMap } from '../../utils/assets';
import { getCodepoints } from '../../utils/codepoints';

const getCodepointsMock = (getCodepoints as any) as jest.Mock;

jest.mock('../../types/misc', () => ({
  FontAssetType: { TTF: 'TTF', EOT: 'eot' },
  OtherAssetType: { CSS: 'css', HTML: 'html' },
  ASSET_TYPES: { ttf: 'ttf', eot: 'eot', css: 'css', html: 'html' }
}));

jest.mock('../../utils/codepoints', () => ({
  getCodepoints: jest.fn(() => ({ __mock: 'processed-codepoint__' }))
}));

describe('Font generator options', () => {
  beforeEach(() => {
    getCodepointsMock.mockClear();
  });

  test('`prefillOptions` correctly extends default values for each type and prefills missing ones', () => {
    expect(
      prefillOptions(
        { html: { a: 'a', c: 'c' } },
        { ttf: { foo: 'default' }, html: { b: 'b', c: 'override-me' } }
      )
    ).toEqual({
      ttf: { foo: 'default' },
      eot: {},
      css: {},
      html: { a: 'a', b: 'b', c: 'c' }
    });
  });

  test('`getGeneratorOptions` produces usable font generator options including given `assets` and sanitised `formatOptions`', () => {
    const outputDir = '/dev/null';
    const formatOptions = { eot: { foo: 'bar' } } as any;
    const pathOptions = { eot: 'test' } as any;
    const options = {
      __mock: 'assetsMap__',
      outputDir,
      formatOptions,
      pathOptions
    } as any;
    const assets = ({ __mock: 'runnerOptions__' } as unknown) as AssetsMap;
    const generatorOptions = getGeneratorOptions(options, assets);

    // templates contain resolved paths so they are absolute and we won't test the path equality
    const templates = generatorOptions.templates;
    delete generatorOptions.templates;

    expect(generatorOptions).toEqual({
      ...options,
      assets,
      codepoints: { __mock: 'processed-codepoint__' },
      formatOptions: {
        ttf: {},
        eot: { foo: 'bar' },
        css: {},
        html: {}
      }
    });
    expect(Object.keys(templates)).toHaveLength(4);
  });

  test('`getGeneratorOptions` calls `getCodepoints` with input assets and codepoints', () => {
    const codepointsIn = { foo: 'bar' };
    const options = { codepoints: codepointsIn } as any;
    const assets = ({} as unknown) as AssetsMap;

    getGeneratorOptions(options, assets);

    expect(getCodepointsMock).toHaveBeenCalledTimes(1);
    expect(getCodepointsMock).toHaveBeenCalledWith(assets, codepointsIn);
  });
});
