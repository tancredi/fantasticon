import { getFormatOptions, getGeneratorOptions } from '../generator-options';
import { RunnerOptions } from '../../types/runner';
import { AssetsMap } from '../../utils/assets';

jest.mock('../../types/misc', () => ({
  ASSET_TYPES: { svg: 'svg', eot: 'eot', ttf: 'ttf' }
}));

describe('Font generator options', () => {
  test('`getFormatOptions` correctly ensures there’s at least one empty Object property for each font type key in its resulting value', () => {
    expect(getFormatOptions({})).toEqual({
      svg: {},
      eot: {},
      ttf: {}
    });
  });

  test('`getFormatOptions` keeps input values', () => {
    const svg = { __mock: 'svgOptions__' };
    const eot = { __mock: 'eotOptions__' };
    const ttf = { __mock: 'ttfOptions__' };

    expect(getFormatOptions({ svg, eot, ttf })).toEqual({
      svg,
      eot,
      ttf
    });
  });

  test('`getGeneratorOptions` produces usable font generator options including given `assets` and sanitised `formatOptions`', () => {
    const formatOptions = ({
      __mock: 'formatOptions__'
    } as unknown) as RunnerOptions['formatOptions'];
    const options = ({
      __mock: 'assetsMap__',
      formatOptions
    } as unknown) as RunnerOptions;
    const assets = ({ __mock: 'runnerOptions__' } as unknown) as AssetsMap;

    expect(getGeneratorOptions(options, assets)).toEqual({
      ...options,
      assets,
      formatOptions: getFormatOptions(formatOptions)
    });
  });
});
