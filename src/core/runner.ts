import { DEFAULT_OPTIONS } from '../constants';
import { RunnerOptionsInput } from '../types/runner';
import { loadAssets } from '../utils/assets';
import { generateFonts } from '../generators';

export default async (userOptions: RunnerOptionsInput) => {
  const options = { ...DEFAULT_OPTIONS, ...userOptions };
  const assets = await loadAssets(options.inputDir);
  const fonts = await generateFonts(assets, options);

  console.log(fonts);
};
