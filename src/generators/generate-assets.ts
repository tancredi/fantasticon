import { AssetType, FontAssetType, OtherAssetType } from '../types/misc';
import { FontGeneratorOptions } from '../types/generator';
import generators from './asset-types';

export type GeneratedAssets = {
  [key in FontAssetType | OtherAssetType]?: string | Buffer;
};

export const generateAssets = async (
  options: FontGeneratorOptions
): Promise<GeneratedAssets> => {
  const generated: GeneratedAssets = {};
  const generateTypes = [...options.fontTypes, ...options.assetTypes];

  const generateAsset = async (type: AssetType) => {
    if (generated[type]) {
      return generated[type];
    }

    const generator = generators[type];
    const dependsOn = 'dependsOn' in generator && generator.dependsOn;

    if (dependsOn && !generated[dependsOn]) {
      generated[dependsOn] = await generateAsset(dependsOn);
    }

    return (generated[type] = await generator.generate(
      options,
      dependsOn ? generated[dependsOn] : null
    ));
  };

  for (const type of generateTypes) {
    await generateAsset(type);
  }

  return generateTypes.reduce(
    (out, type: AssetType) => ({ ...out, [type]: generated[type] }),
    {}
  );
};
