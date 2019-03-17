import svg2ttf from 'svg2ttf';
import { FontGenerator } from '../types/generator';
import { FontType } from '../types/misc';

const generator: FontGenerator<string> = {
  dependsOn: FontType.SVG,

  generate({ formatOptions }, svg, done) {
    const font = svg2ttf(svg, formatOptions[FontType.TTF]);

    done(null, new Buffer(font.buffer));
  }
};

export default generator;
