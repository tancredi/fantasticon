import ttf2woff from 'ttf2woff';
import { FontGenerator } from '../../types/generator';
import { FontType } from '../../types/misc';

const generator: FontGenerator<Buffer> = {
  dependsOn: FontType.TTF,

  async generate({ formatOptions }, ttf) {
    const font = ttf2woff(new Uint8Array(ttf), formatOptions[FontType.WOFF]);
    return Buffer.from(font.buffer);
  }
};

export default generator;
