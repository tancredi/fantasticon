import { DEFAULT_OPTIONS } from '../constants';
import { RunnerOptions } from '../types/runner';
import {
  loadAssets,
  writeAssets,
  AssetsMap,
  WriteResults
} from '../utils/assets';
import { CodepointsMap } from '../utils/codepoints';
import { getGeneratorOptions } from '../generators/generator-options';
import { GeneratedAssets } from '../generators/generate-assets';
import { parseConfig } from './config-parser';
import { generateAssets } from '../generators';

export interface RunnerResults {
  options: RunnerOptions;
  writeResults: WriteResults;
  assetsIn: AssetsMap;
  assetsOut: GeneratedAssets;
  codepoints: CodepointsMap;
}

export const sanitiseOptions = (userOptions: any) =>
  parseConfig({
    ...DEFAULT_OPTIONS,
    ...userOptions
  });

export const generateFonts = async (
  userOptions: RunnerOptions,
  mustWrite = false
): Promise<RunnerResults> => {
  const options = await sanitiseOptions(userOptions);
  const { outputDir, inputDir } = options;

  if (!inputDir) {
    throw new Error('You must specify an input directory');
  }

  if (mustWrite && !outputDir) {
    throw new Error('You must specify an output directory');
  }

  const assetsIn = await loadAssets(options.inputDir);
  const generatorOptions = getGeneratorOptions(options, assetsIn);
  const assetsOut = await generateAssets(generatorOptions);
  const writeResults = outputDir ? await writeAssets(assetsOut, options) : [];
  const { codepoints } = generatorOptions;

  return {
    options,
    assetsIn,
    assetsOut,
    writeResults,
    codepoints
  };
};
