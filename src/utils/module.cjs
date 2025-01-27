export const getFileName = () => __filename;

export const getDirName = () => __dirname;

export const getPackageInfo = () => {
  const { bin, name, version } = require('../../../package.json');
  return { bin, name, version };
};
