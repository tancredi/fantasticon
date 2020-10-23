import { FontGenerator } from '../../types/generator';
import { OtherAssetType } from '../../types/misc';

const generator: FontGenerator = {
  generate: async ({ formatOptions, codepoints }) => {
    const { indent } = formatOptions[OtherAssetType.JSON];

    return JSON.stringify(codepoints, null, indent);
  }
};

export default generator;
