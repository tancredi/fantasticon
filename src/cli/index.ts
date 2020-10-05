import commander from 'commander';
import { RunnerOptionsInput } from '../types/runner';
import runner from '../core/runner';
import { parseNumeric, parseFontType, validatePositionals } from './utils';

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
      'list of font formats to generate',
      parseFontType
    )
    // formatOptions: { [key in FontType]?: any };
    // codepoints: CodepointsMap;
    .option(
      '-h, --font-height <...value>',
      'height in points of the genrated font',
      parseNumeric
    )

    .option(
      '-d, --descent <...value>',
      'font descent value in points',
      parseNumeric
    );
  // normalize: boolean;
  // round: boolean;
};

const buildOptions = (cmd: commander.Command) => {
  const [inputDir] = cmd.args;

  validatePositionals(cmd.args);

  const options: RunnerOptionsInput = {
    inputDir,
    outputDir: cmd.output,
    types: cmd.fontTypes,
    fontHeight: cmd.fontHeight,
    descent: cmd.descent
  };

  return options;
};

const run = async (options: RunnerOptionsInput) => await runner(options);

cli();
