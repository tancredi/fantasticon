import { join } from 'path';
import { DEFAULT_OPTIONS, TEMPLATES_DIR } from '../constants';
import { RunnerOptions } from '../types/runner';
import { FormatOptions } from '../types/format';
import { getCodepoints } from '../utils/codepoints';
import { FontGeneratorOptions } from '../types/generator';
import {
  AssetType,
  OtherAssetType,
  ASSET_TYPES,
  ASSET_TYPES_WITH_TEMPLATE
} from '../types/misc';
import { AssetsMap } from '../utils/assets';

export const getGeneratorOptions = (
  options: RunnerOptions,
  assets: AssetsMap
): FontGeneratorOptions => ({
  ...options,
  codepoints: getCodepoints(assets, options.codepoints),
  formatOptions: prefillOptions<AssetType, {}, FormatOptions>(
    Object.values(ASSET_TYPES),
    options.formatOptions,
    assetType => DEFAULT_OPTIONS.formatOptions[assetType] || {}
  ),
  templates: {
    ...ASSET_TYPES_WITH_TEMPLATE.reduce((acc, assetType) => ({
      ...acc,
      [assetType]: join(TEMPLATES_DIR, `${assetType}.hbs`)
    }), {}),
    ...options.templates
  },
  assets
});

export const prefillOptions = <K extends AssetType, T, O = { [key in K]: T }>(
  keys: K[],
  userOptions: { [key in K]?: T } = {},
  getDefault: (type: K) => T
) => {
  console.log(userOptions);
  return keys.reduce(
    (cur = {}, type: K) => ({
      ...cur,
      [type]: mergeOptions(userOptions[type], getDefault(type))
    }),
    {}
  ) as O;
};

export const mergeOptions = <T>(input: T, defaultVal: T) => {
  if (typeof defaultVal === 'object') {
    return { ...defaultVal, ...input };
  }

  return input || defaultVal;
};
