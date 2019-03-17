import { FontType } from '../types/misc';
import { FontGenerator, FontGeneratorOptions } from '../types/generator';
import { RunnerOptions } from '../types/runner';
import { AssetsMap } from '../utils/assets';
import svg from './svg';
import ttf from './ttf';
import woff from './woff';
import woff2 from './woff2';
import eot from './eot';

export type GeneratedFonts = { [key in FontType]?: string | Buffer };

const generators: { [key in FontType]: FontGenerator<any> } = {
  [FontType.SVG]: svg,
  [FontType.TTF]: ttf,
  [FontType.WOFF]: woff,
  [FontType.WOFF2]: woff2,
  [FontType.EOT]: eot
};

export const generateFonts = async (
  assets: AssetsMap,
  options: RunnerOptions
): Promise<GeneratedFonts> => {
  const generated: GeneratedFonts = {};
  const formatOptions = getFormatOptions(options.formatOptions);
  const generatorOptions: FontGeneratorOptions = {
    ...options,
    formatOptions,
    assets
  };

  const generateFont = async (type: FontType) => {
    if (generated[type]) {
      return generated[type];
    }

    const generator = generators[type];
    const dependsOn = 'dependsOn' in generator && generator.dependsOn;

    if (dependsOn && !generated[dependsOn]) {
      generated[dependsOn] = await generateFont(dependsOn);
    }

    generated[type] = await generator.generate(
      generatorOptions,
      dependsOn ? generated[dependsOn] : null
    );
  };

  for (const type of options.types) {
    await generateFont(type);
  }

  return generated;
};

export const getFormatOptions = (
  userOptions: RunnerOptions['formatOptions'] = {}
): FontGeneratorOptions['formatOptions'] =>
  Object.values(FontType).reduce(
    (cur = {}, type: FontType) => ({ ...cur, [type]: userOptions[type] || {} }),
    {}
  );
