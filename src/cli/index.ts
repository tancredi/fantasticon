import commander from 'commander';
import { RunnerOptionsInput } from '../types/runner';
import { FontAssetType, OtherAssetType } from '../types/misc';
import { DEFAULT_OPTIONS } from '../constants';
import runner from '../core/runner';
import {
  parseNumeric,
  parseString,
  listMembersParser,
  validatePositionals,
  removeUndefined
} from './utils';

const cli = () => {
  config();

  const options = buildOptions(commander.program.parse(process.argv));

  run(options);
};

const showDefaultArr = (values: string[]) =>
  ` (default: ${values.map(val => `'${val}'`).join(', ')})`;

const config = () => {
  commander.program
    .version('0.0.1')

    .requiredOption('-o, --output <value>', 'specify output directory')

    .option(
      '-t, --font-types [...value]',
      `specify font formats to generate` +
        showDefaultArr(DEFAULT_OPTIONS.fontTypes),
      listMembersParser<FontAssetType>(
        Object.values(FontAssetType),
        'font type'
      )
    )

    .option(
      '--asset-types [...value]',
      `specify other asset types to generate` +
        showDefaultArr(DEFAULT_OPTIONS.assetTypes),
      listMembersParser<OtherAssetType>(
        Object.values(OtherAssetType),
        'asset type'
      )
    )
    // formatOptions: { [key in FontType]?: any };
    // codepoints: CodepointsMap;
    .option(
      '-h, --font-height <value>',
      'the output font height (icons will be scaled so the highest has this height)',
      parseNumeric,
      DEFAULT_OPTIONS.fontHeight
    )

    .option(
      '-d, --descent <value>',
      'the font descent',
      parseNumeric,
      DEFAULT_OPTIONS.descent
    )

    .option(
      '-n, --normalize',
      'normalize icons by scaling them to the height of the highest icon',
      DEFAULT_OPTIONS.normalize
    )

    .option('-r, --round', 'setup the SVG path rounding [10e12]')

    .option(
      '--selector <value>',
      "Use a CSS selector instead of 'tag + prefix'",
      parseString,
      DEFAULT_OPTIONS.selector
    )

    .option(
      '-t, --tag <value>',
      'CSS base tag for icons',
      parseString,
      DEFAULT_OPTIONS.tag
    )

    .option(
      '-p, --prefix <value>',
      'CSS classname prefix for icons',
      parseString,
      DEFAULT_OPTIONS.prefix
    );
};

const buildOptions = (cmd: commander.Command) => {
  const [inputDir] = cmd.args;

  validatePositionals(cmd.args);

  return removeUndefined({
    inputDir,
    outputDir: cmd.output,
    fontTypes: cmd.fontTypes,
    fontHeight: cmd.fontHeight,
    descent: cmd.descent,
    normalize: cmd.normalize,
    round: cmd.round,
    selector: cmd.selector,
    tag: cmd.tag
  }) as RunnerOptionsInput;
};
const run = async (options: RunnerOptionsInput) => await runner(options);

cli();
