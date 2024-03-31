import { glob } from 'glob';
import { resolve, relative, join } from 'path';
import { removeExtension, splitSegments } from '../utils/path';
import { writeFile } from './fs-async';
import { RunnerOptions } from '../types/runner';
import { GeneratedAssets } from '../generators/generate-assets';

export type WriteResult = { content: string | Buffer; writePath: string };

export type WriteResults = WriteResult[];

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
  const globPath = join(dir, `**/*.${ASSETS_EXTENSION}`);
  const files = await glob(globPath, {});

  if (!files.length) {
    throw new Error(`No SVGs found in ${dir}`);
  }

  return files;
};

const failForConflictingId = (
  { relativePath: pathA, id }: IconAsset,
  { relativePath: pathB }: IconAsset
): void => {
  throw new Error(
    `Conflicting result from 'getIconId': '${id}' - conflicting input files:\n` +
      [pathA, pathB].map(fpath => `  - ${fpath}`).join('\n')
  );
};

export const loadAssets = async ({
  inputDir,
  getIconId
}: RunnerOptions): Promise<AssetsMap> => {
  const paths = await loadPaths(inputDir);
  const out = {};
  let index = 0;

  for (const path of paths) {
    const relativePath = relative(resolve(inputDir), resolve(path));
    const parts = splitSegments(relativePath);
    const basename = removeExtension(parts.pop());
    const absolutePath = resolve(path);
    const iconId = getIconId({
      basename,
      relativeDirPath: join(...parts),
      absoluteFilePath: absolutePath,
      relativeFilePath: relativePath,
      index
    });

    const result: IconAsset = { id: iconId, relativePath, absolutePath };

    if (out[iconId]) {
      failForConflictingId(out[iconId], result);
    }

    out[iconId] = result;

    index++;
  }

  return out;
};

export const writeAssets = async (
  assets: GeneratedAssets,
  { name, pathOptions = {}, outputDir }: RunnerOptions
) => {
  const results: WriteResults = [];

  for (const ext of Object.keys(assets)) {
    const filename = [name, ext].join('.');
    const writePath = pathOptions[ext] || join(outputDir, filename);
    results.push({ content: assets[ext], writePath });
    await writeFile(writePath, assets[ext]);
  }

  return results;
};
