import { RunnerOptions } from '../types/runner';
import { FontGeneratorOptions } from '../types/generator';
import { AssetType, ASSET_TYPES } from '../types/misc';
import { AssetsMap } from '../utils/assets';

export const getGeneratorOptions = (
  options: RunnerOptions,
  assets: AssetsMap
): FontGeneratorOptions => ({
  ...options,
  formatOptions: prefillOptions(options.formatOptions, {}),
  pathOptions: prefillOptions(options.pathOptions, options.outputDir),
  assets
});

export const prefillOptions = <T>(
  userOptions: { [key in AssetType]?: T } = {},
  emptyValue: T
) =>
  Object.values(ASSET_TYPES).reduce(
    (cur = {}, type: AssetType) => ({
      ...cur,
      [type]: userOptions[type] || emptyValue
    }),
    {}
  ) as { [key in AssetType]: T };
