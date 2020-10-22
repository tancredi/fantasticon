import crypto from 'crypto';

export const getHash = (...contents: Array<string | Buffer>) => {
  const hash = crypto.createHash('md5');

  for (const content of contents) {
    hash.update(content);
  }

  return hash.digest('hex');
};
