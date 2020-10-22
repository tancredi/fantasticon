import { slashJoin } from './path';
import glob from 'glob';
import { promisify } from 'util';
import { resolve, relative } from 'path';
import { getIconId } from './icon-id';
import { writeFile } from '../utils/fs-async';
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

export const loadPaths = async (dir: string): Promise<string[]> => {
  const globPath = slashJoin(dir, `**/*.${ASSETS_EXTENSION}`);

  const files = await promisify(glob)(globPath, {});

  if (!files.length) {
    throw new Error(`No SVGs found in ${dir}`);
  }

  return files;
};

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
  { name, pathOptions, outputDir }: RunnerOptions
) => {
  for (const ext of Object.keys(assets)) {
    const writeDir = (pathOptions || {})[ext] || outputDir;
    const filename = [name, ext].join('.');
    await writeFile(slashJoin(writeDir, filename), assets[ext]);
  }
};
