import { resolve } from 'path';
import { DEFAULT_OPTIONS } from '../constants';
import { FormatOptions, RunnerOptions } from '../types/runner';
import { getCodepoints } from '../utils/codepoints';
import { FontGeneratorOptions } from '../types/generator';
import { AssetType, OtherAssetType, ASSET_TYPES } from '../types/misc';
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
  templates: prefillOptions<AssetType, string>(
    Object.values(OtherAssetType).filter(assetType =>
      ['css', 'html', 'sass', 'scss'].includes(assetType)
    ),
    options.templates,
    assetType => resolve(__dirname, `../../templates/${assetType}.hbs`)
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
      [type]: merge(userOptions[type], getDefault(type))
    }),
    {}
  ) as O;

export const merge = <T>(input: T, defaultVal: T) => {
  if (typeof defaultVal === 'object') {
    return { ...defaultVal, ...input };
  }

  return input || defaultVal;
};
