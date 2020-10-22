import color from 'cli-color';
import { RunnerResults } from '../core/runner';

export const getLogger = (debug = false, silent = false) => ({
  error(error: Error | string) {
    const message = (error instanceof Error && error.message) || error;

    console.log(color.red(message));

    debug && error instanceof Error && console.log(error.stack);
  },

  log(...values: any[]) {
    !silent && console.log(...values);
  },

  start() {
    this.log(color.yellow(`Generating font kit..`));
  },

  results({ assetsIn, writeResults, options: { inputDir } }: RunnerResults) {
    const iconsCount = Object.values(assetsIn).length;

    this.log(color.white(`✔ ${iconsCount} svg found in ${inputDir}`));

    for (const { writePath } of writeResults) {
      this.log(color.blue(`✔ Generated`, color.blueBright(writePath)));
    }

    this.log(color.green.bold('Done'));
  }
});
