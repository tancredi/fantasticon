import ttf2woff2 from 'ttf2woff2';
import { FontGenerator } from '../types/generator';
import { FontType } from '../types/misc';

const generator: FontGenerator<Buffer> = {
  dependsOn: FontType.TTF,

  generate({ formatOptions }, ttf, done) {
    const font = ttf2woff2(new Uint8Array(ttf), formatOptions[FontType.WOFF2]);

    done(null, new Buffer(font.buffer));
  }
};

export default generator;
