import { DEFAULT_OPTIONS } from '../constants.js';
import { RunnerOptions } from '../types/runner.js';
import {
  loadAssets,
  writeAssets,
  AssetsMap,
  WriteResults
} from '../utils/assets.js';
import { CodepointsMap } from '../utils/codepoints.js';
import { getGeneratorOptions } from '../generators/generator-options.js';
import { GeneratedAssets } from '../generators/generate-assets.js';
import { parseConfig } from './config-parser.js';
import { generateAssets } from '../generators/index.js';

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

  const assetsIn = await loadAssets(options);
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
