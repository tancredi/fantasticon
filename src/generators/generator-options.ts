import { RunnerOptions } from '../types/runner';
import { FontGeneratorOptions } from '../types/generator';
import { FontType } from '../types/misc';
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
  Object.values(FontType).reduce(
    (cur = {}, type: FontType) => ({ ...cur, [type]: userOptions[type] || {} }),
    {}
  ) as FontGeneratorOptions['formatOptions'];
