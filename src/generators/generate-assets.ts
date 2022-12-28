import { AssetType, FontAssetType, OtherAssetType } from '../types/misc';
import { FontGeneratorOptions } from '../types/generator';
import generators from './asset-types';
import custom from './asset-types/custom';

export type GeneratedAssets = {
  [key in FontAssetType | OtherAssetType]?: string | Buffer;
};

export const generateAssets = async (
  options: FontGeneratorOptions
): Promise<GeneratedAssets> => {
  const generated: GeneratedAssets = {};
  const generateTypes = [...options.fontTypes, ...options.assetTypes];

  const generateAsset = async (type: AssetType | 'custom', ext: string) => {
    if (generated[ext]) {
      return generated[ext];
    }
    let generator;
    let dependsOn;
    if (type === 'custom') {
      generator = custom;
      dependsOn = custom.dependsOn;
    } else {
      generator = generators[type];
      dependsOn = generator && 'dependsOn' in generator && generator.dependsOn;
    }
    const params =
      [
        options,
        dependsOn
          ? (generated[dependsOn] ?? (generated[dependsOn] = await generateAsset(dependsOn, ext)))
          : null
      ];
    if (type === 'custom'){
      params.push(ext)
    }

    return (generated[ext] = await generator.generate(...params));
  };

  for (const type of generateTypes) {
    if (type in generators) {
      await generateAsset(type, type);
    } else {
      await generateAsset('custom', type);
    }

  }

  return generateTypes.reduce(
    (out, type: AssetType) => ({ ...out, [type]: generated[type] }),
    {}
  );
};
