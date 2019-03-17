import ttf2woff from 'ttf2woff';
import { FontGenerator } from '../types/generator';
import { FontType } from '../types/misc';

const generator: FontGenerator<Buffer> = {
  dependsOn: FontType.TTF,

  generate({ formatOptions }, ttf, done) {
    const font = ttf2woff(new Uint8Array(ttf), formatOptions[FontType.WOFF]);

    done(null, new Buffer(font.buffer));
  }
};

export default generator;
