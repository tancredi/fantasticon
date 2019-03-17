import svg2ttf from 'svg2ttf';
import { FontGenerator } from '../types/generator';
import { FontType } from '../types/misc';

const generator: FontGenerator = {
  dependencies: [],

  generate({ formatOptions }, generated, done) {
    const font = svg2ttf(generated[FontType.SVG], formatOptions[FontType.TTF]);

    done(null, new Buffer(font.buffer));
  }
};

export default generator;
