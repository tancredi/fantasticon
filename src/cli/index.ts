import commander from 'commander';
import { FontAssetType, OtherAssetType } from '../types/misc';
import { loadConfig, DEFAULT_FILEPATHS } from './config-loader';
import { DEFAULT_OPTIONS } from '../constants';
import { generateFonts } from '../core/runner';
import { removeUndefined } from '../utils/validation';
import { getLogger } from './logger';

const {
  bin,
  name: packageName,
  version
} = require('../../package.json') as any;

const getCommandName = () => (bin && Object.keys(bin)[0]) || packageName;

const cli = async () => {
  config();
  const input = commander.program.parse(process.argv);
  const { debug, silent, config: configPath } = input.opts();
  const logger = getLogger(debug, silent);

  try {
    const { loadedConfig, loadedConfigPath } = await loadConfig(configPath);
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

const printDefaultValue = (value: any) => {
  let printVal = String(value);

  if (typeof value === 'undefined') {
    return '';
  }

  return ` (default: ${printVal})`;
};

const printDefaultOption = (key: string) =>
  printDefaultValue(DEFAULT_OPTIONS[key]);

const printConfigPaths = () => DEFAULT_FILEPATHS.join(' | ');

const config = () => {
  commander.program
    .storeOptionsAsProperties(false)

    .name(getCommandName())

    .version(version)

    .arguments('[input-dir]')

    .option(
      '-c, --config <value>',
      `custom config path (default: ${printConfigPaths()})`
    )

    .option('-o, --output <value>', 'specify output directory')

    .option(
      '-n, --name <value>',
      'base name of the font set used both as default asset name' +
        printDefaultOption('name')
    )

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
      'the output font height (icons will be scaled so the highest has this height)' +
        printDefaultOption('fontHeight')
    )

    .option(
      '--descent <value>',
      'the font descent' + printDefaultOption('descent' as any)
    )

    .option(
      '--normalize [bool]',
      'normalize icons by scaling them to the height of the highest icon' +
        printDefaultOption('normalize')
    )

    .option('-r, --round [bool]', 'setup the SVG path rounding [10e12]')

    .option(
      '--selector <value>',
      "use a CSS selector instead of 'tag + prefix'" +
        printDefaultOption('selector')
    )

    .option(
      '-p, --prefix <value>',
      'CSS class prefix' + printDefaultOption('prefix')
    )

    .option(
      '--tag <value>',
      'CSS base tag for icons' + printDefaultOption('tag')
    )

    .option(
      '-u, --fonts-url <value>',
      'public URL to the fonts directory (used in the generated CSS)'
    )

    .option('--debug', 'display errors stack trace' + printDefaultValue(false))

    .option('--silent', 'run with no logs' + printDefaultValue(false));
};

const buildOptions = async (cmd: commander.Command, loadedConfig = {}) => {
  const [inputDir] = cmd.args;
  const opts = cmd.opts();

  return {
    ...loadedConfig,
    ...removeUndefined({
      inputDir,
      outputDir: opts.output,
      name: opts.name,
      fontTypes: opts.fontTypes,
      assetTypes: opts.assetTypes,
      fontHeight: opts.fontHeight,
      descent: opts.descent,
      normalize: opts.normalize,
      round: opts.round,
      selector: opts.selector,
      tag: opts.tag,
      prefix: opts.prefix,
      fontsUrl: opts.fontsUrl
    })
  };
};

const run = async (options: any) => await generateFonts(options, true);

cli();
