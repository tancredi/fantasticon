import ttf2eot from 'ttf2eot';
import { FontGenerator } from '../../types/generator.js';
import { FontAssetType } from '../../types/misc.js';

const generator: FontGenerator<Buffer> = {
  dependsOn: FontAssetType.TTF,

  async generate(_options, ttf) {
    const font = ttf2eot(new Uint8Array(ttf));
    return Buffer.from(font.buffer);
  }
};

export default generator;
