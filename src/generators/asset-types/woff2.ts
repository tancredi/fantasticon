import ttf2woff2 from 'ttf2woff2';
import { FontGenerator } from '../../types/generator';
import { FontAssetType } from '../../types/misc';

const generator: FontGenerator<Buffer> = {
  dependsOn: FontAssetType.TTF,

  async generate(_options, ttf) {
    const font = ttf2woff2(ttf);
    return Buffer.from(font.buffer);
  }
};

export default generator;
