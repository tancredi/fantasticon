import ttf2woff from 'ttf2woff';
import { FontGenerator } from '../types/generator';
import { FontType } from '../types/misc';

const generator: FontGenerator = {
  dependencies: [FontType.TTF],

  generate({ formatOptions }, generated, done) {
    const font = ttf2woff(
      new Uint8Array(generated[FontType.TTF] as Buffer),
      formatOptions[FontType.WOFF]
    );

    done(null, new Buffer(font.buffer));
  }
};

export default generator;
