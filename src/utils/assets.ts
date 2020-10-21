import { slashJoin } from './path';
import { writeFile } from 'fs';
import { promisify } from 'util';
import glob from 'glob';
import { resolve, relative } from 'path';
import { getIconId } from './icon-id';
import { RunnerOptions } from '../types/runner';
import { GeneratedAssets } from '../generators/generate-assets';

export interface IconAsset {
  id: string;
  absolutePath: string;
  relativePath: string;
}

export interface AssetsMap {
  [key: string]: IconAsset;
}

export const ASSETS_EXTENSION = 'svg';

export const loadPaths = (dir: string): Promise<string[]> =>
  new Promise((resolve, reject) => {
    const globPath = slashJoin(dir, `**/*.${ASSETS_EXTENSION}`);

    glob(globPath, {}, (err, files) => {
      if (err) {
        return reject(err);
      }

      if (!files.length) {
        return reject(new Error(`No SVGs found in ${dir}`));
      }

      resolve(files);
    });
  });

export const loadAssets = async (dir: string): Promise<AssetsMap> => {
  const paths = await loadPaths(dir);
  const out = {};

  for (const path of paths) {
    const iconId = getIconId(path, dir);

    out[iconId] = {
      id: iconId,
      absolutePath: resolve(path),
      relativePath: relative(resolve(dir), resolve(path))
    };
  }

  return out;
};

export const writeAssets = async (
  assets: GeneratedAssets,
  { name, outputDir }: RunnerOptions
) => {
  for (const ext of Object.keys(assets)) {
    const filename = [name, ext].join('.');
    await promisify(writeFile)(slashJoin(outputDir, filename), assets[ext]);
  }
};
