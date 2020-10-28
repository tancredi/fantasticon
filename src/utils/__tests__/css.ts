import { renderSrcAttribute } from '../css';
import { FontAssetType } from '../../types/misc';

jest.mock('../hash', () => ({
  getHash: (...values: string[]) => `::hashed(${values.join('|')})::`
}));

describe('CSS utilities', () => {
  test('`renderSrcOptions` outputs expected string for all handled font types', () => {
    const font = Buffer.from('::font-content::');
    const options = {
      fontTypes: Object.values(FontAssetType),
      name: 'my-font'
    };

    expect(renderSrcAttribute(options as any, font)).toEqual(
      [
        'url("my-font.eot?::hashed(::font-content::)::#iefix") format("embedded-opentype"),',
        'url("my-font.woff2?::hashed(::font-content::)::") format("woff2"),',
        'url("my-font.woff?::hashed(::font-content::)::") format("woff"),',
        'url("my-font.ttf?::hashed(::font-content::)::") format("truetype"),',
        'url("my-font.svg?::hashed(::font-content::)::#my-font") format("svg")'
      ].join('\n')
    );
  });

  test('`renderSrcOptions` only renders given font types', () => {
    const font = '::font-content::';
    const options = {
      fontTypes: [FontAssetType.EOT, FontAssetType.SVG],
      name: 'my-font'
    };

    expect(renderSrcAttribute(options as any, font)).toEqual(
      [
        'url("my-font.eot?::hashed(::font-content::)::#iefix") format("embedded-opentype"),',
        'url("my-font.svg?::hashed(::font-content::)::#my-font") format("svg")'
      ].join('\n')
    );
  });

  test('`renderSrcOptions` uses the `fontsUrl` option when given', () => {
    const font = '::font-content::';
    const options = {
      fontTypes: [FontAssetType.TTF],
      name: 'my-font',
      fontsUrl: '/fonts'
    };

    expect(renderSrcAttribute(options as any, font)).toEqual(
      'url("/fonts/my-font.ttf?::hashed(::font-content::)::") format("truetype")'
    );
  });
});
