import { DEFAULT_OPTIONS } from '../constants';
import { RunnerOptions, RunnerOptionsInput } from '../types/runner';
import { loadAssets, writeAssets } from '../utils/assets';
import { generateAssets } from '../generators';

export default async (userOptions: RunnerOptionsInput) => {
  const options: RunnerOptions = { ...DEFAULT_OPTIONS, ...userOptions };
  const assets = await loadAssets(options.inputDir);
  const fonts = await generateAssets(assets, options);

  await writeAssets(fonts, options);
};
