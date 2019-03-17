import { getFormatOptions } from '..';

describe('Font Generators index', () => {
  test('`getFormatOptions` correctly ensures there’s at least one empty Object property for each font type key in its resulting value', () => {
    expect(getFormatOptions({})).toEqual({
      svg: {},
      eot: {},
      ttf: {},
      woff: {},
      woff2: {}
    });
  });

  test('`getFormatOptions` keeps input values', () => {
    const svg = { __mock: 'svgOptions__' };
    const eot = { __mock: 'eotOptions__' };
    const ttf = { __mock: 'ttfOptions__' };
    const woff = { __mock: 'woffOptions__' };
    const woff2 = { __mock: 'woff2Options__' };

    expect(getFormatOptions({ svg, eot, ttf, woff, woff2 })).toEqual({
      svg,
      eot,
      ttf,
      woff,
      woff2
    });
  });
});
