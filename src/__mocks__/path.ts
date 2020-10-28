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

const relative = (a: string, b: string) =>
  normalise(_relative(_path.normalize(a), _path.normalize(b)));

const join = (...segments: string[]): string => {
  const trimmed: string[] = [];

  segments.forEach((current, i) => {
    const isFirst = i === 0;
    const isLast = i === segments.length - 1;

    if (!isFirst && current.substr(0, 1) === '/') {
      current = current.substr(1);
    }

    if (!isLast && current.substr(-1) === '/') {
      current = current.substring(0, current.length - 1);
    }

    trimmed.push(current);
  });

  return trimmed.join('/');
};

const normalise = (path: string) => path.replace(/\\/g, '/');

module.exports = { resolve, relative, join };
