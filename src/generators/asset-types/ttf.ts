import svg2ttf from 'svg2ttf';
import { FontGenerator } from '../../types/generator';
import { FontAssetType } from '../../types/misc';

const generator: FontGenerator<string> = {
  dependsOn: FontAssetType.SVG,

  async generate({ formatOptions }, svg) {
    const font = svg2ttf(svg, formatOptions?.ttf);
    return Buffer.from(font.buffer);
  }
};

export default generator;
