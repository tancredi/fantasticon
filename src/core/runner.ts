import { DEFAULT_OPTIONS } from '../constants';
import { RunnerOptions, RunnerOptionsInput } from '../types/runner';
import {
  loadAssets,
  writeAssets,
  AssetsMap,
  WriteResults
} from '../utils/assets';
import { GeneratedAssets } from '../generators/generate-assets';
import { parseConfig } from './config-parser';
import { generateAssets } from '../generators';

export interface RunnerResults {
  options: RunnerOptions;
  writeResults: WriteResults;
  assetsIn: AssetsMap;
  assetsOut: GeneratedAssets;
}

export const sanitiseOptions = (userOptions: any) =>
  parseConfig({
    ...DEFAULT_OPTIONS,
    ...userOptions
  });

export const generateFonts = async (
  userOptions: RunnerOptionsInput,
  mustWrite = false
): Promise<RunnerResults> => {
  const options = await sanitiseOptions(userOptions);
  const { outputDir } = options;

  if (mustWrite && !outputDir) {
    throw new Error('You must specify an output path');
  }

  const assetsIn = await loadAssets(options.inputDir);
  const assetsOut = await generateAssets(assetsIn, options);
  const writeResults = outputDir ? await writeAssets(assetsOut, options) : [];

  return { options, assetsIn, assetsOut, writeResults };
};
