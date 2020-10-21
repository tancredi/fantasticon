import { getFormatOptions, getGeneratorOptions } from '../generator-options';
import { RunnerOptions } from '../../types/runner';
import { AssetsMap } from '../../utils/assets';

describe('Font generator options', () => {
  test('`getFormatOptions` correctly ensures there’s at least one empty Object property for each font type key in its resulting value', () => {
    expect(getFormatOptions({})).toEqual({
      svg: {},
      eot: {},
      ttf: {},
      woff: {},
      woff2: {},
      css: {}
    });
  });

  test('`getFormatOptions` keeps input values', () => {
    const svg = { __mock: 'svgOptions__' };
    const eot = { __mock: 'eotOptions__' };
    const ttf = { __mock: 'ttfOptions__' };
    const woff = { __mock: 'woffOptions__' };
    const woff2 = { __mock: 'woff2Options__' };
    const css = { __mock: 'cssOptions__' };

    expect(getFormatOptions({ svg, eot, ttf, woff, woff2, css })).toEqual({
      svg,
      eot,
      ttf,
      woff,
      woff2,
      css
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
