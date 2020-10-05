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

    .option(
      '-n, --normalize',
      'normalize icons by scaling them to the height of the highest icon'
    )

    .option('-r, --round', 'setup the SVG path rounding [10e12]');
};

const buildOptions = (cmd: commander.Command) => {
  const [inputDir] = cmd.args;

  validatePositionals(cmd.args);

  return removeUndefined({
    inputDir,
    outputDir: cmd.output,
    types: cmd.fontTypes,
    fontHeight: cmd.fontHeight,
    descent: cmd.descent,
    normalize: cmd.normalize,
    round: cmd.round
  }) as RunnerOptionsInput;
};

const run = async (options: RunnerOptionsInput) => await runner(options);

cli();
