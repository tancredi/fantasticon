import { FontGenerator } from '../../types/generator.js';
import { FontAssetType } from '../../types/misc.js';

const generator: FontGenerator<Buffer> = {
  dependsOn: FontAssetType.TTF,

  async generate(_options, ttf) {
    const font = (await import('ttf2woff2')).default(ttf);
    return Buffer.from(font.buffer);
  }
};

export default generator;
