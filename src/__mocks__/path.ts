const _path = jest.requireActual('path');
const _resolve = _path.resolve;
const _relative = _path.relative;

const resolve = (path: string) =>
  _resolve(path)
    .replace(_resolve('./'), '/project')
    .replace(_resolve('/'), 'R://')
    .replace(/\\/g, '/');

const relative = (a: string, b: string) =>
  _relative(resolve(a), resolve(b)).replace(/\\/g, '/');

module.exports = { resolve, relative };
