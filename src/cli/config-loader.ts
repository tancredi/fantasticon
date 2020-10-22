import { slashJoin } from '../utils/path';
import { readFile, fileExists } from '../utils/fs-async';

export const DEFAULT_FILEPATHS = [
  '.iconfontrc',
  'iconfontrc',
  '.iconfontrc.json',
  'iconfontrc.json',
  '.iconfontrc.js',
  'iconfontrc.js'
];

const attemptLoading = async (filepath: string): Promise<any | void> => {
  if (await fileExists(filepath)) {
    try {
      return require(slashJoin(process.cwd(), filepath));
    } catch (err) {}

    try {
      return JSON.parse(await readFile(filepath, 'utf8'));
    } catch (err) {}

    throw new Error(`Failed parsing configuration at '${filepath}'`);
  }
};

export const loadConfig = async (filepath?: string) => {
  let loaded = {};

  if (filepath) {
    loaded = await attemptLoading(filepath);
  } else {
    for (const filepath of DEFAULT_FILEPATHS) {
      loaded = await attemptLoading(filepath);

      if (loaded) {
        break;
      }
    }
  }

  return loaded;
};
