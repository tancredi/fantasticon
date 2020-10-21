import ttf2woff2 from 'ttf2woff2';
import { FontGenerator } from '../../types/generator';
import { FontAssetType } from '../../types/misc';

const generator: FontGenerator<Buffer> = {
  dependsOn: FontAssetType.TTF,

  async generate({ formatOptions }, ttf) {
    const font = ttf2woff2(
      new Uint8Array(ttf),
      formatOptions[FontAssetType.WOFF2]
    );
    return Buffer.from(font.buffer);
  }
};

export default generator;
