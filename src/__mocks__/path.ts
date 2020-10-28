import startsWith from 'lodash/startsWith';
const _path = jest.requireActual('path');
const _relative = _path.relative;

const projectDir = _path.resolve(__dirname, '../../');

const resolve = (...paths: string[]) => {
  let path = '';

  for (const cur of paths) {
    path = !path ? normalise(cur) : _path.join(path, normalise(cur));
  }

  if (startsWith(path, projectDir)) {
    path = _path.join('/root/project', path.substr(projectDir.length));
  } else if (startsWith(path, '/') && !startsWith(path, '/root')) {
    path = _path.join('/root/', path.substr(1));
  } else {
    if (startsWith(path, './')) {
      path = _path.join('/root/project/', path.substr(2));
    } else if (!startsWith(path, '/')) {
      path = _path.join('/root/project/', path);
    }
  }

  return normalise(path);
};

const relative = (a: string, b: string) => normalise(_relative(a, b));

const normalise = (path: string) => path.replace(/\\/g, '/');

module.exports = { resolve, relative };
