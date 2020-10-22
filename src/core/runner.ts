import { DEFAULT_OPTIONS } from '../constants';
import { RunnerOptionsInput } from '../types/runner';
import { loadAssets, writeAssets } from '../utils/assets';
import { parseConfig } from './config-parser';
import { generateAssets } from '../generators';

export const sanitiseOptions = (userOptions: any) =>
  parseConfig({
    ...DEFAULT_OPTIONS,
    ...userOptions
  });

export const generateFonts = async (
  userOptions: RunnerOptionsInput,
  mustWrite = false
) => {
  const options = await sanitiseOptions(userOptions);
  const { outputDir } = options;

  if (mustWrite && !outputDir) {
    throw new Error('You must specify an output path');
  }

  const assetsIn = await loadAssets(options.inputDir);
  const assetsOut = await generateAssets(assetsIn, options);
  const writeResults = outputDir ? await writeAssets(assetsOut, options) : [];

  return { options, writeResults };
};
