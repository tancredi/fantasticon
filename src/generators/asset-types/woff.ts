import ttf2woff from 'ttf2woff';
import { FontGenerator } from '../../types/generator.js';
import { FontAssetType } from '../../types/misc.js';

const generator: FontGenerator<Buffer> = {
  dependsOn: FontAssetType.TTF,

  async generate({ formatOptions }, ttf) {
    const font = ttf2woff(new Uint8Array(ttf), formatOptions?.woff);
    return Buffer.from(font.buffer);
  }
};

export default generator;
