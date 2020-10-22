import { prefillOptions, getGeneratorOptions } from '../generator-options';
import { AssetsMap } from '../../utils/assets';

jest.mock('../../types/misc', () => ({
  ASSET_TYPES: { svg: 'svg', eot: 'eot', ttf: 'ttf' }
}));

describe('Font generator options', () => {
  test('`prefillOptions` correctly ensures there’s at least one empty Object property for each font type key in its resulting value', () => {
    expect(prefillOptions({}, { foo: 'bar' })).toEqual({
      svg: { foo: 'bar' },
      eot: { foo: 'bar' },
      ttf: { foo: 'bar' }
    });
  });

  test('`prefillOptions` keeps input values', () => {
    const svg = { __mock: 'svgOptions__' };
    const eot = { __mock: 'eotOptions__' };
    const ttf = { __mock: 'ttfOptions__' };

    expect(
      prefillOptions({ svg, eot, ttf }, { __mock: 'remove_me__' })
    ).toEqual({
      svg,
      eot,
      ttf
    });
  });

  test('`getGeneratorOptions` produces usable font generator options including given `assets` and sanitised `formatOptions`', () => {
    const outputDir = '/dev/null';
    const formatOptions = { svg: { foo: 'bar' } } as any;
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
        svg: { foo: 'bar' },
        eot: {},
        ttf: {}
      },
      pathOptions: { svg: outputDir, eot: 'test', ttf: outputDir }
    });
  });
});
