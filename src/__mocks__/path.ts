const _path = require.requireActual('path');
const _resolve = _path.resolve;
const _relative = _path.relative;

module.exports = {
  resolve: path => _resolve(path).replace(_resolve('./'), '/root'),
  relative: _relative
};
