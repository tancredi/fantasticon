import { promisify } from 'util';
import * as fs from 'fs';

export const readFile = promisify(fs.readFile);
export const writeFile = promisify(fs.writeFile);
export const stat = promisify(fs.stat);
export const fileExists = async (filepath: string) => {
  try {
    return (await stat(filepath)).isFile();
  } catch (err) {
    return false;
  }
};
