import ttf2eot from 'ttf2eot';
import { FontGenerator } from '../../types/generator';
import { FontType } from '../../types/misc';

const generator: FontGenerator<Buffer> = {
  dependsOn: FontType.TTF,

  async generate({ formatOptions }, ttf) {
    const font = ttf2eot(new Uint8Array(ttf), formatOptions[FontType.EOT]);
    return new Buffer(font.buffer);
  }
};

export default generator;
