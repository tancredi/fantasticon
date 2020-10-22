import { FontGenerator } from '../../types/generator';
import { OtherAssetType } from '../../types/misc';

const generator: FontGenerator = {
  generate: async ({ formatOptions, codepoints }) => {
    const { indent: _indent } = formatOptions[OtherAssetType.JSON];
    const indent = typeof _indent === 'number' ? _indent : 4;

    return JSON.stringify(codepoints, null, indent);
  }
};

export default generator;
