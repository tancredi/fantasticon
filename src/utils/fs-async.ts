import { stat } from 'fs/promises';

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
  } catch (err) {
    return false;
  }
};
