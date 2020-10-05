import commander from 'commander';
import { RunnerOptionsInput } from '../types/runner';
import runner from '../core/runner';
import {
  parseNumeric,
  parseFontType,
  validatePositionals,
  removeUndefined
} from './utils';

const cli = () => {
  config();

  const options = buildOptions(commander.program.parse(process.argv));

  run(options);
};

const config = () => {
  commander.program
    .version('0.0.1')

    .requiredOption('-o, --output <value>', 'specify output directory')

    .option(
      '-t, --font-types <...value>',
      'specify font formats to generate',
      parseFontType
    )
    // formatOptions: { [key in FontType]?: any };
    // codepoints: CodepointsMap;
    .option(
      '-h, --font-height <...value>',
      'the output font height (icons will be scaled so the highest has this height)',
      parseNumeric
    )

    .option('-d, --descent <...value>', 'the font descent', parseNumeric)
    // normalize: boolean;

    .option(
      '-n, --normalize',
      'normalize icons by scaling them to the height of the highest icon'
    );

  // round: boolean;
};

const buildOptions = (cmd: commander.Command) => {
  const [inputDir] = cmd.args;

  validatePositionals(cmd.args);

  const options = removeUndefined({
    inputDir,
    outputDir: cmd.output,
    types: cmd.fontTypes,
    fontHeight: cmd.fontHeight,
    descent: cmd.descent
  }) as RunnerOptionsInput;

  return options;
};

const run = async (options: RunnerOptionsInput) => await runner(options);

cli();
