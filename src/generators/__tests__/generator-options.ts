import { prefillOptions, getGeneratorOptions } from '../generator-options';
import { AssetsMap } from '../../utils/assets';

jest.mock('../../types/misc', () => ({
  FontAssetType: { TTF: 'TTF', EOT: 'eot' },
  OtherAssetType: { CSS: 'css', HTML: 'html' },
  ASSET_TYPES: { ttf: 'ttf', eot: 'eot', css: 'css', html: 'html' }
}));

describe('Font generator options', () => {
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

    expect(getGeneratorOptions(options, assets)).toEqual({
      ...options,
      assets,
      formatOptions: {
        ttf: {},
        eot: { foo: 'bar' },
        css: {},
        html: {}
      }
    });
  });
});
