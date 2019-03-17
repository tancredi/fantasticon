import ttf2eot from 'ttf2eot';
import { FontGenerator } from '../types/generator';
import { FontType } from '../types/misc';

const generator: FontGenerator = {
  dependencies: [FontType.TTF],

  generate({ formatOptions }, generated, done) {
    const font = ttf2eot(
      new Uint8Array(generated[FontType.TTF] as Buffer),
      formatOptions[FontType.EOT]
    );

    done(null, new Buffer(font.buffer));
  }
};

export default generator;
