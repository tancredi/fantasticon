const _path = jest.requireActual('path');
const _relative = _path.relative;

const projectDir = _path.resolve(__dirname, '../../');

const resolve = (...paths: string[]) => {
  let path = '';

  for (const cur of paths) {
    path = !path ? normalize(cur) : _path.join(path, normalize(cur));
  }

  if (path.startsWith(projectDir)) {
    path = _path.join('/root/project', path.substr(projectDir.length));
  } else if (path.startsWith('/') && !path.startsWith('/root')) {
    path = _path.join('/root/', path.substr(1));
  } else {
    if (path.startsWith('./')) {
      path = _path.join('/root/project/', path.substr(2));
    } else if (!path.startsWith('/')) {
      path = _path.join('/root/project/', path);
    }
  }

  return normalize(path);
};

const relative = (a: string, b: string) =>
  normalize(_relative(_path.normalize(a), _path.normalize(b)));

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

const normalize = (path: string) => path.replace(/\\/g, '/');

const isAbsolute = (path: string) => path.startsWith('/root');

module.exports = { resolve, relative, join, isAbsolute, normalize };
