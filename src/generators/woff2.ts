import ttf2woff2 from 'ttf2woff2';
import { FontGenerator } from '../types/generator';
import { FontType } from '../types/misc';

const generator: FontGenerator = {
  dependencies: [FontType.TTF],

  generate({ formatOptions }, generated, done) {
    const font = ttf2woff2(
      new Uint8Array(generated[FontType.TTF] as Buffer),
      formatOptions[FontType.WOFF2]
    );

    done(null, new Buffer(font.buffer));
  }
};

export default generator;
