import { DEFAULT_OPTIONS } from '../constants';
import { RunnerOptionsInput } from '../types/runner';
import { loadAssets, writeAssets } from '../utils/assets';
import { generateAssets } from '../generators';

export const sanitiseOptions = (userOptions: RunnerOptionsInput) => ({
  ...DEFAULT_OPTIONS,
  ...userOptions
});

export const generateFontAssets = async (
  userOptions: RunnerOptionsInput,
  options = sanitiseOptions(userOptions)
) => await generateAssets(await loadAssets(options.inputDir), options);

export default async (userOptions: RunnerOptionsInput) => {
  const options = sanitiseOptions(userOptions);
  const outputAssets = await generateFontAssets(userOptions, options);

  await writeAssets(outputAssets, options);
};
