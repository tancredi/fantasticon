import { promisify } from 'util';
import * as fs from 'fs';

export const readFile = promisify(fs.readFile);
export const writeFile = promisify(fs.writeFile);
export const stat = promisify(fs.stat);

export const checkPath = async (
  filepath: string,
  type?: 'directory' | 'file'
) => {
  try {
    const result = await stat(filepath);

    if (type) {
      return type === 'directory' ? result.isDirectory() : result.isFile();
    }

    return true;
  } catch {
    return false;
  }
};
