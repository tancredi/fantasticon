import { existsSync } from 'fs';
import { normalize, resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const MAX_LOOKUP_DEPTH = 5;

const getFileName = () =>
  typeof __filename !== 'undefined'
    ? __filename
    : fileURLToPath(import.meta.url);

const getDirName = () => dirname(getFileName());

export const removeExtension = (path: string) =>
  path.includes('.') ? path.split('.').slice(0, -1).join('.') : path;

export const splitSegments = (path: string): string[] =>
  normalize(path)
    .split(/\/|\\/)
    .filter(part => part && part !== '.');

export const getRoot = () => {
  let current = getDirName();

  for (let i = 0; i < MAX_LOOKUP_DEPTH; i++) {
    const pkg = join(current, 'package.json');

    if (existsSync(pkg)) return resolve(current);

    const parent = dirname(current);

    current = parent;
  }

  throw new Error('Module root not found');
};
