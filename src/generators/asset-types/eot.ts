import ttf2eot from 'ttf2eot';
import { FontGenerator } from '../../types/generator';
import { FontAssetType } from '../../types/misc';

const generator: FontGenerator<Buffer> = {
  dependsOn: FontAssetType.TTF,

  async generate({ formatOptions }, ttf) {
    const font = ttf2eot(new Uint8Array(ttf), formatOptions[FontAssetType.EOT]);
    return Buffer.from(font.buffer);
  }
};

export default generator;
