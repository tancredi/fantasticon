import color from 'cli-color';
import figures from 'figures';
import { RunnerResults } from '../core/runner';
import { pluralize } from '../utils/string';

export const getLogger = (debug = false, silent = false) => ({
  error(error: Error | string) {
    const message = (error instanceof Error && error.message) || error;

    console.log(color.red(message));

    debug && error instanceof Error && console.log(error.stack);
  },

  log(...values: any[]) {
    !silent && console.log(...values);
  },

  start(loadedConfigPath: string = null) {
    this.log(color.yellow('Generating font kit...'));

    if (loadedConfigPath) {
      this.log(
        color.green(
          `${figures.tick} Using configuration file: ${color.green.bold(
            loadedConfigPath
          )}`
        )
      );
    }
  },

  results({ assetsIn, writeResults, options: { inputDir } }: RunnerResults) {
    const iconsCount = Object.values(assetsIn).length;

    this.log(
      color.white(
        `${figures.tick} ${iconsCount} ${pluralize(
          'SVG',
          iconsCount
        )} found in ${inputDir}`
      )
    );

    for (const { writePath } of writeResults) {
      this.log(
        color.blue(`${figures.tick} Generated`, color.blueBright(writePath))
      );
    }

    this.log(color.green.bold('Done'));
  }
});
