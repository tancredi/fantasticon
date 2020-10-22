import commander from 'commander';
import { RunnerOptionsInput } from '../types/runner';
import { FontAssetType, OtherAssetType } from '../types/misc';
import { loadConfig, DEFAULT_FILEPATHS } from './config-loader';
import { DEFAULT_OPTIONS } from '../constants';
import runner from '../core/runner';
import { removeUndefined } from '../utils/validation';
import { parseConfig } from '../core/config-parser';

const cli = async () => {
  config();

  const options = await buildOptions(commander.program.parse(process.argv));

  run(options);
};

const printList = (available: { [key: string]: string }, defaults: string[]) =>
  ` (default: ${defaults.join(', ')}, available: ${Object.values(
    available
  ).join(', ')})`;

const printConfigPaths = () => DEFAULT_FILEPATHS.join(' | ');

const config = () => {
  commander.program
    .version('0.0.1')

    .option(
      '-c, --config <value>',
      `custom config path (default: ${printConfigPaths()})`
    )

    .option('-o, --output <value>', 'specify output directory')

    .option(
      '-t, --font-types <value...>',
      `specify font formats to generate` +
        printList(FontAssetType, DEFAULT_OPTIONS.fontTypes)
    )

    .option(
      '-g --asset-types <value...>',
      `specify other asset types to generate` +
        printList(OtherAssetType, DEFAULT_OPTIONS.assetTypes)
    )

    .option(
      '-h, --font-height <value>',
      'the output font height (icons will be scaled so the highest has this height)',
      DEFAULT_OPTIONS.fontHeight as any
    )

    .option(
      '-d, --descent <value>',
      'the font descent',
      DEFAULT_OPTIONS.descent as any
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
      DEFAULT_OPTIONS.selector
    )

    .option('-t, --tag <value>', 'CSS base tag for icons', DEFAULT_OPTIONS.tag)

    .option(
      '-p, --prefix <value>',
      'CSS classname prefix for icons',
      DEFAULT_OPTIONS.prefix
    );
};

const buildOptions = async (cmd: commander.Command) => {
  const [inputDir] = cmd.args;

  return (await parseConfig({
    ...(await loadConfig(cmd.config)),
    ...removeUndefined({
      inputDir,
      outputDir: cmd.output,
      fontTypes: cmd.fontTypes,
      assetTypes: cmd.assetTypes,
      fontHeight: cmd.fontHeight,
      descent: cmd.descent,
      normalize: cmd.normalize,
      round: cmd.round,
      selector: cmd.selector,
      tag: cmd.tag
    })
  })) as RunnerOptionsInput;
};

const run = async (options: RunnerOptionsInput) => await runner(options);

cli();
