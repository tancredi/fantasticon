export const getPackageInfo = () => {
  const { bin, name, version } = require('../../package.json');
  return { bin, name, version };
};
