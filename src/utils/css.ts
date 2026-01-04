import { FontGeneratorOptions } from '../types/generator.js';
import { getHash } from './hash.js';
import { FontAssetType } from '../types/misc.js';

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

export const renderSrcAttribute = (
  { name, fontTypes, fontsUrl }: FontGeneratorOptions,
  font: string | Buffer,
  { inline = false }: { inline?: boolean } = {}
) =>
  fontTypes
    .map(fontType => {
      const { formatValue, getSuffix } = renderSrcOptions[fontType];
      const hash = getHash(font.toString('utf8'));
      const suffix = getSuffix ? getSuffix(name) : '';
      return `url("${
        fontsUrl || '.'
      }/${name}.${fontType}?${hash}${suffix}") format("${formatValue}")`;
    })
    .join(inline ? ', ' : ',\n');
