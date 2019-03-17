import { FontGenerator, FontGeneratorOptions } from '../types/generator';
import { FontType } from '../types/misc';
import { RunnerOptions } from '../types/runner';
import { AssetsMap } from '../utils/assets';
import { getGeneratorOptions } from './generator-options';
import generators from './font-types';

export type GeneratedFonts = { [key in FontType]?: string | Buffer };

export const generateFonts = async (
  assets: AssetsMap,
  options: RunnerOptions
): Promise<GeneratedFonts> => {
  const generated: GeneratedFonts = {};
  const generatorOptions = getGeneratorOptions(options, assets);

  const generateFont = async (type: FontType) => {
    if (generated[type]) {
      return generated[type];
    }

    const generator = generators[type];
    const dependsOn = 'dependsOn' in generator && generator.dependsOn;

    if (dependsOn && !generated[dependsOn]) {
      generated[dependsOn] = await generateFont(dependsOn);
    }

    return (generated[type] = await generator.generate(
      generatorOptions,
      dependsOn ? generated[dependsOn] : null
    ));
  };

  for (const type of options.types) {
    await generateFont(type);
  }

  return options.types.reduce(
    (out, type: FontType) => ({ ...out, [type]: generated[type] }),
    {}
  );
};
