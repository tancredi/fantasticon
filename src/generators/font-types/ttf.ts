import svg2ttf from 'svg2ttf';
import { FontGenerator } from '../../types/generator';
import { FontType } from '../../types/misc';

const generator: FontGenerator<string> = {
  dependsOn: FontType.SVG,

  async generate({ formatOptions }, svg) {
    const font = svg2ttf(svg, formatOptions[FontType.TTF]);
    return Buffer.from(font.buffer);
  }
};

export default generator;
