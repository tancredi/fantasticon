import ttf2eot from 'ttf2eot';
import { FontGenerator } from '../types/generator';
import { FontType } from '../types/misc';

const generator: FontGenerator<Buffer> = {
  dependsOn: FontType.TTF,

  generate({ formatOptions }, ttf, done) {
    const font = ttf2eot(new Uint8Array(ttf), formatOptions[FontType.EOT]);

    done(null, new Buffer(font.buffer));
  }
};

export default generator;
