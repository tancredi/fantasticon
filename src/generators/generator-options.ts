import { RunnerOptions } from '../types/runner';
import { FontGeneratorOptions } from '../types/generator';
import { AssetType, ASSET_TYPES } from '../types/misc';
import { AssetsMap } from '../utils/assets';

export const getGeneratorOptions = (
  options: RunnerOptions,
  assets: AssetsMap
): FontGeneratorOptions => ({
  ...options,
  formatOptions: getFormatOptions(options.formatOptions),
  assets
});

export const getFormatOptions = (
  userOptions: RunnerOptions['formatOptions'] = {}
): FontGeneratorOptions['formatOptions'] =>
  Object.values(ASSET_TYPES).reduce(
    (cur = {}, type: AssetType) => ({
      ...cur,
      [type]: userOptions[type] || {}
    }),
    {}
  ) as FontGeneratorOptions['formatOptions'];
