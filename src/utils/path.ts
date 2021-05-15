import { normalize } from 'path';

export const removeExtension = (path: string) =>
  path.includes('.') ? path.split('.').slice(0, -1).join('.') : path;

export const splitSegments = (path: string): string[] =>
  normalize(path)
    .split(/\/|\\/)
    .filter(part => part && part !== '.');
