import { FontGeneratorOptions } from '../types/generator';
import { getHash } from './hash';
import { FontAssetType } from '../types/misc';

interface RenderSrcOptions {
  formatValue: string;
  getSuffix?: (name: string) => string;
}

const renderSrcOptions: { [key in FontAssetType]: RenderSrcOptions } = {
  [FontAssetType.EOT]: {
    formatValue: 'embedded-opentype',
    getSuffix: () => '#iefix'
  },
  [FontAssetType.WOFF2]: { formatValue: 'woff2' },
  [FontAssetType.WOFF]: { formatValue: 'woff' },
  [FontAssetType.TTF]: { formatValue: 'truetype' },
  [FontAssetType.SVG]: { formatValue: 'svg', getSuffix: name => `#${name}` }
};

export const getUrl = ({ name, fontType, fontsUrl }: { name: string, fontType: FontAssetType, fontsUrl: string },
  font: string | Buffer) => {
  
  const { getSuffix } = renderSrcOptions[fontType];
  const hash = getHash(font.toString('utf8'));
  const suffix = getSuffix ? getSuffix(name) : '';

  return `${
    fontsUrl || '.'
  }/${name}.${fontType}?${hash}${suffix}`;
}  

export const renderSrcAttribute = (
  { name, fontTypes, fontsUrl }: FontGeneratorOptions,
  font: string | Buffer
) =>
  fontTypes
    .map(fontType => {
      const { formatValue } = renderSrcOptions[fontType];
      return `url("${getUrl({ name, fontType, fontsUrl }, font)}") format("${formatValue}")`;
    })
    .join(',\n');

export const renderUrlsAttribute = (
  { name, fontTypes, fontsUrl }: FontGeneratorOptions,
    font: string | Buffer
  ) =>
    fontTypes
      .map(fontType => {
        const { formatValue } = renderSrcOptions[fontType];
        return `${getUrl({ name, fontType, fontsUrl }, font)}`;
      });
  