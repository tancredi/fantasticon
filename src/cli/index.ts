import commander from 'commander';
import { FontAssetType, OtherAssetType } from '../types/misc';
import { loadConfig, DEFAULT_FILEPATHS } from './config-loader';
import { DEFAULT_OPTIONS } from '../constants';
import { generateFonts } from '../core/runner';
import { removeUndefined } from '../utils/validation';
import { getLogger } from './logger';

const cli = async () => {
  config();
  const input = commander.program.parse(process.argv);
  const logger = getLogger(input.debug, input.silent);

  try {
    const { loadedConfig, loadedConfigPath } = await loadConfig(input.config);
    const results = await run(await buildOptions(input, loadedConfig));
    logger.start(loadedConfigPath);
    logger.results(results);
  } catch (error) {
    logger.error(error);
    process.exitCode = 1;
  }
};

const printList = (available: { [key: string]: string }, defaults: string[]) =>
  ` (default: ${defaults.join(', ')}, available: ${Object.values(
    available
  ).join(', ')})`;

const printConfigPaths = () => DEFAULT_FILEPATHS.join(' | ');

const config = () => {
  commander.program
    .version('0.0.1')

    .arguments('[input-dir]')

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
      '--descent <value>',
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
      "use a CSS selector instead of 'tag + prefix'",
      DEFAULT_OPTIONS.selector
    )

    .option('-t, --tag <value>', 'CSS base tag for icons', DEFAULT_OPTIONS.tag)

    .option(
      '-u, --fonts-url <value>',
      'public url to the fonts directory (used in the generated CSS)',
      DEFAULT_OPTIONS.prefix
    )

    .option('--debug', 'display errors stack trace', false)

    .option('--silent', 'run with no logs', false);
};

const buildOptions = async (cmd: commander.Command, loadedConfig = {}) => {
  const [inputDir] = cmd.args;

  return {
    ...loadedConfig,
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
      tag: cmd.tag,
      fontsUrl: cmd.fontsUrl
    })
  };
};

const run = async (options: any) => await generateFonts(options, true);

cli();
