import crypto from 'crypto';
import { FontGenerator, FontGeneratorOptions } from '../../types/generator';
import { FontAssetType } from '../../types/misc';
import { renderTemplate } from '../../utils/template';

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

export const renderSrc = (
  { name, fontTypes }: FontGeneratorOptions,
  hash: string
) =>
  fontTypes
    .map(fontType => {
      const { formatValue, getSuffix } = renderSrcOptions[fontType];
      const suffix = getSuffix ? getSuffix(name) : '';

      return `url(./${name}.${fontType}?${hash}${suffix}) format(${formatValue})`;
    })
    .join(',\n');

const getHash = (content: string) => {
  const hash = crypto.createHash('md5');
  hash.update(content);
  return hash.digest('hex');
};

const generator: FontGenerator<Buffer> = {
  dependsOn: FontAssetType.SVG,

  generate: async (options, svg: Buffer) =>
    renderTemplate('css.hbs', {
      ...options,
      fontSrc: renderSrc(options, getHash(svg.toString('utf8')))
    })
};

export default generator;
