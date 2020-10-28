const _path = jest.requireActual('path');
const _resolve = _path.resolve;
const _relative = _path.relative;

const resolve = (path: string) =>
  _resolve(path)
    .replace(_resolve('./'), '/project')
    .replace(_resolve('/'), '[root]/');

const relative = (a: string, b: string) => _relative(resolve(a), resolve(b));

module.exports = { resolve, relative };
