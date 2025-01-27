import { join } from 'path';
import { DEFAULT_OPTIONS, TEMPLATES_DIR } from '../constants.js';
import { RunnerOptions } from '../types/runner.js';
import { FormatOptions } from '../types/format.js';
import { getCodepoints } from '../utils/codepoints.js';
import { FontGeneratorOptions } from '../types/generator.js';
import {
  AssetType,
  OtherAssetType,
  ASSET_TYPES,
  ASSET_TYPES_WITH_TEMPLATE
} from '../types/misc.js';
import { AssetsMap } from '../utils/assets.js';

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
  templates: prefillOptions<OtherAssetType, string>(
    ASSET_TYPES_WITH_TEMPLATE,
    options.templates,
    assetType => join(TEMPLATES_DIR, `${assetType}.hbs`)
  ),
  assets
});

export const prefillOptions = <K extends AssetType, T, O = { [key in K]: T }>(
  keys: K[],
  userOptions: { [key in K]?: T } = {},
  getDefault: (type: K) => T
) =>
  keys.reduce(
    (cur = {}, type: K) => ({
      ...cur,
      [type]: mergeOptions(userOptions[type], getDefault(type))
    }),
    {}
  ) as O;

export const mergeOptions = <T>(input: T, defaultVal: T) => {
  if (typeof defaultVal === 'object') {
    return { ...defaultVal, ...input };
  }

  return input || defaultVal;
};
